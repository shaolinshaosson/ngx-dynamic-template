import { Response, RequestOptionsArgs } from '@angular/http';
import { Type } from '@angular/core';

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
  useJit: boolean;
}

export interface IDynamicComponentMetadata {
  componentMetadata: any;
}

export interface IDynamicMetadata {
  modules: any[];
  components: IDynamicComponentMetadata[];
}
