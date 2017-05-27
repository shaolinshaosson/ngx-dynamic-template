import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicHolderComponent } from './dynamic-holder.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DynamicHolderComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class DynamicHolderRouteModule {
}
