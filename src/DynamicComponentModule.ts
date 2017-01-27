import {
	NgModule,
	Type
} from '@angular/core';

import {DynamicComponent} from './DynamicComponent';
import {DynamicDirective} from "./DynamicDirective";
import {DYNAMIC_TYPES} from "./DynamicBase";
import {DynamicCache} from './DynamicCache';

@NgModule(
	{
		providers: [
			DynamicCache,
			{provide: DYNAMIC_TYPES.DynamicExtraModules, useValue: []}
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

	static buildModule(dynamicExtraModules:Array<any>):Type<any> {
		@NgModule(
			{
				providers: [
					DynamicCache,
					{provide: DYNAMIC_TYPES.DynamicExtraModules, useValue: dynamicExtraModules}
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
