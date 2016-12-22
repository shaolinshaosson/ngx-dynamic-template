import {Component} from '@angular/core';

import {
	MetadataHelper,
	DecoratorType
} from 'ts-metadata-helper/index';

import {DynamicComponentType} from './DynamicBase';

let uniqueId: number = 0;

export class Utils {

	static nextId(): number {
		return uniqueId++;
	}

	static buildByNextId(value: string): string {
		return value.replace('{id}', String(this.nextId()));
	}

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

	static findComponentDecoratorByComponentType(componentType?: DynamicComponentType): DecoratorType {
		if (Utils.isPresent(componentType)) {
			const annotationsArray: Array<DecoratorType> = MetadataHelper.findAnnotationsMetaData(componentType, Component);
			if (annotationsArray.length) {
				return annotationsArray[0];
			}
		}
		return null;
	}

	static isSelectorOfComponentTypeEqual(selector: string, componentType: DynamicComponentType): boolean {
		const componentDecorator: DecoratorType = Utils.findComponentDecoratorByComponentType(componentType);
		let currentSelector: string = null;

		return this.isPresent(componentDecorator)
			&& this.isPresent(currentSelector = this.extractSelector(componentDecorator))
			&& selector === currentSelector;
	}

	static extractSelector(object: DecoratorType): string {
		return Reflect.get(object, 'selector');
	}

	/**
	 * Calculate a 32 bit FNV-1a hash
	 * Found here: https://gist.github.com/vaiorabbit/5657561
	 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
	 *
	 * @param {string} str the input value
	 * @param {boolean} [asString=false] set to true to return the hash value as
	 *     8-digit hex string instead of an integer
	 * @param {number} [seed] optionally pass the hash of the previous chunk
	 * @returns {string|number}
	 */
	static hashFnv32a(str, asString?, seed?): string|number {
		/*jshint bitwise:false */
		var i, l,
			hval = (seed === undefined) ? 0x811c9dc5 : seed;

		for (i = 0, l = str.length; i < l; i++) {
			hval ^= str.charCodeAt(i);
			hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
		}
		if (asString) {
			// Convert to 8 digit hex string
			return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
		}
		return hval >>> 0;
	}
}
