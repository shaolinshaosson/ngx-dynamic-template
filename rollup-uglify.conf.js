import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

export default {
	entry: 'index.js',
	dest: 'bundles/ngx-dynamic-template.umd.min.js',
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
		commonjs(),
		uglify()
	],
	moduleName: 'ngx.dynamic.template'
}
