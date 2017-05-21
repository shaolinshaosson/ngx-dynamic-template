import {
  Directive, Inject, Compiler, ViewContainerRef, NgModuleFactoryLoader
} from '@angular/core';
import { Http } from '@angular/http';

import { DynamicBase } from './dynamic.base';
import { DynamicCache } from './dynamic.cache';
import { DynamicTypes } from './dynamic.interface';

@Directive({
  selector: '[dynamic-template]'
})
export class DynamicDirective extends DynamicBase {

  constructor(@Inject(DynamicTypes.DynamicExtraModules) dynamicExtraModules: any[],
              @Inject(DynamicTypes.DynamicResponseRedirectStatuses) dynamicResponseRedirectStatuses: number[],
              @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
              @Inject(Compiler) compiler: Compiler,
              @Inject(Http) http: Http,
              @Inject(NgModuleFactoryLoader) moduleFactoryLoader: NgModuleFactoryLoader,
              @Inject(DynamicCache) dynamicCache: DynamicCache) {
    super(
      dynamicExtraModules,
      dynamicResponseRedirectStatuses,
      viewContainer,
      compiler,
      http,
      dynamicCache,
      moduleFactoryLoader,
      '[dynamic-template-{id}]'
    );
  }
}
