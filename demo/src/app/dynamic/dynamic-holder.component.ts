import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Response, Headers, RequestOptionsArgs } from '@angular/http';
import { IDynamicRemoteTemplateFactory } from 'ngx-dynamic-template';

@Component({
  selector: 'dynamic-holder',
  templateUrl: './dynamic-holder.component.html',
})
export class DynamicHolderComponent implements OnInit {

  private dynamicHolderExtraModules = [FormsModule, this.dynamicModule];

  constructor(@Inject('DynamicModule') public dynamicModule) {
  }

  // *******************************************
  //
  //               Scenario #3
  //
  // *******************************************
  remoteTemplateFactory: IDynamicRemoteTemplateFactory = {
    // This is an optional method
    buildRequestOptions (): RequestOptionsArgs {
      const headers = new Headers();
      headers.append('Token', '100500');

      return {
        withCredentials: true,
        headers: headers
      };
    },
    // This is an optional method
    parseResponse (response: Response): string {
      return response.json().headers['User-Agent'];
    }
  };

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
                        [lazyModules]="internalLazyModules4_1">         
             </ng-template>
             Scope value: {{ internalContext4_1.value4_1 }}
        </div>
  `;

  public context4 = {
    internalTemplate4_1: `
        <div style="background-color: #90cdbb; font-weight: bold;">
          <lazy2-component></lazy2-component>
          <div style="color: #ff49ca">
              First input field [dynamic inside dynamic]: <input type=\"text\" [(ngModel)]=\"value4_1\" (ngModelChange)=\"value4_1 = $event\">
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
            Second input field [dynamic inside dynamic]: 
            <input type=\"text\" [(ngModel)]=\"dynamicHolderTestObject.dynamicHolderTestObjectValue\"><br>
      `,
      internalExtraModules4_1_1: this.dynamicHolderExtraModules
    },
    internalExtraModules4_1: this.dynamicHolderExtraModules,
    internalLazyModules4_1: ['app/lazy2/lazy2.module#Lazy2Module']
  };

  dynamicHolderTestObject = { dynamicHolderTestObjectValue: '' };

  // *******************************************
  //
  //               Scenario #5
  //
  // *******************************************
  longArray: Array<number> = new Array(500);

  ngOnInit() {
    let dynamicHolderTestObjectValue = 0;

    setInterval(() => {
      this.dynamicHolderTestObject = {
        dynamicHolderTestObjectValue: String(++dynamicHolderTestObjectValue)
      };
    }, 1000);
  }
}
