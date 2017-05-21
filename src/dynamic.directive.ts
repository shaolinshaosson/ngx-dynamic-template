import {
  Directive, Input, Inject, Output, EventEmitter, Compiler, ViewContainerRef, NgModuleFactoryLoader
} from '@angular/core';
import { Http } from '@angular/http';

import { DynamicBase } from './dynamic.base';
import { DynamicCache } from './dynamic.cache';
import { DynamicTypes, IComponentRemoteTemplateFactory, IDynamicTemplatePlaceholder, IDynamicTemplateContext } from './dynamic.interface';

@Directive({
  selector: '[dynamic-template]'
})
export class DynamicDirective extends DynamicBase {

  @Output() templateReady: EventEmitter<IDynamicTemplatePlaceholder>;

  @Input() template: string;
  @Input() lazyModules: string[];
  @Input() context: IDynamicTemplateContext;
  @Input() componentStyles: string[];
  @Input() componentTemplateUrl: string;
  @Input() componentTemplatePath: string;
  @Input() componentDefaultTemplate: string;
  @Input() componentRemoteTemplateFactory: IComponentRemoteTemplateFactory;
  @Input() componentModules: Array<any>;

  constructor(@Inject(DynamicTypes.DynamicExtraModules) dynamicExtraModules: any[],
              @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
              @Inject(Compiler) compiler: Compiler,
              @Inject(Http) http: Http,
              @Inject(NgModuleFactoryLoader) moduleFactoryLoader: NgModuleFactoryLoader,
              @Inject(DynamicCache) dynamicCache: DynamicCache) {
    super(dynamicExtraModules, viewContainer, compiler, http, dynamicCache, moduleFactoryLoader, '[dynamic-template-{id}]');
  }
}
