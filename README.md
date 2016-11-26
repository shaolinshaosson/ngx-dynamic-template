# angular2-dynamic-component & angular2-dynamic-directive

An implementation of dynamic component wrapper at Angular2 [2.2.2].

## Description

Date of creation: 18 Jun [starting with 2.0.0-rc.2].  
Although, there is another solution out of the box and we are waiting for completion of the [**NgComponentOutlet**](https://github.com/angular/angular/issues/9599)  

## Installation

**1** At first, you need to install the [core-js](https://www.npmjs.com/package/core-js) npm module.  
**2** Then you need to install the [ts-metadata-helper](https://www.npmjs.com/package/ts-metadata-helper) dependency package (don't worry, it's very small and simple, I like "reusable" approach)  
```sh
npm install ts-metadata-helper --save
```  
**3** And after that, you have to install the target package  
```sh
npm install angular2-dynamic-component --save
```
**4** Then you must apply the **DynamicComponentModule**  

```typescript
import {DynamicComponentModule} from 'angular2-dynamic-component';

@NgModule({
    imports: [DynamicComponentModule]
})
```

## Demo

**1** git clone --progress -v "git@github.com:apoterenko/angular2-dynamic-component.git" "D:\sources"  
**2** cd D:\sources\angular2-dynamic-component\demo  
**3** npm install  
**4** npm start  

## Features

##### **1** Support of **dynamicComponentReady** & **dynamicComponentBeforeReady** output events. See below.  

##### **2** Support of **dynamic-component** directive. See below.  

##### **3** Support of **DynamicComponent** component. See below.  

##### **4** Support of **Dynamic within Dynamic** strategy.  

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
import {DynamicComponentModuleFactory} from "angular2-dynamic-component";
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

##### **9** Support of **componentType** attribute.  

```html
<template dynamic-component
          *ngFor="let field of columns"
          [componentType]="field.type"
          [componentContext]="field.context">
</template>
```
```typescript
@Component(...)
export class AppComponent {
	columns = [{
		type: TextField,
		context: {
			name: 'description',
			value: 'Test description'
		}
	}, {
		type: CheckboxField,
		context: {
			name: 'expired',
			value: true
		}
	}];
	ngOnInit() {
		setTimeout(() => {
			console.log(JSON.stringify(this.columns));  // [{"context":{"name":"description","value":"Next value"}},{"context":{"name":"expired","value":false}}]
		}, 3000);
	}
```
```typescript
import {
	Component,
	Input,
} from '@angular/core';

@Component({
	selector: 'DynamicTextField',       // Can be absent => selector === "TextField"
	template: `<input name="{{fieldName}}" type="text" [value]="value">`,
})
export class TextField {
	@Input() fieldName: string;
	@Input() value: string;

	constructor() {
		console.log('The constructor of TextField is called');  // The constructor of TextField is called
	}

	ngOnInit() {
		setTimeout(() => this.value = 'Next value', 2000);
	}
}

@Component({
	selector: 'DynamicCheckboxField',       // Can be absent => selector === "CheckboxField"
	template: `<input name="{{fieldName}}" type="checkbox" [checked]="value">`,
})
export class CheckboxField {
	@Input() fieldName: string;
	@Input() value: boolean;

	constructor() {
		console.log('The constructor of CheckboxField is called');  // The constructor of CheckboxField is called
	}

	ngOnInit() {
		setTimeout(() => this.value = !this.value, 1000);
	}
}
```

## License

Licensed under MIT.