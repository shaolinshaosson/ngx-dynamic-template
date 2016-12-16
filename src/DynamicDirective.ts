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
	IDynamicComponent,
	DynamicComponentType,
	DynamicBase,
	ComponentContext,
	DYNAMIC_TYPES
} from "./DynamicBase";
import {DynamicCache} from './DynamicCache';

@Directive({
	selector: '[dynamic-component]'
})
export class DynamicDirective extends DynamicBase {

	@Output() dynamicComponentReady: EventEmitter<IDynamicComponent>;
	@Output() dynamicComponentBeforeReady: EventEmitter<void>;

	@Input() componentType: DynamicComponentType;
	@Input() componentTemplate: string;
	@Input() componentStyles: string[];
	@Input() componentContext: ComponentContext;
	@Input() componentTemplateUrl: string;
	@Input() componentTemplatePath: string;
	@Input() componentDefaultTemplate: string;
	@Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
	@Input() componentModules: Array<any>;

	constructor(@Inject(DYNAMIC_TYPES.DynamicExtraModules) dynamicExtraModules: Array<any>,
	            @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
	            @Inject(Compiler) compiler: Compiler,
	            @Inject(Http) http: Http,
				@Inject(DynamicCache) dynamicCache:DynamicCache) {
		super(dynamicExtraModules, viewContainer, compiler, http, dynamicCache, '[dynamic-component-{id}]');
	}
}
