import {
  Response,
  RequestOptionsArgs
} from '@angular/http';

export const DYNAMIC_TYPES = {
  DynamicExtraModules: 'DynamicExtraModules'
};

export interface IComponentRemoteTemplateFactory {
  buildRequestOptions():RequestOptionsArgs;
  parseResponse(response:Response):string;
}

export interface IDynamicMetadata {
  selector: string;
  styles?: Array<string>;
  template?: string;
  templateUrl?: string;
}

export interface IDynamicType {
}
