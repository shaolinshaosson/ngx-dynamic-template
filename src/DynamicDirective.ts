import {
	Directive,
	Input,
	Inject,
	Output,
	EventEmitter,
	Compiler,
	ViewContainerRef
} from '@angular/core';

import {Http} from '@angular/http';

import {IComponentRemoteTemplateFactory} from './IComponentRemoteTemplateFactory';
import {
	TDynamicComponentType,
	DynamicBase,
	IComponentContext,
	DYNAMIC_TYPES
} from "./DynamicBase";

const DYNAMIC_SELECTOR: string = '[dynamic-component]';

@Directive({
	selector: DYNAMIC_SELECTOR,
})
export class DynamicDirective extends DynamicBase {

	@Output() dynamicComponentReady: EventEmitter<TDynamicComponentType>;
	@Output() dynamicComponentBeforeReady: EventEmitter<void>;

	@Input() componentType: {new (): TDynamicComponentType};
	@Input() componentTemplate: string;
	@Input() componentStyles: string[];
	@Input() componentContext: IComponentContext;
	@Input() componentTemplateUrl: string;
	@Input() componentDefaultTemplate: string;
	@Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
	@Input() componentModules: Array<any>;

	constructor(@Inject(DYNAMIC_TYPES.DynamicExtraModules) dynamicExtraModules: Array<any>,
	            viewContainer: ViewContainerRef,
	            compiler: Compiler,
	            http: Http) {
		super(dynamicExtraModules, viewContainer, compiler, http, DYNAMIC_SELECTOR);
	}
}
