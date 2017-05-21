import { Component } from '@angular/core';

@Component({
  selector: 'lazy-component',
  template: '<span style="color: red;">This is a lazy loaded component!</span>'
})
export class LazyComponent {
}
