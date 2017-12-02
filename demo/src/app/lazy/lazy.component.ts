import { Component } from '@angular/core';

@Component({
  selector: 'app-lazy-component',
  template: '<span style="color: red;">This is a lazy loaded component LazyComponent!</span>'
})
export class LazyComponent {
}
