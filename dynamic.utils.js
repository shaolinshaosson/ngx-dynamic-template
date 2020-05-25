"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Hashes = require("jshashes");
var dynamic_interface_1 = require("./dynamic.interface");
var SHA1 = new Hashes.SHA1;
var uniqueId = 0;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.nextId = function () {
        return uniqueId++;
    };
    Utils.buildByNextId = function (value) {
        return value.replace('{id}', String(this.nextId()));
    };
    Utils.isPresent = function (obj) {
        return obj !== undefined && obj !== null;
    };
    Utils.isFunction = function (obj) {
        return typeof obj === 'function';
    };
    Utils.findLazyRouteLoader = function (path, routes) {
        return routes.filter(function (lazyRouter) { return lazyRouter.path === path; })[0];
    };
    Utils.applySourceAttributes = function (target, source) {
        if (!Utils.isPresent(source)) {
            return;
        }
        var _loop_1 = function (property) {
            if (source.hasOwnProperty(property)) {
                var propValue = Reflect.get(source, property);
                var proxyObject = {};
                if (!Utils.isFunction(propValue)) {
                    proxyObject.set = function (v) { return Reflect.set(source, property, v); };
                }
                proxyObject.get = function () { return Reflect.get(source, property); };
                Reflect.defineProperty(target, property, proxyObject);
            }
        };
        for (var property in source) {
            _loop_1(property);
        }
    };
    Utils.toTemplate = function (remoteTemplateFactory, response) {
        var template = this.isPresent(remoteTemplateFactory) && this.isFunction(remoteTemplateFactory.parseResponse)
            ? remoteTemplateFactory.parseResponse(response)
            : null;
        if (!this.isPresent(template)) {
            try {
                return JSON.stringify(response.body);
            }
            catch (e) {
                return response.statusText;
            }
        }
        else {
            return template;
        }
    };
    Utils.replaceDynamicContent = function (renderer, dynamicWrapperEl) {
        if (!dynamicWrapperEl.children.length) {
            return null;
        }
        var els = [];
        for (var _i = 0, _a = Array.from(dynamicWrapperEl.children); _i < _a.length; _i++) {
            var dEl = _a[_i];
            renderer.insertBefore(dynamicWrapperEl.parentElement, dEl, dynamicWrapperEl);
            els.push(dEl);
        }
        renderer.removeChild(dynamicWrapperEl.parentElement, dynamicWrapperEl);
        return els;
    };
    Utils.toHash = function (v) {
        return SHA1.hex(v);
    };
    Utils.applyHashField = function (target, source) {
        if (Utils.isPresent(source)) {
            Reflect.set(target, dynamic_interface_1.HASH_FIELD, typeof source === 'string' ? Utils.toHash(source) : Reflect.get(source, dynamic_interface_1.HASH_FIELD));
        }
    };
    return Utils;
}());
exports.Utils = Utils;
//# sourceMappingURL=dynamic.utils.js.map