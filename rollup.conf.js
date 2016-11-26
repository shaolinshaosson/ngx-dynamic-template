export default {
	entry: 'index.js',
	dest: 'bundles/angular2-dynamic-component.umd.js',
	format: 'umd',
	external: [
		'@angular/core',
		'@angular/compiler',
		'@angular/platform-browser',
		'@angular/common',
		'@angular/http'
	],
	globals: {
		'@angular/core': 'ng.core',
		'@angular/compiler': 'ng.compiler',
		'@angular/platform-browser': 'ng.platform-browser',
		'@angular/common': 'ng.common',
		'@angular/http': 'ng.http'
	},
	moduleName: 'angular2.dynamic.component'
}