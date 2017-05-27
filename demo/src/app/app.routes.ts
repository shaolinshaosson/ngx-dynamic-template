import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  { path: '', loadChildren: './dynamic/dynamic-holder.module#DynamicHolderModule' },
  // Forcing to build the chunks
  { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule' },
  { path: 'lazy2', loadChildren: './lazy2/lazy2.module#Lazy2Module' },
];
