/*
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

import { Input, ElementRef, Renderer } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DynamicComponentModuleFactory } from 'angular2-dynamic-component/index';

export const DYNAMIC_MODULE = DynamicComponentModuleFactory.buildModule([
  /* Custom modules here */
]);

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <nav>
      <a [routerLink]=" ['./'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
        Index
      </a>
      <a [routerLink]=" ['./home'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
        Home
      </a>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>
    
     <b>Scenario #1</b><br>  
    <template dynamic-component
              [componentContext]="outerDynamicContext"
              [componentModules]="outerDynamicModules"
              [componentTemplate]="outerDynamicTemplate"></template>
                
    Inner dynamic value [this is a part of app template]: {{ outerDynamicContext.innerDynamicContext.value }}<br><br>   
    
    <b>Scenario #2</b><br>    
    <DynamicComponent [componentTemplate]="extraTemplate2"
                      [componentContext]="context2"></DynamicComponent><br>
    <DynamicComponent [componentTemplate]="extraTemplate2"
                      [componentContext]="context2"></DynamicComponent><br><br>
    
    <b>Scenario #3</b><br> 
    <template dynamic-component
          *ngFor="let field of columns"
          [componentType]="field.type"
          [componentContext]="field.context">
    </template>
    <template dynamic-component
          *ngFor="let field of columns"
          [componentType]="field.type"
          [componentContext]="field.context2">
    </template>
                      
    <br><br><b>Scenario #4</b><br>
    <div *ngFor="let i of longArray">
        <template dynamic-component [componentTemplate]="extraTemplate2"
                                    [componentContext]="context2"></template>
    </div>
    <div *ngFor="let i of longArray">
        <DynamicComponent [componentTemplate]="extraTemplate2"
                          [componentContext]="context2"></DynamicComponent>
    </div>

    <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>

    <footer>
      <span>WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a></span>
      <div>
        <a [href]="url">
          <img [src]="angularclassLogo" width="25%">
        </a>
      </div>
    </footer>
  `
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';

  // Scenario #1
  public outerDynamicTemplate = `
        <DynamicComponent [componentContext]='innerDynamicContext' 
                          [componentModules]='innerDynamicModules'
                          [componentTemplate]='innerDynamicTemplate'>         
        </DynamicComponent>
        <br>
        Inner dynamic value [this is a part of outer dynamic template]: {{ innerDynamicContext.value }}
   `;
  public outerDynamicModules = [DYNAMIC_MODULE];
  public outerDynamicContext = {
    innerDynamicContext: {
      root: this,
      value: 'inner value',
      valueAccessorTemplate: `
                Second input field [dynamic inside dynamic inside dynamic]: <input type=\"text\" [(ngModel)]=\"root.context2.contextValue\">
                <br>
        `,
      valueAccessorModules: [FormsModule, DYNAMIC_MODULE]
    },
    innerDynamicTemplate: `
        First input field [dynamic inside dynamic]: <input type=\"text\" [(ngModel)]=\"value\" (ngModelChange)=\"value = $event\">
        <br>
        <DynamicComponent [componentContext]='{root: root}'
                          [componentModules]='valueAccessorModules'
                          [componentTemplate]='valueAccessorTemplate'>         
        </DynamicComponent>
    `,
    innerDynamicModules: [FormsModule, DYNAMIC_MODULE]
  };

  // Scenario #2
  extraTemplate2 = `<span>{{ contextValue }}</span>`;
  context2 = {contextValue: 'test value is 0'};

  // Scenario #3 {No 9}
  columns = [{
    type: TextField,
    context: {
      fieldName: 'description',
      value: 'Test description'
    },
    context2: {
      fieldName: 'description2',
      value: 'Test2 description'
    }
  }, {
    type: CheckboxField,
    context: {
      fieldName: 'expired',
      value: true
    },
    context2: {
      fieldName: 'expired2',
      value: false
    }
  }, {
    type: RadioField,
    context: {
      fieldName: 'active',
      value: false
    },
    context2: {
      fieldName: 'active2',
      value: true
    }
  }];

  // Scenario #4
  longArray:Array<number> = new Array(500);

  constructor(
    public appState: AppState
  ) {}

  ngOnInit() {
    let initialValue = 0;

    setInterval(() => {
      this.context2 = {
        contextValue: 'test value is ' + ++initialValue
      };
    }, 1000);
  }

}

@Component({
  selector: 'DynamicTextField',       // Can be absent => selector === "TextField"
  template: `<input name="{{fieldName}}" type="text" [value]="value">`,
})
export class TextField {
  @Input() fieldName: string;
  @Input() value: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {
    console.log('The constructor of TextField is called');  // The constructor of TextField is called
  }

  ngOnInit() {
    setTimeout(() => this.value = this.fieldName + ': next value', 4000);
    this.elementRef.nativeElement.childNodes[0].style.color = 'red';
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
    setTimeout(() => this.value = !this.value, 2000);
  }
}

@Component({
  template: `<input name="{{fieldName}}" type="radio" [checked]="value">`,
})
export class RadioField {
  @Input() fieldName: string;
  @Input() value: boolean;

  constructor() {
    console.log('The constructor of RadioField is called');  // The constructor of RadioField is called
  }

  ngOnInit() {
    setTimeout(() => this.value = !this.value, 3000);
  }
}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
