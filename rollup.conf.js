import commonjs from 'rollup-plugin-commonjs';
import includePaths from 'rollup-plugin-includepaths';

export default {
	entry: 'index.js',
	dest: 'bundles/angular2-dynamic-component.umd.js',
	format: 'umd',
	external: [
		'@angular/core',
		'@angular/common',
		'@angular/http'
	],
	globals: {
		'@angular/core': 'ng.core',
		'@angular/common': 'ng.common',
		'@angular/http': 'ng.http'
	},
	plugins: [
		includePaths({
			include: {
				'ts-metadata-helper/index': './node_modules/ts-metadata-helper/index.js'
			}
		}),
		commonjs()
	],
	moduleName: 'angular2.dynamic.component'
}