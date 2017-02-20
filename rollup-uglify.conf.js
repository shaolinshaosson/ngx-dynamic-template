import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';

export default {
	entry: 'index.js',
	dest: 'bundles/angular2-dynamic-component.umd.min.js',
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
		commonjs(),
		uglify()
	],
	moduleName: 'angular2.dynamic.component'
}