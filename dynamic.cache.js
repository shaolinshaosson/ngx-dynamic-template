"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var DynamicCache = /** @class */ (function () {
    function DynamicCache(ngZone) {
        var _this = this;
        this.memoryCache = new Map();
        /**
         * Notifies when code enters Angular Zone. This gets fired first on VM Turn.
         */
        ngZone.onUnstable.subscribe(function () { return _this.memoryCache.clear(); });
        /**
         * Notifies when the last `onMicrotaskEmpty` has run and there are no more microtasks, which
         * implies we are about to relinquish VM turn.
         * This event gets called just once.
         */
        ngZone.onStable.subscribe(function () { return _this.memoryCache.clear(); });
    }
    DynamicCache.prototype.set = function (key, value) {
        this.memoryCache.set(key, value);
    };
    DynamicCache.prototype.get = function (key) {
        return this.memoryCache.get(key);
    };
    DynamicCache.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    DynamicCache.ctorParameters = function () { return [
        { type: core_1.NgZone, decorators: [{ type: core_1.Inject, args: [core_1.NgZone,] }] }
    ]; };
    return DynamicCache;
}());
exports.DynamicCache = DynamicCache;
//# sourceMappingURL=dynamic.cache.js.map