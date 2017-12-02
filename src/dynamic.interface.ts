import { Type, InjectionToken } from '@angular/core';

export const DynamicTypes = {
  DynamicExtraModules: 'DynamicExtraModules',
  DynamicResponseRedirectStatuses: 'DynamicResponseRedirectStatuses',
};

export interface IDynamicRemoteTemplateFactory {
  buildRequestOptions?: () => { [index: string]: any; };
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

export const HASH_FIELD: string = '__hashValue';

export const DynamicMetadataKey = '__metadata';

export const ROUTES_TOKEN = new InjectionToken('ROUTES');
