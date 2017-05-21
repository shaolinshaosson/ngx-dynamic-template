import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LazyComponent } from './lazy.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LazyComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LazyRouteModule {
}
