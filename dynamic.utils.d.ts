import { Renderer2, Type } from '@angular/core';
import { DynamicHttpResponseT, IDynamicRemoteTemplateFactory, IDynamicTemplatePlaceholder, ILazyRoute } from './dynamic.interface';
export declare class Utils {
    static nextId(): number;
    static buildByNextId(value: string): string;
    static isPresent(obj: any): boolean;
    static isFunction(obj: any): boolean;
    static findLazyRouteLoader(path: string, routes: ILazyRoute[]): ILazyRoute;
    static applySourceAttributes(target: {}, source: {}): void;
    static toTemplate(remoteTemplateFactory: IDynamicRemoteTemplateFactory, response: DynamicHttpResponseT): string;
    static replaceDynamicContent(renderer: Renderer2, dynamicWrapperEl: Element): Element[];
    static toHash(v: string): string;
    static applyHashField(target: {}, source: Type<IDynamicTemplatePlaceholder> | string): void;
}
