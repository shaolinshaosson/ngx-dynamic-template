import { NgZone, ModuleWithComponentFactories } from '@angular/core';
export declare class DynamicCache {
    private memoryCache;
    constructor(ngZone: NgZone);
    set(key: string, value: Promise<ModuleWithComponentFactories<any>>): void;
    get(key: string): Promise<ModuleWithComponentFactories<any>>;
}
