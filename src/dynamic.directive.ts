import {
  Directive, Inject, ViewContainerRef, NgModuleFactoryLoader
} from '@angular/core';
import { Http } from '@angular/http';

import { DynamicBase } from './dynamic.base';
import { DynamicCache } from './dynamic.cache';
import {Compiler2, DynamicTypes, ROUTES_TOKEN, ILazyRoute} from './dynamic.interface';

@Directive({
  selector: '[dynamic-template]'
})
export class DynamicDirective extends DynamicBase {

  constructor(@Inject(DynamicTypes.DynamicExtraModules) dynamicExtraModules: any[],
              @Inject(DynamicTypes.DynamicResponseRedirectStatuses) dynamicResponseRedirectStatuses: number[],
              @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
              @Inject(Compiler2) compiler: Compiler2,
              @Inject(Http) http: Http,
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
