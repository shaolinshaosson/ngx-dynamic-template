import {
	Directive,
	Input,
	Compiler,
	ViewContainerRef
} from '@angular/core';

import {Http} from '@angular/http';

import {IComponentRemoteTemplateFactory} from './IComponentRemoteTemplateFactory';
import {
	TDynamicComponentType,
	IComponentInputData,
	DynamicBase
} from "./DynamicBase";

const DYNAMIC_SELECTOR: string = '[dynamic-component]';

@Directive({
	selector: DYNAMIC_SELECTOR,
})
export class DynamicDirective extends DynamicBase {

	@Input() componentType: {new (): TDynamicComponentType};
	@Input() componentTemplate: string;
	@Input() componentInputData: IComponentInputData;
	@Input() componentTemplateUrl: string;
	@Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
	@Input() componentModules: Array<any>;

	constructor(protected viewContainer: ViewContainerRef,
	            protected compiler: Compiler,
	            protected http: Http) {
		super(viewContainer, compiler, http, DYNAMIC_SELECTOR);
	}
}
