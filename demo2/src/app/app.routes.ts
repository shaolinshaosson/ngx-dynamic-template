import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule' },
  { path: 'lazy2', loadChildren: './lazy2/lazy2.module#Lazy2Module' }
];
