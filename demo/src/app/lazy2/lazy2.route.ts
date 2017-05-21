import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Lazy2Component } from './lazy2.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: Lazy2Component
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class Lazy2RouteModule {
}
