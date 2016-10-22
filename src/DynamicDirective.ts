import {
	Directive,
	Input,
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
	IComponentContext
} from "./DynamicBase";

const DYNAMIC_SELECTOR: string = '[dynamic-component]';

@Directive({
	selector: DYNAMIC_SELECTOR,
})
export class DynamicDirective extends DynamicBase {

	@Output() dynamicComponentReady:EventEmitter<void>;
	@Output() dynamicComponentBeforeReady:EventEmitter<void>;

	@Input() componentType: {new (): TDynamicComponentType};
	@Input() componentTemplate: string;
	@Input() componentContext: IComponentContext;
	@Input() componentTemplateUrl: string;
	@Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
	@Input() componentModules: Array<any>;

	constructor(protected viewContainer: ViewContainerRef,
	            protected compiler: Compiler,
	            protected http: Http) {
		super(viewContainer, compiler, http, DYNAMIC_SELECTOR);
	}
}
