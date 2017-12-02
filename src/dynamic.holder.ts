import { ModuleWithProviders } from '@angular/core';

let _moduleInstance: ModuleWithProviders;

export class DynamicTemplateModuleHolder {

  public static saveAndGet(module?: ModuleWithProviders): ModuleWithProviders {
    if (_moduleInstance) {
      return _moduleInstance;
    }
    return _moduleInstance = module;
  }
}
