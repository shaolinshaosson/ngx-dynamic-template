/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import {FormsModule} from '@angular/forms';

import {DynamicComponentModule} from 'angular2-dynamic-component/index';

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
                      [componentContext]="context2"></DynamicComponent>                 
  `
})
export class AppComponent {
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  // Scenario #1
  outerDynamicTemplate = `
        <DynamicComponent [componentContext]='innerDynamicContext' 
                          [componentModules]='innerDynamicModules'
                          [componentTemplate]='innerDynamicTemplate'>         
        </DynamicComponent>
        <br>
        Inner dynamic value [this is a part of outer dynamic template]: {{ innerDynamicContext.value }}
   `;
  outerDynamicModules = [DynamicComponentModule];
  outerDynamicContext = {
    innerDynamicContext: {
      root: this,
      value: 'inner value',
      valueAccessorTemplate: `
                Second input field [dynamic inside dynamic inside dynamic]: <input type=\"text\" [(ngModel)]=\"root.context2.contextValue\">
                <br>
        `,
      valueAccessorModules: [FormsModule, DynamicComponentModule]
    },
    innerDynamicTemplate: `
        First input field [dynamic inside dynamic]: <input type=\"text\" [(ngModel)]=\"value\" (ngModelChange)=\"value = $event\">
        <br>
        <DynamicComponent [componentContext]='{root: root}'
                          [componentModules]='valueAccessorModules'
                          [componentTemplate]='valueAccessorTemplate'>         
        </DynamicComponent>
    `,
    innerDynamicModules: [FormsModule, DynamicComponentModule]
  };

  // Scenario #2
  extraTemplate2 = `<span>{{ contextValue }}</span>`;
  context2 = {contextValue: 'test value is 0'};
  
  constructor() {
  }

  ngOnInit() {
    let initialValue = 0;

    setInterval(() => {
      this.context2.contextValue = 'test value is ' + ++initialValue;
    }, 1000);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
