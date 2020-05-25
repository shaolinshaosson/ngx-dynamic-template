"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var dynamic_base_1 = require("./dynamic.base");
var dynamic_cache_1 = require("./dynamic.cache");
var dynamic_interface_1 = require("./dynamic.interface");
var DynamicDirective = /** @class */ (function (_super) {
    __extends(DynamicDirective, _super);
    function DynamicDirective(dynamicExtraModules, dynamicResponseRedirectStatuses, viewContainer, compiler, http, renderer, moduleFactoryLoader, dynamicCache, routes, removeDynamicWrapper) {
        return _super.call(this, dynamicExtraModules, dynamicResponseRedirectStatuses, viewContainer, compiler, http, renderer, dynamicCache, moduleFactoryLoader, routes, removeDynamicWrapper, '[dynamic-template-{id}]') || this;
    }
    DynamicDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[dynamic-template]',
                },] },
    ];
    /** @nocollapse */
    DynamicDirective.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: core_1.Inject, args: [dynamic_interface_1.DynamicTypes.DynamicExtraModules,] }] },
        { type: Array, decorators: [{ type: core_1.Inject, args: [dynamic_interface_1.DynamicTypes.DynamicResponseRedirectStatuses,] }] },
        { type: core_1.ViewContainerRef, decorators: [{ type: core_1.Inject, args: [core_1.ViewContainerRef,] }] },
        { type: core_1.Compiler, decorators: [{ type: core_1.Inject, args: [core_1.Compiler,] }] },
        { type: http_1.HttpClient, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [http_1.HttpClient,] }] },
        { type: core_1.Renderer2, decorators: [{ type: core_1.Inject, args: [core_1.Renderer2,] }] },
        { type: core_1.NgModuleFactoryLoader, decorators: [{ type: core_1.Inject, args: [core_1.NgModuleFactoryLoader,] }] },
        { type: dynamic_cache_1.DynamicCache, decorators: [{ type: core_1.Inject, args: [dynamic_cache_1.DynamicCache,] }] },
        { type: Array, decorators: [{ type: core_1.Inject, args: [dynamic_interface_1.ROUTES_TOKEN,] }] },
        { type: Boolean, decorators: [{ type: core_1.Inject, args: [dynamic_interface_1.REMOVE_DYNAMIC_WRAPPER,] }] }
    ]; };
    return DynamicDirective;
}(dynamic_base_1.DynamicBase));
exports.DynamicDirective = DynamicDirective;
//# sourceMappingURL=dynamic.directive.js.map