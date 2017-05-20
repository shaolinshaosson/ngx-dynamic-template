import { NgModule, Compiler } from '@angular/core';
import { JitCompilerFactory } from '@angular/compiler';

import { DynamicComponent } from './DynamicComponent';
import { DynamicDirective } from "./DynamicDirective";
import { DYNAMIC_TYPES } from "./DynamicBase";
import { DynamicCache } from './DynamicCache';

function createJitCompiler() {
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
			DynamicComponent,
			DynamicDirective
		],
		exports: [
			DynamicComponent,
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
					DynamicComponent,
					DynamicDirective
				],
				exports: [
					DynamicComponent,
					DynamicDirective
				]
			}
		)
		class DynamicComponentFactoryModule {
		}
		return DynamicComponentFactoryModule;
	}
}
