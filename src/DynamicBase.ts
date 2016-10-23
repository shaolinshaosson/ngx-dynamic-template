import {
	Component,
	Input,
	Inject,
	Output,
	Compiler,
	OnChanges,
	OnDestroy,
	EventEmitter,
	NgModule,
	ViewContainerRef,
	ComponentRef,
	ModuleWithComponentFactories,
	ComponentFactory,
	Type,
	ReflectiveInjector
} from '@angular/core';

import {CommonModule} from "@angular/common";

import {
	Http,
	Response,
	RequestOptionsArgs
} from '@angular/http';

import {
	MetadataHelper,
	IAnnotationMetadataHolder,
	DecoratorType
} from 'ts-metadata-helper/index';

import {IComponentRemoteTemplateFactory} from './IComponentRemoteTemplateFactory';
import {Utils} from './Utils';

export interface IComponentContext {
	[index: string]: any;
}

export type TDynamicComponentType = Function;

export const DYNAMIC_TYPES = {
	DynamicExtraModules: 'DynamicExtraModules'  // AoT workaround Symbol(..)
};

export class DynamicBase implements OnChanges, OnDestroy {

	@Output() dynamicComponentReady:EventEmitter<void>;
	@Output() dynamicComponentBeforeReady:EventEmitter<void>;

	@Input() componentType: {new (): TDynamicComponentType};
	@Input() componentTemplate: string;
	@Input() componentContext: IComponentContext;
	@Input() componentTemplateUrl: string;
	@Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
	@Input() componentModules: Array<any>;

	private injector:ReflectiveInjector;

	private cachedDynamicModule:Type<any>;
	private cachedDynamicComponent:Type<TDynamicComponentType>;
	private componentInstance: ComponentRef<TDynamicComponentType>;

	constructor(@Inject(DYNAMIC_TYPES.DynamicExtraModules) protected dynamicExtraModules: Array<any>,
	            protected viewContainer: ViewContainerRef,
	            protected compiler: Compiler,
	            protected http: Http,
				protected dynamicSelector:string) {
		this.dynamicComponentReady = new EventEmitter<void>(false);
		this.dynamicComponentBeforeReady = new EventEmitter<void>(false);

		this.injector = ReflectiveInjector.fromResolvedProviders([], this.viewContainer.parentInjector);
	}

	/**
	 * @override
	 */
	public ngOnChanges() {
		this.dynamicComponentBeforeReady.emit(null);

		this.getDynamicModule().then((module: Type<any>) =>
			this.compiler.compileModuleAndAllComponentsAsync<any>(module)
				.then((moduleWithComponentFactories: ModuleWithComponentFactories<any>) => {
					this.componentInstance = this.viewContainer.createComponent<TDynamicComponentType>(
						moduleWithComponentFactories.componentFactories.find((componentFactory: ComponentFactory<Type<any>>) =>
							componentFactory.selector === this.dynamicSelector
							|| componentFactory.componentType === this.componentType
						),
						0,
						this.injector
					);

					this.applyPropertiesToDynamicComponent(this.componentInstance.instance);

					this.dynamicComponentReady.emit(null);
				})
		);
	}

	/**
	 * @override
	 */
	public ngOnDestroy() {
		if (Utils.isPresent(this.componentInstance)) {
			this.componentInstance.destroy();
		}
		if (Utils.isPresent(this.cachedDynamicModule)) {
			this.compiler.clearCacheFor(this.cachedDynamicModule);
		}
		if (Utils.isPresent(this.cachedDynamicComponent)) {
			this.compiler.clearCacheFor(this.cachedDynamicComponent);
		}
	}

	protected getDynamicModule(): Promise<Type<any>> {
		return new Promise((resolve: (value: Type<any>) => void) => {
			if (Utils.isPresent(this.componentTemplate)) {
				resolve(this.makeComponentModule(this.componentTemplate));
			} else if (Utils.isPresent(this.componentTemplateUrl)) {
				this.loadRemoteTemplate(this.componentTemplateUrl, resolve);
			} else {
				resolve(this.makeComponentModule(null, this.componentType));
			}
		});
	}

