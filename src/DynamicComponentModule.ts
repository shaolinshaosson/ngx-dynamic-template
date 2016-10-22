import {NgModule} from '@angular/core';

import {DynamicComponent} from './DynamicComponent';
import {DynamicDirective} from "./DynamicDirective";

@NgModule({
    declarations: [
        DynamicComponent,
        DynamicDirective
    ],
    exports: [
        DynamicComponent,
        DynamicDirective
    ]
})
export class DynamicComponentModule {
}
