"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dynamic_directive_1 = require("./dynamic.directive");
var dynamic_cache_1 = require("./dynamic.cache");
var dynamic_interface_1 = require("./dynamic.interface");
var dynamic_holder_1 = require("./dynamic.holder");
var NgxDynamicTemplateModule = /** @class */ (function () {
    function NgxDynamicTemplateModule() {
    }
    NgxDynamicTemplateModule.forRoot = function (options) {
        if (dynamic_holder_1.DynamicTemplateModuleHolder.saveAndGet()) {
            throw new Error('You cannot create dynamic template module more one time!');
        }
        return dynamic_holder_1.DynamicTemplateModuleHolder.saveAndGet({
            ngModule: NgxDynamicTemplateModule,
            providers: [
                dynamic_cache_1.DynamicCache,
                {
                    provide: dynamic_interface_1.DynamicTypes.DynamicExtraModules,
                    useValue: options && options.extraModules ? options.extraModules : [],
                },
                { provide: dynamic_interface_1.DynamicTypes.DynamicResponseRedirectStatuses, useValue: [301, 302, 307, 308] },
                { provide: core_1.NgModuleFactoryLoader, useClass: core_1.SystemJsNgModuleLoader },
                { provide: dynamic_interface_1.ROUTES_TOKEN, useValue: options && options.routes || [] },
                { provide: dynamic_interface_1.REMOVE_DYNAMIC_WRAPPER, useValue: options && options.removeDynamicWrapper || false },
            ],
        });
    };
    NgxDynamicTemplateModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [
                        dynamic_directive_1.DynamicDirective
                    ],
                    exports: [
                        dynamic_directive_1.DynamicDirective
                    ],
                },] },
    ];
    return NgxDynamicTemplateModule;
}());
exports.NgxDynamicTemplateModule = NgxDynamicTemplateModule;
//# sourceMappingURL=dynamic.module.js.map