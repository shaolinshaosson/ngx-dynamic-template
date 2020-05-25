import { ViewContainerRef, NgModuleFactoryLoader, Compiler, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DynamicBase } from './dynamic.base';
import { DynamicCache } from './dynamic.cache';
import { ILazyRoute } from './dynamic.interface';
export declare class DynamicDirective extends DynamicBase {
    constructor(dynamicExtraModules: any[], dynamicResponseRedirectStatuses: number[], viewContainer: ViewContainerRef, compiler: Compiler, http: HttpClient, renderer: Renderer2, moduleFactoryLoader: NgModuleFactoryLoader, dynamicCache: DynamicCache, routes: ILazyRoute[], removeDynamicWrapper: boolean);
}