	protected loadRemoteTemplate(url: string, resolve: (value: Type<any>) => void) {
		let requestArgs: RequestOptionsArgs = {withCredentials: true};
		if (Utils.isPresent(this.componentRemoteTemplateFactory)) {
			requestArgs = this.componentRemoteTemplateFactory.buildRequestOptions();
		}

		this.http.get(url, requestArgs)
			.subscribe((response: Response) => {
				if ([301, 302, 307, 308].indexOf(response.status) > -1) {
					const chainedUrl: string = response.headers.get('Location');

					console.debug('[$DynamicBase][loadRemoteTemplate] The URL into the chain is:', chainedUrl);
					if (Utils.isPresent(chainedUrl)) {
						this.loadRemoteTemplate(chainedUrl, resolve);
					} else {
						console.warn('[$DynamicBase][loadRemoteTemplate] The URL into the chain is empty. The process of redirect has stopped.');
					}
				} else {
					resolve(
						this.makeComponentModule(Utils.isPresent(this.componentRemoteTemplateFactory)
							? this.componentRemoteTemplateFactory.parseResponse(response)
							: response.text())
					);
				}
			}, (response: Response) => {
				console.warn('[$DynamicBase][loadRemoteTemplate] Error response:', response);

				resolve(this.makeComponentModule(''));
			});
	}

	protected makeComponentModule(template: string, componentType?: {new (): TDynamicComponentType}): Type<any> {
		const dynamicComponentType: Type<TDynamicComponentType> = this.cachedDynamicComponent = this.makeComponent(template, componentType);
		const componentModules: Array<any> = this.dynamicExtraModules.concat(this.componentModules || []);

		@NgModule({
			declarations: [dynamicComponentType],
			imports: [CommonModule].concat(componentModules)
		})
		class dynamicComponentModule {
		}
		return this.cachedDynamicModule = dynamicComponentModule;
	}

	protected makeComponent(template:string, componentType?:{new ():TDynamicComponentType}):Type<TDynamicComponentType> {
		let annotationsArray:Array<DecoratorType>,
			componentDecorator:DecoratorType,
			dynamicSelector = this.dynamicSelector;

		if (Utils.isPresent(componentType)) {
			annotationsArray = MetadataHelper.findAnnotationsMetaData(componentType, Component);
			if (annotationsArray.length) {
				componentDecorator = annotationsArray[0];
				Reflect.set(componentDecorator, 'selector', dynamicSelector);
			}
		}

		const dynamicComponentParentClass = componentType || class {};

		@Component(componentDecorator || {selector: dynamicSelector, template: template})
		class dynamicComponentClass extends dynamicComponentParentClass {
		}
		return dynamicComponentClass as Type<TDynamicComponentType>;
	}

	protected applyPropertiesToDynamicComponent(instance:TDynamicComponentType) {
		const metadataHolder:IAnnotationMetadataHolder = MetadataHelper.findPropertyMetadata(this, Input);

		for (let property of Object.keys(this)) {
			if (Reflect.has(metadataHolder, property)) {
				if (Reflect.has(instance, property)) {
					console.warn('[$DynamicBase][applyPropertiesToDynamicComponent] The property', property, 'will be overwritten for the component', instance);
				}
				Reflect.set(instance, property, Reflect.get(this, property));
			}
		}

		if (Utils.isPresent(this.componentContext)) {
			for (let property in this.componentContext) {
				if (Reflect.has(instance, property)) {
					console.warn('[$DynamicBase][applyPropertiesToDynamicComponent] The property', property, 'will be overwritten for the component', instance);
				}

				const propValue = Reflect.get(this.componentContext, property);
				const attributes:PropertyDescriptor = {} as PropertyDescriptor;

				if (!Utils.isFunction(propValue)) {
					attributes.set = (v) => Reflect.set(this.componentContext, property, v);
				}
				attributes.get = () => Reflect.get(this.componentContext, property);

				Reflect.defineProperty(instance, property, attributes);
			}
		}
	}
}
