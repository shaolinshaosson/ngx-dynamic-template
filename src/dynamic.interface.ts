import { Response, RequestOptionsArgs } from '@angular/http';
import { Compiler, Type, InjectionToken } from '@angular/core';

export const DynamicTypes = {
  DynamicExtraModules: 'DynamicExtraModules',
  DynamicResponseRedirectStatuses: 'DynamicResponseRedirectStatuses'
};

export interface IDynamicRemoteTemplateFactory {
  buildRequestOptions?: () => RequestOptionsArgs;
  parseResponse?: (response: Response) => string;
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

export type AnyT = Type<any>;

export interface IDynamicTemplateOptions {
  extraModules?: any[];
  routes?: ILazyRoute[];
  useJit?: boolean;
}

export interface ILazyRoute {
  path?: string;
  component?: any;
  loadChildren?: Function|string;
}

export interface IDynamicComponentMetadata {
  componentMetadata: any;
}

export const DynamicMetadataKey = '__metadata';

export class Compiler2 extends Compiler {
}

export const ROUTES_TOKEN = new InjectionToken('ROUTES');