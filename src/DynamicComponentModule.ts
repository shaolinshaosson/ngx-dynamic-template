import {
	NgModule,
	Type
} from '@angular/core';

import {DynamicComponent} from './DynamicComponent';
import {DynamicDirective} from "./DynamicDirective";
import {DYNAMIC_TYPES} from "./DynamicBase";

@NgModule({
	declarations: [
		DynamicComponent,
		DynamicDirective
	],
	exports: [
		DynamicComponent,
		DynamicDirective
	],
	providers: [
		{provide: DYNAMIC_TYPES.DynamicExtraModules, useFactory: function () {
			return [];
		}}
	]
})
export class DynamicComponentModule {
}

export class DynamicComponentModuleFactory {

	static buildModule(dynamicExtraModules: Array<any>): Type<any> {
		@NgModule({
			declarations: [
				DynamicComponent,
				DynamicDirective
			],
			exports: [
				DynamicComponent,
				DynamicDirective
			],
			providers: [
				{provide: DYNAMIC_TYPES.DynamicExtraModules, useValue: dynamicExtraModules}
			]
		})
		class DynamicComponentFactoryModule {
		}
		return DynamicComponentFactoryModule;
	}
}
