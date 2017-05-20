import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  // Scenario #1
  public outerDynamicTemplate = `
        <template dynamic-component
                  [componentContext]='innerDynamicContext' 
                  [componentModules]='innerDynamicModules'
                  [componentTemplate]='innerDynamicTemplate'>         
        </template>
        <br>
        Inner dynamic value [this is a part of outer dynamic template]: {{ innerDynamicContext.value }}
   `;
  public outerDynamicModules = [this.dynamicModule];
  public outerDynamicContext = {
    innerDynamicContext: {
      root: this,
      value: 'inner value',
      valueAccessorTemplate: `
                Second input field [dynamic inside dynamic inside dynamic]: <input type=\"text\" [(ngModel)]=\"root.context2.contextValue\">
                <br>
        `,
      valueAccessorModules: [FormsModule, this.dynamicModule]
    },
    innerDynamicTemplate: `
        First input field [dynamic inside dynamic]: <input type=\"text\" [(ngModel)]=\"value\" (ngModelChange)=\"value = $event\">
        <br>
        <template dynamic-component 
                  [componentContext]='{root: root}'
                  [componentModules]='valueAccessorModules'
                  [componentTemplate]='valueAccessorTemplate'>         
        </template>
    `,
    innerDynamicModules: [FormsModule, this.dynamicModule]
  };

  // Scenario #2
  extraTemplate2 = `<span>{{ contextValue }}</span>`;
  context2 = {contextValue: 'test value is 0'};

  // Scenario #3
  longArray: Array<number> = new Array(500);

  constructor(@Inject('DynamicModule') private dynamicModule) {
  }
  
  ngOnInit() {
    let initialValue = 0;

    setInterval(() => {
      this.context2 = {
        contextValue: 'test value is ' + ++initialValue
      };
    }, 1000);
  }
}
