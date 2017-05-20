import { NgxDynamicTemplateDemoPage } from './app.po';

describe('ngx-dynamic-component-demo App', () => {
  let page: NgxDynamicTemplateDemoPage;

  beforeEach(() => {
    page = new NgxDynamicTemplateDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
