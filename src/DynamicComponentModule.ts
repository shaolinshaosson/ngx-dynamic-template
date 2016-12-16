import {
	NgModule,
	Type
} from '@angular/core';

import {DynamicComponent} from './DynamicComponent';
import {DynamicDirective} from "./DynamicDirective";
import {DYNAMIC_TYPES} from "./DynamicBase";
import {DynamicCache} from './DynamicCache';

const DynamicDeclarations = {
	declarations: [
		DynamicComponent,
		DynamicDirective
	],
	exports: [
		DynamicComponent,
		DynamicDirective
	]
};

@NgModule(
	Object.assign({
		providers: [
			DynamicCache,
			{provide: DYNAMIC_TYPES.DynamicExtraModules, useValue: []}
		]
	}, DynamicDeclarations)
)
export class DynamicComponentModule {
}

export class DynamicComponentModuleFactory {

	static buildModule(dynamicExtraModules:Array<any>):Type<any> {
		@NgModule(
			Object.assign({
				providers: [
					DynamicCache,
					{provide: DYNAMIC_TYPES.DynamicExtraModules, useValue: dynamicExtraModules}
				]
			}, DynamicDeclarations)
		)
		class DynamicComponentFactoryModule {
		}
		return DynamicComponentFactoryModule;
	}
}
