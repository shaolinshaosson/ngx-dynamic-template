"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var rxjs_1 = require("rxjs");
var dynamic_utils_1 = require("./dynamic.utils");
var dynamic_interface_1 = require("./dynamic.interface");
var dynamic_holder_1 = require("./dynamic.holder");
var DynamicBase = /** @class */ (function () {
    function DynamicBase(dynamicExtraModules, dynamicResponseRedirectStatuses, viewContainer, compiler, http, renderer, dynamicCache, moduleFactoryLoader, routes, removeDynamicWrapper, dynamicSelector) {
        this.dynamicExtraModules = dynamicExtraModules;
        this.dynamicResponseRedirectStatuses = dynamicResponseRedirectStatuses;
        this.viewContainer = viewContainer;
        this.compiler = compiler;
        this.http = http;
        this.renderer = renderer;
        this.dynamicCache = dynamicCache;
        this.moduleFactoryLoader = moduleFactoryLoader;
        this.routes = routes;
        this.removeDynamicWrapper = removeDynamicWrapper;
        this.lazyExtraModules = [];
        this.templateReady = new core_1.EventEmitter();
        this.dynamicSelector = dynamic_utils_1.Utils.buildByNextId(dynamicSelector);
        this.injector = core_1.Injector.create([], this.viewContainer.parentInjector);
    }
    /**
     * @override
     */
    DynamicBase.prototype.ngOnChanges = function (changes) {
        var _this = this;
        this.ngOnDestroy();
        this.buildModule().then(function (module) {
            var compiledModulePromise;
            var currentModuleHash = Reflect.get(module, dynamic_interface_1.HASH_FIELD);
            if (dynamic_utils_1.Utils.isPresent(currentModuleHash)) {
                compiledModulePromise = _this.dynamicCache.get(currentModuleHash);
                if (!dynamic_utils_1.Utils.isPresent(compiledModulePromise)) {
                    _this.dynamicCache.set(currentModuleHash, compiledModulePromise = _this.compiler.compileModuleAndAllComponentsAsync(module));
                }
            }
            else {
                compiledModulePromise = _this.compiler.compileModuleAndAllComponentsAsync(module);
            }
            compiledModulePromise
                .then(function (compiledModule) { return _this.makeDynamicTemplatePlaceholder(compiledModule); });
        });
    };
    /**
     * @override
     */
    DynamicBase.prototype.ngOnDestroy = function () {
        if (dynamic_utils_1.Utils.isPresent(this.moduleInstance)) {
            this.moduleInstance.destroy();
            this.moduleInstance = null;
        }
        if (dynamic_utils_1.Utils.isPresent(this.templatePlaceholder)) {
            this.templatePlaceholder.destroy();
            this.templatePlaceholder = null;
        }
        if (dynamic_utils_1.Utils.isPresent(this.cachedDynamicModule)) {
            this.compiler.clearCacheFor(this.cachedDynamicModule);
            this.cachedDynamicModule = null;
        }
        if (dynamic_utils_1.Utils.isPresent(this.cachedTemplatePlaceholder)) {
            this.compiler.clearCacheFor(this.cachedTemplatePlaceholder);
            this.cachedTemplatePlaceholder = null;
        }
        if (dynamic_utils_1.Utils.isPresent(this.replacedNodes)) {
            for (var _i = 0, _a = this.replacedNodes; _i < _a.length; _i++) {
                var el = _a[_i];
                this.renderer.removeChild(el.parentElement, el);
            }
            this.replacedNodes = null;
        }
    };
    DynamicBase.prototype.makeDynamicTemplatePlaceholder = function (moduleWithComponentFactories) {
        var _this = this;
        this.moduleInstance = moduleWithComponentFactories.ngModuleFactory.create(this.injector);
        var factory = moduleWithComponentFactories.componentFactories.find(function (componentFactory) { return (componentFactory.selector === _this.dynamicSelector
            || (dynamic_utils_1.Utils.isPresent(componentFactory.componentType) && dynamic_utils_1.Utils.isPresent(_this.template)
                && Reflect.get(componentFactory.componentType, dynamic_interface_1.HASH_FIELD) === dynamic_utils_1.Utils.toHash(_this.template))); });
        var templatePlaceholder = this.templatePlaceholder = factory.create(this.injector, null, null, this.moduleInstance);
        this.viewContainer.insert(templatePlaceholder.hostView, 0);
        dynamic_utils_1.Utils.applySourceAttributes(this.templatePlaceholder.instance, this.context);
        if (this.removeDynamicWrapper) {
            this.replacedNodes = dynamic_utils_1.Utils.replaceDynamicContent(this.renderer, templatePlaceholder.location.nativeElement);
        }
        this.templateReady.emit(this.templatePlaceholder.instance);
    };
    DynamicBase.prototype.buildModule = function () {
        var _this = this;
        var lazyModules = [].concat(this.lazyModules || []);
        var lazyModulesLoaders = [];
        for (var _i = 0, lazyModules_1 = lazyModules; _i < lazyModules_1.length; _i++) {
            var lazyModule = lazyModules_1[_i];
            var lazyRoute = dynamic_utils_1.Utils.findLazyRouteLoader(lazyModule, this.routes);
            if (lazyRoute) {
                if (dynamic_utils_1.Utils.isFunction(lazyRoute.loadChildren)) {
                    // angular2-class starter
                    lazyModulesLoaders.push(rxjs_1.of(lazyRoute.loadChildren()).toPromise());
                }
                else {
                    // angular-cli
                    lazyModulesLoaders.push(this.moduleFactoryLoader.load(lazyRoute.loadChildren));
                }
            }
            else {
                lazyModulesLoaders.push(this.moduleFactoryLoader.load(lazyModule));
            }
        }
        return new Promise(function (resolve) {
            Promise.all(lazyModulesLoaders)
                .then(function (moduleFactories) {
                for (var _i = 0, moduleFactories_1 = moduleFactories; _i < moduleFactories_1.length; _i++) {
                    var moduleFactory = moduleFactories_1[_i];
                    if (moduleFactory instanceof core_1.NgModuleFactory) {
                        // angular-cli
                        _this.lazyExtraModules.push(moduleFactory.moduleType);
                    }
                    else {
                        // angular2-class starter
                        _this.lazyExtraModules.push(moduleFactory);
                    }
                }
                if (dynamic_utils_1.Utils.isPresent(_this.template)) {
                    resolve(_this.makeComponentModule({ template: _this.template }));
                }
                else if (dynamic_utils_1.Utils.isPresent(_this.httpUrl)) {
                    _this.loadRemoteTemplate(_this.httpUrl, resolve);
                }
                else {
                    resolve(_this.makeComponentModule());
                }
            });
        });
    };
    DynamicBase.prototype.loadRemoteTemplate = function (httpUrl, resolve) {
        var _this = this;
        var requestArgs;
        if (dynamic_utils_1.Utils.isPresent(this.remoteTemplateFactory)
            && dynamic_utils_1.Utils.isFunction(this.remoteTemplateFactory.buildRequestOptions)) {
            requestArgs = this.remoteTemplateFactory.buildRequestOptions();
        }
        this.http.get(httpUrl, __assign({ withCredentials: true, observe: 'response' }, requestArgs))
            .subscribe(function (response) {
            if (_this.dynamicResponseRedirectStatuses.includes(response.status)) {
                var chainedUrl = response.headers.get('Location');
                if (dynamic_utils_1.Utils.isPresent(chainedUrl)) {
                    _this.loadRemoteTemplate(chainedUrl, resolve);
                }
                else {
                    console.warn("The location header is empty. Stop processing. Response status is " + response.status);
                }
            }
            else {
                resolve(_this.makeComponentModule({ template: dynamic_utils_1.Utils.toTemplate(_this.remoteTemplateFactory, response) }));
            }
        }, function () {
            var template = _this.defaultTemplate || '';
            resolve(_this.makeComponentModule({ template: template }));
        });
    };
    DynamicBase.prototype.makeComponentModule = function (dynamicConfig) {
        var dynamicComponentCtor = this.cachedTemplatePlaceholder = this.makeComponent(dynamicConfig);
        var modules = this.dynamicExtraModules
            .concat(this.extraModules || [])
            .concat(this.lazyExtraModules)
            .concat(dynamic_holder_1.DynamicTemplateModuleHolder.saveAndGet());
        var $DynamicComponentModule = /** @class */ (function () {
            function $DynamicComponentModule() {
            }
            $DynamicComponentModule.decorators = [
                { type: core_1.NgModule, args: [{
                            declarations: [dynamicComponentCtor],
                            imports: [common_1.CommonModule].concat(modules),
                        },] },
            ];
            return $DynamicComponentModule;
        }());
        dynamic_utils_1.Utils.applyHashField($DynamicComponentModule, dynamicComponentCtor);
        return this.cachedDynamicModule = $DynamicComponentModule;
    };
    DynamicBase.prototype.makeComponent = function (componentConfig) {
        var dynamicComponentMetaData = {
            selector: this.dynamicSelector,
            styles: this.styles,
        };
        if (dynamic_utils_1.Utils.isPresent(componentConfig)) {
            if (dynamic_utils_1.Utils.isPresent(componentConfig.template)) {
                dynamicComponentMetaData.template = componentConfig.template;
            }
            else if (dynamic_utils_1.Utils.isPresent(componentConfig.templatePath)) {
                dynamicComponentMetaData.templateUrl = componentConfig.templatePath;
            }
        }
        var $DynamicComponent = /** @class */ (function () {
            function $DynamicComponent() {
            }
            $DynamicComponent.decorators = [
                { type: core_1.Component, args: [dynamicComponentMetaData,] },
            ];
            return $DynamicComponent;
        }());
        dynamic_utils_1.Utils.applyHashField($DynamicComponent, dynamicComponentMetaData.template);
        return $DynamicComponent;
    };
    DynamicBase.propDecorators = {
        templateReady: [{ type: core_1.Output }],
        template: [{ type: core_1.Input }],
        lazyModules: [{ type: core_1.Input }],
        httpUrl: [{ type: core_1.Input }],
        context: [{ type: core_1.Input }],
        remoteTemplateFactory: [{ type: core_1.Input }],
        extraModules: [{ type: core_1.Input }],
        styles: [{ type: core_1.Input }],
        defaultTemplate: [{ type: core_1.Input }]
    };
    return DynamicBase;
}());
exports.DynamicBase = DynamicBase;
//# sourceMappingURL=dynamic.base.js.map