/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import {FormsModule} from '@angular/forms';

import {DynamicComponentModule} from 'angular2-dynamic-component/index';

import { AppState } from './app.service';

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
      <span>
        <a [routerLink]=" ['./'] ">
          Index
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./home'] ">
          Home
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./detail'] ">
          Detail
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./about'] ">
          About
        </a>
      </span>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>

    <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>
    
    <template dynamic-component
              [componentContext]="outerDynamicContext"
              [componentModules]="outerDynamicModules"
              [componentTemplate]="outerDynamicTemplate"></template><br>
              
    Inner dynamic value (root level): {{ outerDynamicContext.innerDynamicContext.innerContextValue }}<br>
              
    <DynamicComponent [componentTemplate]="extraTemplate2"
                      [componentContext]="context2"></DynamicComponent>

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
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  outerDynamicModules = [DynamicComponentModule];
  outerDynamicContext = {
    innerDynamicContext: {
      innerContextValue: 'inner value'
    },
    innerDynamicTemplate: `<input type=\"text\" [(ngModel)]=\"innerContextValue\" (ngModelChange)=\"innerContextValue = $event\">`,
    innerDynamicModules: [
      FormsModule
    ]
  };
  outerDynamicTemplate = `
        <DynamicComponent [componentContext]='innerDynamicContext' 
                          [componentModules]='innerDynamicModules'
                          [componentTemplate]='innerDynamicTemplate'>         
        </DynamicComponent><br>
        Inner dynamic value (second level): {{ innerDynamicContext.innerContextValue }}
   `;

  extraTemplate2 = `<span>{{ user }}</span>`;
  context2 = {user: 'test user name'};
  
  constructor(
    public appState: AppState) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
