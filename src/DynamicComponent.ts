import {
	Component,
	Input,
	Compiler,
	ElementRef,
	OnChanges,
	NgModule,
	ViewContainerRef,
	ComponentRef,
	ModuleWithComponentFactories,
	ComponentFactory,
	Type
} from '@angular/core';

import {CommonModule} from "@angular/common";

import {
	Http,
	Response,
	RequestOptionsArgs
} from '@angular/http';

import {IComponentRemoteTemplateFactory} from './IComponentRemoteTemplateFactory';

const DYNAMIC_SELECTOR: string = 'DynamicComponent';

export class DynamicComponentMetadata {
	constructor(public selector: string = DYNAMIC_SELECTOR, public template: string = '') {
	}
}

export interface IComponentInputData {
	[index: string]: any;
}

@Component(new DynamicComponentMetadata())
export class DynamicComponent<TDynamicComponentType> implements OnChanges {

	@Input() componentType: {new (): TDynamicComponentType};
	@Input() componentTemplate: string;
	@Input() componentInputData: IComponentInputData;
	@Input() componentTemplateUrl: string;
	@Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
	@Input() componentModules: Array<any>;

	private componentInstance: ComponentRef<TDynamicComponentType>;

	protected destroyWrapper: boolean = false;

	constructor(protected element: ElementRef,
	            protected viewContainer: ViewContainerRef,
	            protected compiler: Compiler,
	            protected http: Http) {
	}

	/**
	 * @override
	 */
	public ngOnChanges() {
		this.getComponentTypePromise().then((module: Type<any>) => {

			this.compiler.compileModuleAndAllComponentsAsync<any>(module)
				.then((moduleWithComponentFactories: ModuleWithComponentFactories<any>) => {
					if (this.componentInstance) {
						this.componentInstance.destroy();
					}
					this.componentInstance = this.viewContainer.createComponent<TDynamicComponentType>(
						// dynamicComponentClass factory is presented here
						moduleWithComponentFactories.componentFactories.find((componentFactory: ComponentFactory<Type<any>>) => {
							return componentFactory.selector === DYNAMIC_SELECTOR
								|| componentFactory.componentType === this.componentType;
						})
					);

					this.applyPropertiesToDynamicComponent(this.componentInstance.instance);

					// Remove wrapper after render the component
					if (this.destroyWrapper) {
						const el: HTMLElement = this.element.nativeElement;
						if (isPresent(el.parentNode)) {
							el.parentNode.removeChild(el);
						}
					}
				});
		});
	}

	protected getComponentTypePromise(): Promise<Type<any>> {
		return new Promise((resolve: (value: Type<any>) => void) => {
			if (isPresent(this.componentTemplate)) {
				resolve(this.makeComponentModule(this.componentTemplate));
			} else if (isPresent(this.componentTemplateUrl)) {
				this.loadRemoteTemplate(this.componentTemplateUrl, resolve);
			} else {
				resolve(this.makeComponentModule(null, this.componentType));
			}
		});
	}

	protected loadRemoteTemplate(url: string, resolve: (value: Type<any>) => void) {
		let requestArgs: RequestOptionsArgs = {withCredentials: true};
		if (isPresent(this.componentRemoteTemplateFactory)) {
			requestArgs = this.componentRemoteTemplateFactory.buildRequestOptions();
		}

		this.http.get(url, requestArgs)
			.subscribe((response: Response) => {
				if (response.status === 301 || response.status === 302) {
					const chainedUrl: string = response.headers.get('Location');

					console.info('[$DynamicComponent][loadRemoteTemplate] The URL into the chain is:', chainedUrl);
					if (isPresent(chainedUrl)) {
						this.loadRemoteTemplate(chainedUrl, resolve);
					} else {
						console.warn('[$DynamicComponent][loadRemoteTemplate] The URL into the chain is empty. The process of redirect has stopped.');
					}
				} else {
					resolve(
						this.makeComponentModule(isPresent(this.componentRemoteTemplateFactory)
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

	protected makeComponent(template: string, componentType?: {new (): TDynamicComponentType}): Type<TDynamicComponentType> {
		let annotationsArray,
			componentDecorator;
		if (isPresent(componentType)) {
			annotationsArray = Reflect.getMetadata('annotations', componentType);
			if (Array.isArray(annotationsArray)) {
				componentDecorator = annotationsArray.find((decorator) => decorator instanceof Component);
				if (isPresent(componentDecorator)) {
					componentDecorator.selector = DYNAMIC_SELECTOR;
				}
			}
		}

		@Component(componentDecorator || {selector: DYNAMIC_SELECTOR, template: template})
		class dynamicComponentClass {}
		return dynamicComponentClass as Type<TDynamicComponentType>;
	}

	protected applyPropertiesToDynamicComponent(instance: TDynamicComponentType) {
		const placeholderComponentMetaData: {[key: string]: Type<any>[];} = Reflect.getMetadata('propMetadata', this.constructor);

		for (let property of Object.keys(this)) {
			if (this.hasInputMetadataAnnotation(placeholderComponentMetaData[property])) {
				if (Reflect.has(instance, property)) {
					console.warn('[$DynamicComponent][applyPropertiesToDynamicComponent] The property', property, 'will be overwritten for the component', instance);
				}
				Reflect.set(instance, property, Reflect.get(this, property));
			}
		}

		if (isPresent(this.componentInputData)) {
			for (let property in this.componentInputData) {
				if (Reflect.has(instance, property)) {
					console.warn('[$DynamicComponent][applyPropertiesToDynamicComponent] The property', property, 'will be overwritten for the component', instance);
				}

				const propValue = Reflect.get(this.componentInputData, property);
				const attributes:PropertyDescriptor = {} as PropertyDescriptor;

				if (typeof propValue !== 'function') {
					attributes.set = (v) => Reflect.set(this.componentInputData, property, v);
				}
				attributes.get = () => Reflect.get(this.componentInputData, property);

				Reflect.defineProperty(instance, property, attributes);
			}
		}
	}

	protected hasInputMetadataAnnotation(metaDataByProperty: Array<Type<any>>): boolean {
		return Array.isArray(metaDataByProperty) && !!metaDataByProperty.find((decorator: Type<any>) => decorator instanceof Input);
	}
}

function isPresent(obj) {
	return obj !== undefined && obj !== null;
}

declare module Reflect {
	function defineProperty(target: any, propertyKey: PropertyKey, attributes: PropertyDescriptor): boolean;
	function getMetadata(metadataKey: any, target: Object): any;
	function has(target: any, propertyKey: string): boolean;
	function set(target: any, propertyKey: PropertyKey, value: any, receiver?: any): boolean;
	function get(target: any, propertyKey: PropertyKey, receiver?: any): any;
}
