import { NgModule, Compiler, ModuleWithProviders, SystemJsNgModuleLoader, NgModuleFactoryLoader } from '@angular/core';
import { JitCompilerFactory } from '@angular/compiler';

import { DynamicDirective } from './dynamic.directive';
import { DynamicCache } from './dynamic.cache';
import { DynamicTypes, IDynamicTemplateOptions } from './dynamic.interface';

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

	static forRoot(options?: IDynamicTemplateOptions): ModuleWithProviders {
		const providers: any[] = [
			DynamicCache,
			{ provide: DynamicTypes.DynamicExtraModules, useValue: options && options.extraModules ? options.extraModules : [] },
			{ provide: DynamicTypes.DynamicResponseRedirectStatuses, useValue: [301, 302, 307, 308] },
			{ provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
		];
		if (options && options.useJit) {
			providers.push({ provide: Compiler, useFactory: createJitCompiler },);
		}
		return {
			ngModule: NgxDynamicTemplateModule,
			providers: providers
		};
	}
}
