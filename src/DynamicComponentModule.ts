import { NgModule, Compiler } from '@angular/core';
import { JitCompilerFactory } from '@angular/compiler';

import { DynamicDirective } from "./DynamicDirective";
import { DYNAMIC_TYPES } from "./DynamicBase";
import { DynamicCache } from './DynamicCache';

export function createJitCompiler() {
	return new JitCompilerFactory([{useJit: true}]).createCompiler();
}

@NgModule(
	{
		providers: [
			DynamicCache,
			{provide: DYNAMIC_TYPES.DynamicExtraModules, useValue: []},
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
export class DynamicComponentModule {
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
