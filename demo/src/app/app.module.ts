import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgxDynamicTemplateModule } from 'ngx-dynamic-template';

import { AppComponent } from './app.component';

const DYNAMIC_TEMPLATE_MODULE = NgxDynamicTemplateModule.forRoot();

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DYNAMIC_TEMPLATE_MODULE
  ],
  providers: [
    {provide: 'DynamicModule', useValue: DYNAMIC_TEMPLATE_MODULE}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
