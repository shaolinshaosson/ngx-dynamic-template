# ngx-dynamic-template

An implementation of dynamic template wrapper at Angular4 [4.1.3] (AoT compatible).
In case of dynamic component please use ngComponentOutlet.  

## Description

Date of creation: 18 Jun 2016 [started with Angular 2.0.0-rc.2].  
The previous version of this module is tandem [angular2-dynamic-component](https://www.npmjs.com/package/angular2-dynamic-component) and [ts-metadata-helper](https://www.npmjs.com/package/ts-metadata-helper). The last source code version of the angular2-dynamic-component you can see [here](https://github.com/apoterenko/ngx-dynamic-template/blob/858be91281634bcb06ec82dae40ee1f8eba56563/src/DynamicBase.ts).  

## Installation

```sh
npm install ngx-dynamic-template --save
```

```typescript
import { NgxDynamicTemplateModule } from 'ngx-dynamic-template';

@NgModule({
    imports: [NgxDynamicTemplateModule.forRoot()]
})
```

## Demo

[Live demo](https://apoterenko.github.io/ngx-dynamic-template)  
[Local demo](https://github.com/apoterenko/ngx-dynamic-template/tree/master/demo)  

## Features

##### **1** Support of **dynamic-template** directive.

```html
<ng-template dynamic-template
             [template]="'<span style=\'color: orange;\'>This is simple dynamic template</span>'">
</ng-template>
```

##### **2** Support of lazy loaded component modules for the dynamic templates via **lazyModules** input parameter.

```html
<ng-template dynamic-template
             [template]="'<lazy-component></lazy-component>'"
             [lazyModules]="['app/lazy/lazy.module#LazyModule']">
</ng-template>
```

##### **3** Support of **httpUrl** attribute. This attribute allows getting resource via Angular2 HTTP/Ajax.

Also 301, 302, 307, 308 HTTP statuses are supported (recursive redirection). The **remoteTemplateFactory** is an optional attribute allows parse response and build http request.

```html
<ng-template dynamic-template
             [httpUrl]="'https://httpbin.org/get'"
             [remoteTemplateFactory]="remoteTemplateFactory">
</ng-template>
```

##### **4** Support of **templateReady** output events.

TODO

##### **3** Support of **Dynamic within Dynamic** strategy.

```typescript
@Component(...)
export class AppComponent {
	extraTemplate = `<template dynamic-template [componentTemplate]='"<span>Dynamic inside dynamic!</span>"'></template>`;
	extraModules = [DynamicComponentModule];
	...
}
```
```html
<template dynamic-template
          [componentModules]="extraModules"
          [componentTemplate]='extraTemplate'></template>
``` 



```typescript
@Component(...)
export class AppComponent {
	dynamicCallback(scope) {
		console.log('Hi there! Context value is:', scope.contextValue); // Hi there! Context value is: 100500
	}
}
```
```html
<template dynamic-template
          (dynamicComponentReady)="dynamicCallback($event)"
          [componentContext]="{contextValue: 100500}"
          [componentDefaultTemplate]='"<span style=\"color: red\">This is fallback template</span>"'
          [componentTemplateUrl]='"https://test-cors.appspot.com"'></template>
```          

##### **6** Support of **componentContext** attribute.  

This attribute can refer to owner component (via self = this) or any other object.  

```typescript
@Component(...)
export class AppComponent {
	self = this;
	dynamicContextValue = 100500;
	changedValue = 0;
	dynamicExtraModules = [FormsModule];
}
```
```html
<template dynamic-template
          [componentContext]="self"
          [componentModules]="dynamicExtraModules"
          [componentTemplate]='"<span [innerHTML]=\"changedValue\"></span><input type=\"text\" [(ngModel)]=\"dynamicContextValue\" (ngModelChange)=\"changedValue = $event\">"'></template>
```

##### **7** Support of **componentModules** attribute.

```typescript
@Component(...)
export class AppComponent {
	dynamicExtraModules = [FormsModule];
}
```
```html
<template dynamic-template
          [componentModules]="dynamicExtraModules"
          [componentContext]="{dynamicContextValue: 100500, changedValue: 0}"
          [componentTemplate]='"<span [innerHTML]=\"changedValue\"></span><input type=\"text\" [(ngModel)]=\"dynamicContextValue\" (ngModelChange)=\"changedValue = $event\">"'></template>
```

##### **8** Support of **componentTemplatePath** attribute. This analogue of **templateUrl** parameter for **@Component**.

## License

Licensed under MIT.