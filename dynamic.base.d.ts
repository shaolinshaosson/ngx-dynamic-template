import { OnChanges, OnDestroy, EventEmitter, ViewContainerRef, SimpleChanges, NgModuleFactoryLoader, Compiler, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DynamicCache } from './dynamic.cache';
import { IDynamicRemoteTemplateFactory, IDynamicTemplatePlaceholder, IDynamicTemplateContext, ILazyRoute } from './dynamic.interface';
export declare class DynamicBase implements OnChanges, OnDestroy {
    protected dynamicExtraModules: any[];
    protected dynamicResponseRedirectStatuses: number[];
    protected viewContainer: ViewContainerRef;
    protected compiler: Compiler;
    protected http: HttpClient;
    protected renderer: Renderer2;
    protected dynamicCache: DynamicCache;
    protected moduleFactoryLoader: NgModuleFactoryLoader;
    protected routes: ILazyRoute[];
    protected removeDynamicWrapper: boolean;
    templateReady: EventEmitter<IDynamicTemplatePlaceholder>;
    template: string;
    lazyModules: string[];
    httpUrl: string;
    context: IDynamicTemplateContext;
    remoteTemplateFactory: IDynamicRemoteTemplateFactory;
    extraModules: any[];
    styles: string[];
    defaultTemplate: string;
    private lazyExtraModules;
    private injector;
    private dynamicSelector;
    private cachedDynamicModule;
    private cachedTemplatePlaceholder;
    private templatePlaceholder;
    private moduleInstance;
    private replacedNodes;
    constructor(dynamicExtraModules: any[], dynamicResponseRedirectStatuses: number[], viewContainer: ViewContainerRef, compiler: Compiler, http: HttpClient, renderer: Renderer2, dynamicCache: DynamicCache, moduleFactoryLoader: NgModuleFactoryLoader, routes: ILazyRoute[], removeDynamicWrapper: boolean, dynamicSelector: string);
    /**
     * @override
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * @override
     */
    ngOnDestroy(): void;
    private makeDynamicTemplatePlaceholder;
    private buildModule;
    private loadRemoteTemplate;
    private makeComponentModule;
    private makeComponent;
}
