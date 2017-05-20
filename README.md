# ngx-dynamic-template

An implementation of dynamic template wrapper at Angular2/4 [4.1.3] (AoT compatible).

## Description

Date of creation: 18 Jun 2016 [started with Angular 2.0.0-rc.2].  
The previous version of this module is tandem [angular2-dynamic-component](https://www.npmjs.com/package/angular2-dynamic-component) and [ts-metadata-helper](https://www.npmjs.com/package/ts-metadata-helper).  
In case of dynamic component please use ngComponentOutlet.  

## Installation

```sh
npm install ngx-dynamic-template --save

```typescript
import {DynamicComponentModule} from 'ngx-dynamic-template';

@NgModule({
    imports: [DynamicComponentModule]
})
```

## Demo

[Live demo](https://apoterenko.github.io/ngx-dynamic-component)

**1** git clone --progress -v "git@github.com:apoterenko/ngx-dynamic-component.git" "D:\sources"  
**2** cd C:\sources\ngx-dynamic-component\demo  
**3** npm install  
**4** npm start  

## Features

##### **1** Support of **dynamicComponentReady** & **dynamicComponentBeforeReady** output events. See below.  

##### **2** Support of **dynamic-component** directive. See below.

##### **3** Support of **Dynamic within Dynamic** strategy (see demo inside).

```typescript
@Component(...)
export class AppComponent {
	extraTemplate = `<DynamicComponent [componentTemplate]='"<span>Dynamic inside dynamic!</span>"'></DynamicComponent>`;
	extraModules = [DynamicComponentModule];
	...
}
```
```html
<template dynamic-component
          [componentModules]="extraModules"
          [componentTemplate]='extraTemplate'></template>
``` 

##### **5** Support of **componentTemplateUrl** attribute. This attribute allows getting resource via Angular2 HTTP/Ajax.  

Also, 301, 302, 307, 308 HTTP statuses are supported (recursive redirection). The **componentRemoteTemplateFactory** (IComponentRemoteTemplateFactory)
 attribute allows prepare http response before rendering.  

```typescript
@Component(...)
export class AppComponent {
	dynamicCallback(scope) {
		console.log('Hi there! Context value is:', scope.contextValue); // Hi there! Context value is: 100500
	}
}
```
```html
<template dynamic-component
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
<template dynamic-component
          [componentContext]="self"
          [componentModules]="dynamicExtraModules"
          [componentTemplate]='"<span [innerHTML]=\"changedValue\"></span><input type=\"text\" [(ngModel)]=\"dynamicContextValue\" (ngModelChange)=\"changedValue = $event\">"'></template>
```

##### **7** Support of dynamic injected modules via the **DynamicComponentModuleFactory**.  

The **CommonModule** module is imported by default.

```typescript
import {DynamicComponentModuleFactory} from "ngx-dynamic-component/index";
@NgModule({
	imports: [..., 
		DynamicComponentModuleFactory.buildModule([
			FormsModule
		])
	],
	...
	bootstrap: [AppComponent]
})
export class AppModule {}
```
```html
<template dynamic-component
          [componentContext]="{dynamicContextValue: 100500, changedValue: 0}"
          [componentTemplate]='"<span [innerHTML]=\"changedValue\"></span><input type=\"text\" [(ngModel)]=\"dynamicContextValue\" (ngModelChange)=\"changedValue = $event\">"'></template>
```

##### **8** Support of **componentModules** attribute.  

```typescript
@Component(...)
export class AppComponent {
	dynamicExtraModules = [FormsModule];
}
```
```html
<template dynamic-component
          [componentModules]="dynamicExtraModules"
          [componentContext]="{dynamicContextValue: 100500, changedValue: 0}"
          [componentTemplate]='"<span [innerHTML]=\"changedValue\"></span><input type=\"text\" [(ngModel)]=\"dynamicContextValue\" (ngModelChange)=\"changedValue = $event\">"'></template>
```

##### **9** Support of **componentTemplatePath** attribute. This analogue of **templateUrl** parameter for **@Component**.

## License

Licensed under MIT.