# ngx-dynamic-template

An implementation of dynamic template wrapper at Angular4 [4.2.0-rc.1 compatible].
In case of dynamic component please use ngComponentOutlet.  

## Description

Date of creation: 18 Jun 2016 [started with Angular 2.0.0-rc.2].  
The previous version of this module is tandem [angular2-dynamic-component](https://www.npmjs.com/package/angular2-dynamic-component) and [ts-metadata-helper](https://www.npmjs.com/package/ts-metadata-helper). The last source code version of the angular2-dynamic-component you can see [here](https://github.com/apoterenko/ngx-dynamic-template/blob/858be91281634bcb06ec82dae40ee1f8eba56563/src/DynamicBase.ts).  

## Installation

```sh
npm install ngx-dynamic-template --save
```

```typescript
import { NgxDynamicTemplateModule } from 'ngx-dynamic-template';

@NgModule({
    imports: [NgxDynamicTemplateModule.forRoot()]
})
```

## Demo

[Live demo](https://apoterenko.github.io/ngx-dynamic-template)  
1. Based on angular-cli  
2. npm run build -- -prod  
3. aot flag is disabled - [aot: false, see angular/cli/models/webpack-config.ts](https://github.com/angular/angular-cli/blob/0d3d9ef21798e77856b06656f11741d07bc062d6/packages/%40angular/cli/models/webpack-config.ts#L89)  

[Local demo](https://github.com/apoterenko/ngx-dynamic-template/tree/master/demo)  
1. Based on angular-cli  
2. npm run build -- -prod  
3. aot flag is disabled - [aot: false, see angular/cli/models/webpack-config.ts](https://github.com/angular/angular-cli/blob/0d3d9ef21798e77856b06656f11741d07bc062d6/packages/%40angular/cli/models/webpack-config.ts#L89)  

[Local demo #2](https://github.com/apoterenko/ngx-dynamic-template/tree/master/demo2)   
1. Based on Angular 2 Webpack Starter  
2. npm run build:prod  

## Features

##### **1** Support of **dynamic-template** directive.

```html
<ng-template dynamic-template
             [template]="'<span style=\'color: orange;\'>This is simple dynamic template</span>'">
</ng-template>
```

##### **2** Support of lazy loaded component modules for the dynamic templates via **lazyModules** input parameter (demo scenario #4).

```html
<ng-template dynamic-template
             [template]="'<lazy-component></lazy-component>'"
             [lazyModules]="['lazy']">
</ng-template>
```

```typescript
export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  ...
  { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule' }
];

...

@NgModule({
  imports: [
    ...
    NgxDynamicTemplateModule.forRoot({ routes: ROUTES }),
    RouterModule.forRoot(ROUTES)
  ],
```

##### **3** Support of **httpUrl** attribute. This attribute allows getting resource via Angular2 HTTP/Ajax (demo scenario #3).

Also 301, 302, 307, 308 HTTP statuses are supported (recursive redirection). The **remoteTemplateFactory** is an optional attribute allows parse response and build http request.

```html
<ng-template dynamic-template
             [httpUrl]="'https://httpbin.org/get'"
             [remoteTemplateFactory]="remoteTemplateFactory">
</ng-template>
```

```typescript
import { Response, Headers, RequestOptionsArgs } from '@angular/http';
import { IDynamicRemoteTemplateFactory } from 'ngx-dynamic-template';
...
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
```

##### **4** Support of modules via **extraModules** input parameter.

```html
<ng-template dynamic-template
             [template]="template4"
             [context]="context4"
             [extraModules]="[dynamicModule]"></ng-template>
```

##### **5** Support of caching of compiled modules for the specific dynamic template. Therefore you can render a huge amount of dynamic templates at the same time (demo scenario #5).

## License

Licensed under MIT.