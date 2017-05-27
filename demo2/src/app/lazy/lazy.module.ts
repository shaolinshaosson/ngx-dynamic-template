import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { LazyComponent } from './lazy.component';
import { LazyRouteModule } from './lazy.route';

@NgModule({
  imports: [
    CommonModule,
    LazyRouteModule,
  ],
  declarations: [
    LazyComponent,
  ],
  exports: [
    LazyComponent
  ]
})
export class LazyModule {
}
