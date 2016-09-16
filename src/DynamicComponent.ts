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

	private loadRemoteTemplate(url: string, resolve: (value: Type<any>) => void) {
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

	private makeComponentModule(template: string, componentType?: {new (): TDynamicComponentType}): Type<any> {
		componentType = componentType || this.makeComponent(template);
		const componentModules: Array<any> = this.componentModules;
		@NgModule({
			declarations: [componentType],
			imports: [CommonModule].concat(componentModules || [])
		})
		class dynamicComponentModule {
		}
		return dynamicComponentModule;
	}

	private makeComponent(template: string): Type<TDynamicComponentType> {
		@Component({selector: DYNAMIC_SELECTOR, template: template})
		class dynamicComponentClass {}
		return dynamicComponentClass as Type<TDynamicComponentType>;
	}

	private applyPropertiesToDynamicComponent(instance: TDynamicComponentType) {
		const placeholderComponentMetaData: {[key: string]: Type<any>[];} = Reflect.getMetadata('propMetadata', this.constructor);

		for (let prop of Object.keys(this)) {
			if (this.hasInputMetadataAnnotation(placeholderComponentMetaData[prop])) {
				if (isPresent(instance[prop])) {
					console.warn('[$DynamicComponent][applyPropertiesToDynamicComponent] The property', prop, 'will be overwritten for the component', instance);
				}
				instance[prop] = this[prop];
			}
		}

		if (isPresent(this.componentInputData)) {
			for (let prop in this.componentInputData) {
				if (isPresent(instance[prop])) {
					console.warn('[$DynamicComponent][applyPropertiesToDynamicComponent] The property', prop, 'will be overwritten for the component', instance);
				}
				instance[prop] = this.componentInputData[prop];
			}
		}
	}

	private hasInputMetadataAnnotation(metaDataByProperty: Array<Type<any>>): boolean {
		return Array.isArray(metaDataByProperty) && !!metaDataByProperty.find((decorator: Type<any>) => decorator instanceof Input);
	}
}

function isPresent(obj) {
	return obj !== undefined && obj !== null;
}

declare module Reflect {
	function getMetadata(metadataKey: any, target: Object): any;
}
