import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', loadChildren: 'app/dynamic/dynamic-holder.module#DynamicHolderModule' },
      // Forcing to build a chunks
      { path: 'lazy', loadChildren: 'app/lazy/lazy.module#LazyModule' },
      { path: 'lazy2', loadChildren: 'app/lazy2/lazy2.module#Lazy2Module' },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
