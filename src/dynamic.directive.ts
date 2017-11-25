import {
  Directive, Inject, ViewContainerRef, NgModuleFactoryLoader, Compiler
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DynamicBase } from './dynamic.base';
import { DynamicCache } from './dynamic.cache';
import { DynamicTypes, ROUTES_TOKEN, ILazyRoute } from './dynamic.interface';

@Directive({
  selector: '[dynamic-template]'
})
export class DynamicDirective extends DynamicBase {

  constructor(@Inject(DynamicTypes.DynamicExtraModules) dynamicExtraModules: any[],
              @Inject(DynamicTypes.DynamicResponseRedirectStatuses) dynamicResponseRedirectStatuses: number[],
              @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
              @Inject(Compiler) compiler: Compiler,
              @Inject(HttpClient) http: HttpClient,
              @Inject(NgModuleFactoryLoader) moduleFactoryLoader: NgModuleFactoryLoader,
              @Inject(DynamicCache) dynamicCache: DynamicCache,
              @Inject(ROUTES_TOKEN) routes: ILazyRoute[]) {
    super(
      dynamicExtraModules,
      dynamicResponseRedirectStatuses,
      viewContainer,
      compiler,
      http,
      dynamicCache,
      moduleFactoryLoader,
      routes,
      '[dynamic-template-{id}]'
    );
  }
}
