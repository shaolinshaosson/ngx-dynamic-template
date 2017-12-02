import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IDynamicRemoteTemplateFactory } from 'ngx-dynamic-template';

@Component({
  selector: 'dynamic-holder',
  templateUrl: './dynamic-holder.component.html',
})
export class DynamicHolderComponent implements OnInit {

  private dynamicHolderExtraModules = [FormsModule];

  constructor() {
  }

  // *******************************************
  //
  //               Scenario #3
  //
  // *******************************************
  remoteTemplateFactory: IDynamicRemoteTemplateFactory = {
    // This is an optional method
    buildRequestOptions (): any {
      const headers = new Headers();
      headers.append('Token', '100500');

      return {
        withCredentials: true,
        headers: headers
      };
    },
    // This is an optional method
    parseResponse (response: {headers: {[index: string]: any}}): string {
      return response.headers['User-Agent'];
    }
  } as { [index: string]: any; };

  // *******************************************
  //
  //               Scenario #4
  //
  // *******************************************
  public template4 = `
        <div style="background-color: #b8c6cd; font-weight: bold;">
            This ia a dynamic template inside dynamic template!<br>
            <ng-template dynamic-template
                        [template]='internalTemplate4_1'
                        [context]='internalContext4_1' 
                        [extraModules]='internalExtraModules4_1'
                        [lazyModules]="['lazy2']">         
             </ng-template>
             Scope value: {{ internalContext4_1.value4_1 }}
        </div>
`;

  public context4 = {
    internalTemplate4_1: `
        <div style="background-color: #90cdbb; font-weight: bold;">
          <lazy2-component></lazy2-component>
          <div style="color: #ff49ca">
              First input field [dynamic inside dynamic, level 2]: <input type=\"text\" [(ngModel)]=\"value4_1\" (ngModelChange)=\"value4_1 = $event\">
          </div>
          <ng-template dynamic-template
                       [context]='dynamicHolder'
                       [extraModules]='internalExtraModules4_1_1'
                       [template]='internalTemplate4_1_1'>         
          </ng-template>
        </div>  
    `,
    internalContext4_1: {
      dynamicHolder: this,
      value4_1: '',
      internalTemplate4_1_1: `
         <div style="background-color: #cd9306; font-weight: bold;">
            Second input field [dynamic inside dynamic, level 3]: 
            <input type=\"text\" [(ngModel)]=\"dynamicHolderTestObject.dynamicHolderTestObjectValue\">
         </div>
      `,
      internalExtraModules4_1_1: this.dynamicHolderExtraModules
    },
    internalExtraModules4_1: this.dynamicHolderExtraModules
  };

  dynamicHolderTestObject = { dynamicHolderTestObjectValue: '' };

  // *******************************************
  //
  //               Scenario #5
  //
  // *******************************************
  longArray = new Array(500);
  template5 = `{{ dynamicHolderTestObject.dynamicHolderTestObjectValue }}`;
  context5 = this;

  ngOnInit() {
    let dynamicHolderTestObjectValue = 0;

    setInterval(() => {
      this.dynamicHolderTestObject = {
        dynamicHolderTestObjectValue: String(++dynamicHolderTestObjectValue)
      };
    }, 1000);
  }
}
