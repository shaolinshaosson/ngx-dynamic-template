import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DynamicComponentModule } from 'ngx-dynamic-template';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DynamicComponentModule
  ],
  providers: [
    {provide: 'DynamicModule', useValue: DynamicComponentModule}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
