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

export interface IDynamicMetadata {
  selector: string;
  styles?: Array<string>;
  template?: string;
  templateUrl?: string;
}

export interface IDynamicType {
}
