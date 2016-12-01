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

export interface IDynamicComponent {
}

export interface DynamicComponentType {
	new (): IDynamicComponent
}

export interface DynamicComponentConfig {
	template?: string;
	templatePath?: string;
	componentType?: DynamicComponentType;
}

export const DYNAMIC_TYPES = {
	DynamicExtraModules: 'DynamicExtraModules'  // AoT workaround Symbol(..)
};

export class DynamicBase implements OnChanges, OnDestroy {

	@Output() dynamicComponentReady:EventEmitter<IDynamicComponent>;
	@Output() dynamicComponentBeforeReady:EventEmitter<void>;

	@Input() componentType: DynamicComponentType;
	@Input() componentTemplate: string;
	@Input() componentStyles: string[];
	@Input() componentContext: IComponentContext;
	@Input() componentTemplateUrl: string;
	@Input() componentTemplatePath: string;
	@Input() componentDefaultTemplate: string;
	@Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
	@Input() componentModules: Array<any>;

	private injector:ReflectiveInjector;

	private cachedDynamicModule:Type<any>;
	private cachedDynamicComponent:Type<IDynamicComponent>;
	private componentInstance: ComponentRef<IDynamicComponent>;

	constructor(@Inject(DYNAMIC_TYPES.DynamicExtraModules) protected dynamicExtraModules: Array<any>,
	            protected viewContainer: ViewContainerRef,
	            protected compiler: Compiler,
	            protected http: Http,
				protected dynamicSelector:string) {
		this.dynamicComponentReady = new EventEmitter<IDynamicComponent>(false);
		this.dynamicComponentBeforeReady = new EventEmitter<void>(false);

		this.injector = ReflectiveInjector.fromResolvedProviders([], this.viewContainer.parentInjector);
	}

	/**
	 * @override
	 */
	public ngOnChanges() {
		this.ngOnDestroy();
		this.dynamicComponentBeforeReady.emit(null);

		this.getDynamicModule().then((module: Type<any>) =>
			this.compiler.compileModuleAndAllComponentsAsync<any>(module)
				.then((moduleWithComponentFactories: ModuleWithComponentFactories<any>) => {
					this.componentInstance = this.viewContainer.createComponent<IDynamicComponent>(
						moduleWithComponentFactories.componentFactories.find((componentFactory: ComponentFactory<Type<any>>) => {

								let bufferedSelector: string = null;
								const builtComponentDecorator: DecoratorType = this.findComponentDecoratorByComponentType(this.componentType);
								if (Utils.isPresent(builtComponentDecorator)
									&& Utils.isPresent(bufferedSelector = Reflect.get(builtComponentDecorator, 'selector'))
									&& componentFactory.selector === bufferedSelector) {
									return true;
								}

								return componentFactory.selector === this.dynamicSelector;
							}
						),
						0,
						this.injector
					);

					this.applyPropertiesToDynamicComponent(this.componentInstance.instance);

					this.dynamicComponentReady.emit(this.componentInstance.instance);
				})
		);
	}

	/**
	 * @override
	 */
	public ngOnDestroy() {
		if (Utils.isPresent(this.componentInstance)) {
			this.componentInstance.destroy();
			this.componentInstance = null;
		}
		if (Utils.isPresent(this.cachedDynamicModule)) {
			this.compiler.clearCacheFor(this.cachedDynamicModule);
			this.cachedDynamicModule = null;
		}
		if (Utils.isPresent(this.cachedDynamicComponent)) {
			this.compiler.clearCacheFor(this.cachedDynamicComponent);
			this.cachedDynamicComponent = null;
		}
	}

	protected getDynamicModule():Promise<Type<any>> {
		return new Promise((resolve:(value:Type<any>) => void) => {
			if (Utils.isPresent(this.componentTemplate)) {
				resolve(this.makeComponentModule({
					template: this.componentTemplate
				}));
			} else if (Utils.isPresent(this.componentTemplatePath)) {
				resolve(this.makeComponentModule({
					templatePath: this.componentTemplatePath
				}));
			} else if (Utils.isPresent(this.componentTemplateUrl)) {
				this.loadRemoteTemplate(this.componentTemplateUrl, resolve);
			} else {
				resolve(this.makeComponentModule({
					componentType: this.componentType
				}));
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
						this.makeComponentModule({
							template: Utils.isPresent(this.componentRemoteTemplateFactory)
								? this.componentRemoteTemplateFactory.parseResponse(response)
								: response.text()
						})
					);
				}
			}, (response: Response) => {
				console.warn('[$DynamicBase][loadRemoteTemplate] Error response:', response);

				resolve(
					this.makeComponentModule({
						template: this.componentDefaultTemplate || ''
					})
				);
			});
	}

	protected makeComponentModule(dynamicConfig: DynamicComponentConfig): Type<any> {
		const dynamicComponentType: Type<IDynamicComponent>
			= this.cachedDynamicComponent
			= this.makeComponent(dynamicConfig);

		const componentModules: Array<any> = this.dynamicExtraModules.concat(this.componentModules || []);

		@NgModule({
			declarations: [dynamicComponentType],
			imports: [CommonModule].concat(componentModules)
		})
		class dynamicComponentModule {
		}
		return this.cachedDynamicModule = dynamicComponentModule;
	}

	protected makeComponent(dynamicConfig: DynamicComponentConfig):Type<IDynamicComponent> {
		const dynamicSelector: string = this.dynamicSelector;
		const dynamicComponentParentClass = dynamicConfig.componentType || class {};

		let componentDecorator: DecoratorType = this.findComponentDecoratorByComponentType(dynamicConfig.componentType);

		if (Utils.isPresent(componentDecorator)
			&& Utils.isUndefined(Reflect.get(componentDecorator, 'selector'))) {
			Reflect.set(componentDecorator, 'selector', dynamicConfig.componentType.name);
		}

		let componentMetadata;
		if (!Utils.isPresent(componentDecorator)) {
			componentMetadata = {
				selector: dynamicSelector,
				styles: this.componentStyles
			};

			if (Utils.isPresent(dynamicConfig.template)) {
				componentMetadata.template = dynamicConfig.template;
			} else if (Utils.isPresent(dynamicConfig.templatePath)) {
				componentMetadata.templateUrl = dynamicConfig.templatePath;
			}
		}

		@Component(componentDecorator || componentMetadata)
		class dynamicComponentClass extends dynamicComponentParentClass {
		}
		return dynamicComponentClass as Type<IDynamicComponent>;
	}

	protected applyPropertiesToDynamicComponent(instance:IDynamicComponent) {
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

	private findComponentDecoratorByComponentType(componentType?: DynamicComponentType): DecoratorType {
		if (Utils.isPresent(componentType)) {
			const annotationsArray: Array<DecoratorType> = MetadataHelper.findAnnotationsMetaData(componentType, Component);
			if (annotationsArray.length) {
				return annotationsArray[0];
			}
		}
		return null;
	}
}
