import {
	Component,
	Input,
	Compiler,
	OnChanges,
	OnDestroy,
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

export interface IComponentInputData {
	[index: string]: any;
}

export type TDynamicComponentType = Function;

export class DynamicBase implements OnChanges, OnDestroy {

	@Input() componentType: {new (): TDynamicComponentType};
	@Input() componentTemplate: string;
	@Input() componentInputData: IComponentInputData;
	@Input() componentTemplateUrl: string;
	@Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
	@Input() componentModules: Array<any>;

	private injector:ReflectiveInjector;
	private componentInstance: ComponentRef<TDynamicComponentType>;

	constructor(protected viewContainer: ViewContainerRef,
	            protected compiler: Compiler,
	            protected http: Http,
				protected dynamicSelector:string) {
		this.injector = ReflectiveInjector.fromResolvedProviders([], this.viewContainer.parentInjector);
	}

	/**
	 * @override
	 */
	public ngOnChanges() {
		this.getComponentTypePromise().then((module: Type<any>) => {

			this.compiler.compileModuleAndAllComponentsAsync<any>(module)
				.then((moduleWithComponentFactories: ModuleWithComponentFactories<any>) => {
					this.componentInstance = this.viewContainer.createComponent<TDynamicComponentType>(
						// dynamicComponentClass factory is presented here
						moduleWithComponentFactories.componentFactories.find((componentFactory: ComponentFactory<Type<any>>) => {
							return componentFactory.selector === this.dynamicSelector
								|| componentFactory.componentType === this.componentType;
						}),
						0,
						this.injector
					);

					this.applyPropertiesToDynamicComponent(this.componentInstance.instance);
				});
		});
	}

	/**
	 * @override
	 */
	public ngOnDestroy() {
		if (this.componentInstance) {
			this.componentInstance.destroy();
		}
	}

	protected getComponentTypePromise(): Promise<Type<any>> {
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
				if (response.status === 301 || response.status === 302) {
					const chainedUrl: string = response.headers.get('Location');

					console.info('[$DynamicComponent][loadRemoteTemplate] The URL into the chain is:', chainedUrl);
					if (Utils.isPresent(chainedUrl)) {
						this.loadRemoteTemplate(chainedUrl, resolve);
					} else {
						console.warn('[$DynamicComponent][loadRemoteTemplate] The URL into the chain is empty. The process of redirect has stopped.');
					}
				} else {
					resolve(
						this.makeComponentModule(Utils.isPresent(this.componentRemoteTemplateFactory)
							? this.componentRemoteTemplateFactory.parseResponse(response)
							: response.text())
					);
				}
			}, (response: Response) => {
				console.error('[$DynamicComponent][loadRemoteTemplate] Error response:', response);

				resolve(this.makeComponentModule(''));
			});
	}

	protected makeComponentModule(template: string, componentType?: {new (): TDynamicComponentType}): Type<any> {
		componentType = this.makeComponent(template, componentType);
		const componentModules: Array<any> = this.componentModules;
		@NgModule({
			declarations: [componentType],
			imports: [CommonModule].concat(componentModules || [])
		})
		class dynamicComponentModule {}
		return dynamicComponentModule;
	}

	protected makeComponent(template:string, componentType?:{new ():TDynamicComponentType}):Type<TDynamicComponentType> {
		let annotationsArray:Array<DecoratorType>,
			componentDecorator:DecoratorType;

		if (Utils.isPresent(componentType)) {
			annotationsArray = MetadataHelper.findAnnotationsMetaData(componentType, Component);
			if (annotationsArray.length) {
				componentDecorator = annotationsArray[0];
				Reflect.set(componentDecorator, 'selector', this.dynamicSelector);
			}
		}

		@Component(componentDecorator || {selector: this.dynamicSelector, template: template})
		class dynamicComponentClass {
		}
		return dynamicComponentClass as Type<TDynamicComponentType>;
	}

	protected applyPropertiesToDynamicComponent(instance:TDynamicComponentType) {
		const metadataHolder:IAnnotationMetadataHolder = MetadataHelper.findPropertyMetadata(this, Input);

		for (let property of Object.keys(this)) {
			if (Reflect.has(metadataHolder, property)) {
				if (Reflect.has(instance, property)) {
					console.warn('[$DynamicComponent][applyPropertiesToDynamicComponent] The property', property, 'will be overwritten for the component', instance);
				}
				Reflect.set(instance, property, Reflect.get(this, property));
			}
		}

		if (Utils.isPresent(this.componentInputData)) {
			for (let property in this.componentInputData) {
				if (Reflect.has(instance, property)) {
					console.warn('[$DynamicComponent][applyPropertiesToDynamicComponent] The property', property, 'will be overwritten for the component', instance);
				}

				const propValue = Reflect.get(this.componentInputData, property);
				const attributes:PropertyDescriptor = {} as PropertyDescriptor;

				if (!Utils.isFunction(propValue)) {
					attributes.set = (v) => Reflect.set(this.componentInputData, property, v);
				}
				attributes.get = () => Reflect.get(this.componentInputData, property);

				Reflect.defineProperty(instance, property, attributes);
			}
		}
	}
}
