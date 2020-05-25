"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moduleInstance;
var DynamicTemplateModuleHolder = /** @class */ (function () {
    function DynamicTemplateModuleHolder() {
    }
    DynamicTemplateModuleHolder.saveAndGet = function (module) {
        return moduleInstance || (moduleInstance = module);
    };
    return DynamicTemplateModuleHolder;
}());
exports.DynamicTemplateModuleHolder = DynamicTemplateModuleHolder;
//# sourceMappingURL=dynamic.holder.js.map