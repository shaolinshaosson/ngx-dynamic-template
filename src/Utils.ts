import {Component} from '@angular/core';

import {
    MetadataHelper,
    DecoratorType
} from 'ts-metadata-helper/index';

import {DynamicComponentType} from './DynamicBase';

export class Utils {

    static isPresent(obj) {
        return obj !== undefined && obj !== null;
    }

    static isUndefined(obj) {
        return obj === undefined;
    }

    static isString(obj) {
        return typeof obj === 'string';
    }

    static isFunction(obj) {
        return typeof obj === 'function';
    }

    static isArray(obj) {
        return Array.isArray(obj);
    }

    static findComponentDecoratorByComponentType(componentType?:DynamicComponentType):DecoratorType {
        if (Utils.isPresent(componentType)) {
            const annotationsArray:Array<DecoratorType> = MetadataHelper.findAnnotationsMetaData(componentType, Component);
            if (annotationsArray.length) {
                return annotationsArray[0];
            }
        }
        return null;
    }
}
