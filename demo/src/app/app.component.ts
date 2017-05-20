import { Component, Input, ElementRef, Renderer, Inject } from '@angular/core';
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
        <DynamicComponent [componentContext]='innerDynamicContext' 
                          [componentModules]='innerDynamicModules'
                          [componentTemplate]='innerDynamicTemplate'>         
        </DynamicComponent>
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
        <DynamicComponent [componentContext]='{root: root}'
                          [componentModules]='valueAccessorModules'
                          [componentTemplate]='valueAccessorTemplate'>         
        </DynamicComponent>
    `,
    innerDynamicModules: [FormsModule, this.dynamicModule]
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
  longArray: Array<number> = new Array(500);

  // Scenario #5
  componentModules2 = [this.dynamicModule];
  columns2 = [{
    type: Child1Component,
    context: {
      fieldName: 'description',
      value: 'Test description'
    }
  },
    {
      type: Child2Component,
      context: {
        fieldName: 'expired',
        value: true
      }
    }
  ];

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

@Component({
  selector: 'DynamicTextField',       // Can be absent => selector === "TextField"
  template: `<input name="{{fieldName}}" type="text" [value]="value">`,
})
export class TextField {
  @Input() fieldName: string;
  @Input() value: string;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer) {
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

@Component({
  template: `
    <template dynamic-component
              *ngFor="let field of childList"
              [componentType]="field.type"
              [componentContext]="field.context">
    </template>`
})
export class Child1Component {
  @Input() fieldName: string;
  @Input() value: boolean;

  childList = [
    {
      type: Child2Component,
      context: {
        fieldName: 'expired',
        value: true
      }
    }
  ]
}

@Component({
  template: `<div>Child2Component template!</div>`
})
export class Child2Component {
  @Input() fieldName: string;
  @Input() value: boolean;

  childList = [
    {
      type: Child2Component,
      context: {
        fieldName: 'expired',
        value: true
      }
    }
  ]
}
