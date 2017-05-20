import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Compiler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { JitCompiler } from '@angular/compiler';

import { DynamicComponentModule } from 'ngx-dynamic-component';

import { AppComponent, TextField, CheckboxField, RadioField, Child1Component, Child2Component } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    TextField,
    CheckboxField,
    RadioField,
    Child1Component,
    Child2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DynamicComponentModule
  ],
  exports: [
    DynamicComponentModule
  ],
  providers: [
    {provide: 'DynamicModule', useValue: DynamicComponentModule},
    {provide: Compiler, useExisting: JitCompiler}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
