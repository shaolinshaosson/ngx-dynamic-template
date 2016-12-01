import {
	Component,
	Input,
	Output,
	Compiler,
	ViewContainerRef,
	EventEmitter,
	Inject
} from '@angular/core';

import {Http} from '@angular/http';

import {IComponentRemoteTemplateFactory} from './IComponentRemoteTemplateFactory';
import {
	IDynamicComponent,
	DynamicComponentType,
	DynamicBase,
	IComponentContext,
	DYNAMIC_TYPES
} from "./DynamicBase";

const DYNAMIC_SELECTOR: string = 'DynamicComponent';
const DYNAMIC_DEFAULT_TEMPLATE: string = '';

export class DynamicComponentMetadata {
	constructor(public selector: string = DYNAMIC_SELECTOR, public template: string = DYNAMIC_DEFAULT_TEMPLATE) {
	}
}

@Component({
	selector: DYNAMIC_SELECTOR,
	template: DYNAMIC_DEFAULT_TEMPLATE
})
export class DynamicComponent extends DynamicBase {

	@Output() dynamicComponentReady: EventEmitter<IDynamicComponent>;
	@Output() dynamicComponentBeforeReady: EventEmitter<void>;

	@Input() componentType: DynamicComponentType;
	@Input() componentTemplate: string;
	@Input() componentStyles: string[];
	@Input() componentContext: IComponentContext;
	@Input() componentTemplateUrl: string;
	@Input() componentTemplatePath: string;
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
