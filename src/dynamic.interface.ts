import { Response, RequestOptionsArgs } from '@angular/http';

export const DynamicTypes = {
  DynamicExtraModules: 'DynamicExtraModules'
};

export interface IComponentRemoteTemplateFactory {
  buildRequestOptions(): RequestOptionsArgs;
  parseResponse(response: Response): string;
}

export interface IDynamicTemplateContext {
  [index: string]: any;
}

export interface IDynamicTemplateType {
}

export interface IDynamicTemplateMetadata {
  selector: string;
  styles?: string[];
  template?: string;
  templateUrl?: string;
}
