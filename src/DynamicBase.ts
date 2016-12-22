import {
	Component,
	Input,
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
	ReflectiveInjector,
	ElementRef,
	Inject
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
import {DynamicCache} from './DynamicCache';

export interface ComponentContext {
	[index: string]: any;
}

export interface IDynamicComponent {
}

export interface DynamicComponentType {
	new (): IDynamicComponent
}

export interface DynamicMetadata {
	selector: string;
	styles?: Array<string>;
	template?: string;
	templateUrl?: string;
}

export interface DynamicComponentConfig {
	template?: string;
	templatePath?: string;
}

export type AnyT = Type<any>;

export const DYNAMIC_TYPES = {
	DynamicExtraModules: 'DynamicExtraModules'  // AoT workaround Symbol(..)
};

const HASH_FIELD:string = '__hashValue';

export class DynamicBase implements OnChanges, OnDestroy {

	@Output() dynamicComponentReady:EventEmitter<IDynamicComponent>;
	@Output() dynamicComponentBeforeReady:EventEmitter<void>;

	@Input() componentType: DynamicComponentType;
	@Input() componentTemplate: string;
	@Input() componentStyles: string[];
	@Input() componentContext: ComponentContext;
	@Input() componentTemplateUrl: string;
	@Input() componentTemplatePath: string;
	@Input() componentDefaultTemplate: string;
	@Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
	@Input() componentModules: Array<any>;

	private injector:ReflectiveInjector;

	private dynamicSelector:string;
	private cachedDynamicModule:AnyT;
	private cachedDynamicComponent:Type<IDynamicComponent>;
	private componentInstance: ComponentRef<IDynamicComponent>;

	constructor(protected dynamicExtraModules: Array<any>,
	            protected viewContainer: ViewContainerRef,
	            protected compiler: Compiler,
	            protected http: Http,
	            protected dynamicCache: DynamicCache,
	            dynamicSelector: string) {
		this.dynamicComponentReady = new EventEmitter<IDynamicComponent>(false);
		this.dynamicComponentBeforeReady = new EventEmitter<void>(false);
		this.dynamicSelector = Utils.buildByNextId(dynamicSelector);

		this.injector = ReflectiveInjector.fromResolvedProviders([], this.viewContainer.parentInjector);
	}

	/**
	 * @override
	 */
	public ngOnChanges() {
		this.ngOnDestroy();
		this.dynamicComponentBeforeReady.emit(null);

		this.buildModule().then((module:AnyT) => {
			let compiledModule:Promise<ModuleWithComponentFactories<any>>;
			const currentModuleHash:string = Reflect.get(module, HASH_FIELD);

			if (Utils.isPresent(currentModuleHash)) {
				compiledModule = this.dynamicCache.get(currentModuleHash);
				if (!Utils.isPresent(compiledModule)) {
					this.dynamicCache.set(currentModuleHash, compiledModule = this.compiler.compileModuleAndAllComponentsAsync<any>(module));
				}
			} else {
				compiledModule = this.compiler.compileModuleAndAllComponentsAsync<any>(module);
			}

			compiledModule
				.then((moduleWithComponentFactories:ModuleWithComponentFactories<any>) => {
					this.componentInstance = this.viewContainer.createComponent<IDynamicComponent>(
						moduleWithComponentFactories.componentFactories.find((componentFactory:ComponentFactory<AnyT>) => {
								return Utils.isSelectorOfComponentTypeEqual(componentFactory.selector, this.componentType)
									|| componentFactory.selector === this.dynamicSelector
									|| (Utils.isPresent(componentFactory.componentType) && Utils.isPresent(this.componentTemplate)
											&& Reflect.get(componentFactory.componentType, HASH_FIELD) === Utils.hashFnv32a(this.componentTemplate, true));
							}
						),
						0,
						this.injector
					);

					this.applyPropertiesToDynamicComponent(this.componentInstance.instance);

					this.dynamicComponentReady.emit(this.componentInstance.instance);
				})
			}
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

	/**
	 * Build module wrapper for dynamic component asynchronously
	 *
	 * @returns {Promise<AnyT>}
	 */
	protected buildModule():Promise<AnyT> {
		return new Promise((resolve:(value:AnyT) => void) => {
			if (Utils.isPresent(this.componentTemplate)) {
				resolve(this.makeComponentModule({template: this.componentTemplate}));
			} else if (Utils.isPresent(this.componentTemplatePath)) {
				resolve(this.makeComponentModule({templatePath: this.componentTemplatePath}));
			} else if (Utils.isPresent(this.componentTemplateUrl)) {
				this.loadRemoteTemplate(this.componentTemplateUrl, resolve);
			} else {
				resolve(this.makeComponentModule());
			}
		});
	}

	protected loadRemoteTemplate(url: string, resolve: (value: AnyT) => void) {
		let requestArgs: RequestOptionsArgs = {withCredentials: true};
		if (Utils.isPresent(this.componentRemoteTemplateFactory)) {
			requestArgs = this.componentRemoteTemplateFactory.buildRequestOptions();
		}

		this.http.get(url, requestArgs)
			.subscribe((response: Response) => {
				// TODO Inject response statuses
				if ([301, 302, 307, 308].indexOf(response.status) > -1) {
					const chainedUrl: string = response.headers.get('Location');

					// TODO Inject logger
					console.debug('[$DynamicBase][loadRemoteTemplate] The URL into the chain is:', chainedUrl);
					if (Utils.isPresent(chainedUrl)) {
						this.loadRemoteTemplate(chainedUrl, resolve);
					} else {
						console.warn('[$DynamicBase][loadRemoteTemplate] The URL into the chain is empty. The process of redirect has stopped.');
					}
				} else {
					const loadedTemplate:string = Utils.isPresent(this.componentRemoteTemplateFactory)
						? this.componentRemoteTemplateFactory.parseResponse(response)
						: response.text();

					resolve(this.makeComponentModule({template: loadedTemplate}));
				}
			}, (response: Response) => {
				console.warn('[$DynamicBase][loadRemoteTemplate] Error response:', response);

				const template:string = this.componentDefaultTemplate || '';
				resolve(this.makeComponentModule({template: template}));
			});
	}

	protected makeComponentModule(dynamicConfig?: DynamicComponentConfig): AnyT {
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

		const dynamicComponentTypeHash:string = Reflect.get(dynamicComponentType, HASH_FIELD);
		if (Utils.isPresent(dynamicComponentTypeHash)) {
			Reflect.set(dynamicComponentModule, HASH_FIELD, dynamicComponentTypeHash);
		}

		return this.cachedDynamicModule = dynamicComponentModule;
	}

	/**
	 * Build dynamic component class
	 *
	 * @param componentConfig
	 * @returns {Type<IDynamicComponent>}
	 */
	protected makeComponent(componentConfig?: DynamicComponentConfig):Type<IDynamicComponent> {
		const componentDecorator: DecoratorType = Utils.findComponentDecoratorByComponentType(this.componentType);

		let componentMetadata:DynamicMetadata;
		if (Utils.isPresent(componentDecorator)) {
			if (!Utils.isSelectorPresent(componentDecorator)) {
				// Setting selector if it is not present in Component metadata
				Reflect.set(componentDecorator, 'selector', this.componentType.name);
			}
		} else {
			componentMetadata = {
				selector: this.dynamicSelector,
				styles: this.componentStyles
			};
			if (Utils.isPresent(componentConfig)) {
				if (Utils.isPresent(componentConfig.template)) {
					componentMetadata.template = componentConfig.template;
				} else if (Utils.isPresent(componentConfig.templatePath)) {
					componentMetadata.templateUrl = componentConfig.templatePath;
				}
			}
		}

		const dynamicClassMetadata:DynamicMetadata|DecoratorType = componentDecorator || componentMetadata;
		const componentParentClass = (this.componentType || class {}) as {new (elementRef:ElementRef): IDynamicComponent};

		@Component(dynamicClassMetadata)
		class dynamicComponentClass extends componentParentClass {

			constructor(@Inject(ElementRef) elementRef:ElementRef) {
				super(elementRef);
			}
		}

		if (Utils.isPresent(Reflect.get(dynamicClassMetadata, 'template'))) {
			Reflect.set(dynamicComponentClass, HASH_FIELD, Utils.hashFnv32a(Reflect.get(dynamicClassMetadata, 'template'), true));
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
}
