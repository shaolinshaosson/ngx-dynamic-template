import { NgModule, Compiler, ModuleWithProviders, SystemJsNgModuleLoader, NgModuleFactoryLoader } from '@angular/core';
import { JitCompilerFactory } from '@angular/compiler';

import { DynamicDirective } from './dynamic.directive';
import { DynamicCache } from './dynamic.cache';
import { DYNAMIC_TYPES } from './dynamic.interface';

export function createJitCompiler() {
	return new JitCompilerFactory([{useJit: true}]).createCompiler();
}

@NgModule(
	{
		declarations: [
			DynamicDirective
		],
		exports: [
			DynamicDirective
		]
	}
)
export class NgxDynamicTemplateModule {

	static forRoot(): ModuleWithProviders {
		return {
			ngModule: NgxDynamicTemplateModule,
			providers: [
				DynamicCache,
				{provide: DYNAMIC_TYPES.DynamicExtraModules, useValue: []},
				{provide: Compiler, useFactory: createJitCompiler},
				{provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader},
			]
		};
	}
}
