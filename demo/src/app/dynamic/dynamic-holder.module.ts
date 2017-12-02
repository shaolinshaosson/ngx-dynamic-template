import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDynamicTemplateModule } from 'ngx-dynamic-template';

import { DynamicHolderComponent } from './dynamic-holder.component';
import { DynamicHolderRouteModule } from './dynamic-holder.route';
import { ROUTES } from '../app.routes';

const DynamicTemplateModule = NgxDynamicTemplateModule.forRoot({ routes: ROUTES });

@NgModule({
  imports: [
    CommonModule,
    DynamicHolderRouteModule,
    DynamicTemplateModule,
  ],
  declarations: [
    DynamicHolderComponent,
  ],
})
export class DynamicHolderModule {
}
