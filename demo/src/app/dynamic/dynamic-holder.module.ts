import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { NgxDynamicTemplateModule } from 'ngx-dynamic-template';

import { DynamicHolderComponent } from './dynamic-holder.component';
import { DynamicHolderRouteModule } from './dynamic-holder.route';

const DynamicTemplateModule = NgxDynamicTemplateModule.forRoot();

@NgModule({
  imports: [
    CommonModule,
    DynamicHolderRouteModule,
    DynamicTemplateModule,
  ],
  declarations: [
    DynamicHolderComponent,
  ],
  providers: [
    {provide: 'DynamicModule', useValue: DynamicTemplateModule}
  ],
})
export class DynamicHolderModule {
}
