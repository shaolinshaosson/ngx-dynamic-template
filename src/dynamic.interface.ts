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
