import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { Lazy2Component } from './lazy2.component';
import { Lazy2RouteModule } from './lazy2.route';

@NgModule({
  imports: [
    CommonModule,
    Lazy2RouteModule,
  ],
  declarations: [
    Lazy2Component,
  ],
  exports: [
    Lazy2Component
  ]
})
export class Lazy2Module {
}
