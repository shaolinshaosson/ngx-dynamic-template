import {
  Directive, Input, Inject, Output, EventEmitter, Compiler, ViewContainerRef, NgModuleFactoryLoader
} from '@angular/core';
import { Http } from '@angular/http';

import { DynamicBase, ComponentContext } from './dynamic.base';
import { DynamicCache } from './dynamic.cache';
import { DYNAMIC_TYPES, IComponentRemoteTemplateFactory, IDynamicType } from './dynamic.interface';

@Directive({
  selector: '[dynamic-template]'
})
export class DynamicDirective extends DynamicBase {

  @Output() dynamicComponentReady: EventEmitter<IDynamicType>;
  @Output() dynamicComponentBeforeReady: EventEmitter<void>;

  @Input() lazyModules: string[];
  @Input() componentTemplate: string;
  @Input() componentStyles: string[];
  @Input() componentContext: ComponentContext;
  @Input() componentTemplateUrl: string;
  @Input() componentTemplatePath: string;
  @Input() componentDefaultTemplate: string;
  @Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
  @Input() componentModules: Array<any>;

  constructor(@Inject(DYNAMIC_TYPES.DynamicExtraModules) dynamicExtraModules: any[],
              @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
              @Inject(Compiler) compiler: Compiler,
              @Inject(Http) http: Http,
              @Inject(NgModuleFactoryLoader) moduleFactoryLoader: NgModuleFactoryLoader,
              @Inject(DynamicCache) dynamicCache: DynamicCache) {
    super(dynamicExtraModules, viewContainer, compiler, http, dynamicCache, moduleFactoryLoader, '[dynamic-template-{id}]');
  }
}
