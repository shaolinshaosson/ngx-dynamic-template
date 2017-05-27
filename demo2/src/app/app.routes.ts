import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  // Forcing to build the chunks
  { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule' },
  { path: 'lazy2', loadChildren: './lazy2/lazy2.module#Lazy2Module' },
];
