import { NgModule, Compiler, ModuleWithProviders } from '@angular/core';
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
				{provide: Compiler, useFactory: createJitCompiler}
			]
		};
	}
}

export class DynamicComponentModuleFactory {

	static buildModule(dynamicExtraModules:Array<any>):Function {
		@NgModule(
			{
				providers: [
					DynamicCache,
					{provide: DYNAMIC_TYPES.DynamicExtraModules, useValue: dynamicExtraModules},
					{provide: Compiler, useFactory: createJitCompiler}
				],
				declarations: [
					DynamicDirective
				],
				exports: [
					DynamicDirective
				]
			}
		)
		class DynamicComponentFactoryModule {
		}
		return DynamicComponentFactoryModule;
	}
}
