import commonjs from 'rollup-plugin-commonjs';
import includePaths from 'rollup-plugin-includepaths';

export default {
	entry: 'index.js',
	dest: 'bundles/ngx-dynamic-component.umd.js',
	format: 'umd',
	external: [
		'@angular/core',
		'@angular/common',
		'@angular/http',
		'@angular/compiler'
	],
	globals: {
		'@angular/core': 'ng.core',
		'@angular/common': 'ng.common',
		'@angular/http': 'ng.http',
		'@angular/compiler': 'ng.compiler'
	},
	plugins: [
		includePaths({
			include: {
				'ts-metadata-helper/index': './node_modules/ts-metadata-helper/index.js'
			}
		}),
		commonjs()
	],
	moduleName: 'ngx.dynamic.component'
}