import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'index.js',
	dest: 'bundles/angular2-dynamic-component.umd.js',
	format: 'umd',
	external: [
		'@angular/core',
		'@angular/common',
		'@angular/http',
		'ts-metadata-helper/index'
	],
	globals: {
		'@angular/core': 'ng.core',
		'@angular/common': 'ng.common',
		'@angular/http': 'ng.http',
		'ts-metadata-helper/index': 'alexpoter.ts-metadata-helper'
	},
	plugins: [
		commonjs()
	],
	moduleName: 'angular2.dynamic.component'
}