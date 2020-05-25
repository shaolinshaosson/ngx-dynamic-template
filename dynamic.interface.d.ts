import { Type, InjectionToken } from '@angular/core';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
export declare const DynamicTypes: {
    DynamicExtraModules: string;
    DynamicResponseRedirectStatuses: string;
};
export interface IDynamicRemoteTemplateFactory {
    buildRequestOptions?(): IDynamicHttpRequest;
    parseResponse?(response: DynamicHttpResponseT): string;
}
export declare type DynamicHttpResponseT = HttpResponse<{
    [key: string]: any;
}>;
export interface IDynamicHttpRequest {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: any;
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: any;
    withCredentials?: boolean;
}
export interface IDynamicTemplateContext {
    [index: string]: any;
}
export interface IDynamicTemplatePlaceholder {
}
export interface IDynamicTemplateMetadata {
    selector: string;
    styles?: string[];
    template?: string;
    templateUrl?: string;
}
export declare type AnyT = Type<any>;
export interface IDynamicTemplateOptions {
    extraModules?: any[];
    routes?: ILazyRoute[];
    removeDynamicWrapper?: boolean;
}
export interface ILazyRoute {
    path?: string;
    component?: any;
    loadChildren?: Function | string;
}
export interface IDynamicComponentConfig {
    template?: string;
    templatePath?: string;
}
export declare const HASH_FIELD = "$$hashValue";
export declare const ROUTES_TOKEN: InjectionToken<{}>;
export declare const REMOVE_DYNAMIC_WRAPPER: InjectionToken<{}>;
