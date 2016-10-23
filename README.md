# angular2-dynamic-component & angular2-dynamic-directive

An implementation of dynamic component wrapper at Angular2 [2.1.0 & AOT compatible].  

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
import {DynamicComponentModule} from 'angular2-dynamic-component/index';

@NgModule({
    imports: [DynamicComponentModule]
})
```

## Features

##### **1** Support of **dynamicComponentReady** & **dynamicComponentBeforeReady** output events. See below.  

##### **2** Support of **dynamic-component** directive.  

##### **3** Support of **DynamicComponent** component.  

##### **4** Support of **componentTemplateUrl** attribute. This attribute allows getting resource via Angular2 HTTP/Ajax.  

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

##### **5** Support of **componentContext** attribute.  

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

##### **6** Support of dynamic injected modules via the **DynamicComponentModuleFactory**.  

The **CommonModule** module is imported by default.

```typescript
import {DynamicComponentModuleFactory} from "angular2-dynamic-component/index";
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

##### **7** Support of **componentModules** attribute.  

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

## Use case #1

**app.html**
```html
<ButtonsToolbar></ButtonsToolbar><br>
<ButtonsToolbar></ButtonsToolbar>
```

```html
<template ngFor let-button [ngForOf]="buttons">
  <ButtonsToolbarPlaceholder [componentType]="button.type" [buttonName]="button.name">
  </ButtonsToolbarPlaceholder>
</template>
```

```typescript
export interface ButtonType {
    name:string;
    type:{new ():IButton};
}

@Component({
    selector: 'ButtonsToolbar',
    template: require('./ButtonsToolbar.html')
})
export class ButtonsToolbar {

    buttons:Array<ButtonType> = [
        {
            name: 'GreenButtonName',
            type: GreenButton
        },
        {
            name: 'RedButtonName',
            type: RedButton
        }
    ];
}
```

```typescript
import {DynamicComponent, DynamicComponentMetadata} from 'angular2-dynamic-component/index';

class ButtonsToolbarComponent extends DynamicComponentMetadata {

    constructor(public selector:string = 'ButtonsToolbarPlaceholder') {
        super();
    }
}

@Component(new ButtonsToolbarComponent())
export class ButtonsToolbarPlaceholder extends DynamicComponent implements IButton {

    @Input() buttonName:string;
    @Input() componentType:{new ():IButton};

    constructor(...) {
        super(element, viewContainer, compiler, http);
    }
}
```

```typescript
export interface IButton {
    buttonName:string;
}

@Component({
    selector: 'GreenButton',
    template: '<span style="color: green; width: 50px; border: 1px solid black; padding: 6px; margin: 6px;">The first button with name: {{ buttonName }}</span>',
})
export class GreenButton implements IButton {

    @Input() public buttonName:string;
}

@Component({
    selector: 'RedButton',
    template: '<span style="color: red; width: 50px; border: 1px solid black; padding: 6px; margin: 6px;">The second button with name: {{ buttonName }}</span>',
})
export class RedButton implements IButton {
    @Input() public buttonName:string;
}
```

## License

Licensed under MIT.