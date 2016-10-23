# angular2-dynamic-component & angular2-dynamic-directive

An implementation of dynamic component wrapper at Angular2 (2.1.0 & AOT compatible).

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

**1** Support of **dynamicComponentReady** & **dynamicComponentBeforeReady** output events.  
**2** Support of **dynamic-component** directive.  
**3** Support of **DynamicComponent** component.  
**4** Support of **componentTemplateUrl** attribute. This attribute allows getting resource via Angular2 HTTP/Ajax. 
Also, 301, 302, 307, 308 HTTP statuses are supported (recursive redirection).  
**5** Support of **componentContext** attribute. This attribute can refer to owner component (via self = this) or any other object.  
**6** Support of dynamic injected modules via the **DynamicComponentModuleFactory**.  

## Use case #1
The module provides "dynamic-component" directive:  

```html
<template dynamic-component [componentTemplate]="dynamicTemplate"></template>
```

## Use case #2

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

![Preview](preview.png)

## Use case #2. Using the "componentTemplate" attribute
**app.ts**
```typescript
class DynamicContext {
  value:string;

  onChange() {
    console.log(this.value)
  }
}

@Component(...)
class App {
    private componentTemplate:string = '<input type="text" [(ngModel)]="value" (ngModelChange)="onChange($event)"/>';
    private extraModules = [FormsModule];
    private context = new DynamicContext();
}
```

**app.html**
```html
<DynamicComponent [componentTemplate]="componentTemplate" 
                  [componentContext]="context"
                  [componentModules]="extraModules">
</DynamicComponent>
```

## Use case #3. Using the "componentTemplateUrl" attribute

The main feature is the support of [http 301](https://en.wikipedia.org/wiki/HTTP_301) and [http 302](https://en.wikipedia.org/wiki/HTTP_302) statuses.

**app.html**
```html
<DynamicComponent [componentTemplateUrl]="'http://www.yandex.ru'">
</DynamicComponent>
```

## Use case #4. Using the "componentModules" and "componentContext" attribute

**app.ts**
```typescript
@Component({
	...
	template: `
    <DynamicComponent [componentModules]="extraModules"
                      [componentContext]="dynamicContext"
                      [componentTemplate]="template"></DynamicComponent>
  `
})
export class App {

	template: string = 'Empty current date';
	extraModules:Array<any> = [InnerModule];
	dynamicContext = {currentDate: new Date()};

	ngOnInit() {
		setTimeout(() => {
			this.template = 'Current date is: {{ currentDate | date }}<br>Custom pipe value is: {{ "input value" | myPipe }}';
		}, 1000);
	}
}
```

**InnerModule.ts**
```typescript
import {NgModule, Pipe} from '@angular/core';

@Pipe({
	name: 'myPipe',
})
class MyPipe {
	transform(value: any): string {
		return 'transformed value';
	}
}

@NgModule({
	declarations: [MyPipe],
	exports: [
		MyPipe
	]
})
export class InnerModule {
}
```

## Publish

```sh
npm run deploy
```

## License

Licensed under MIT.