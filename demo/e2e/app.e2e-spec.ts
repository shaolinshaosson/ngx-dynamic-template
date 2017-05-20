import { NgxDynamicComponentDemoPage } from './app.po';

describe('ngx-dynamic-component-demo App', () => {
  let page: NgxDynamicComponentDemoPage;

  beforeEach(() => {
    page = new NgxDynamicComponentDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
