/* eslint-disable import/order */
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { DelonACLModule } from '@delon/acl';
import { AlainThemeModule } from '@delon/theme';
import { ALAIN_CONFIG, AlainConfig } from '@delon/util/config';

import { throwIfAlreadyLoaded } from '@core';

import { environment } from '@env/environment';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';

// Please refer to: https://ng-alain.com/docs/global-config
// #region NG-ALAIN Config

const alainConfig: AlainConfig = {
  st: {
    bordered: true,
    ps: 20,
    modal: { size: 'lg' },
    responsive: false,
    req: {
      method: 'POST',
      reName: {
        pi: 'pageNo',
        ps: 'pageSize'
      },
      allInBody: true
    },
    res: {
      reName: {
        total: 'data.totalElements',
        list: 'data.content'
      }
    },
    page: { zeroIndexed: true, front: false, showSize: true, total: `共 {{total}} 条`, showQuickJumper: true }
  },
  pageHeader: { homeI18n: 'home' },
  lodop: {
    license: `A59B099A586B3851E0F0D7FDBF37B603`,
    licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`
  },
  themeResponsive: {
    rules: {
      1: { xs: 24 },
      2: { xs: 24, sm: 12 },
      3: { xs: 24, sm: 12, md: 8 },
      4: { xs: 24, sm: 12, md: 8, lg: 6 },
      5: { xs: 24, sm: 12, md: 8, lg: 6, xl: 4 },
      6: { xs: 24, sm: 12, md: 8, lg: 6, xl: 4, xxl: 2 }
    }
  },
  auth: { login_url: '/passport/login' }
};

const alainModules: any[] = [AlainThemeModule.forRoot(), DelonACLModule.forRoot()];
const alainProvides = [{ provide: ALAIN_CONFIG, useValue: alainConfig }];

// #region reuse-tab
/**
 * 若需要[路由复用](https://ng-alain.com/components/reuse-tab)需要：
 * 1、在 `shared-delon.module.ts` 导入 `ReuseTabModule` 模块
 * 2、注册 `RouteReuseStrategy`
 * 3、在 `src/app/layout/default/default.component.html` 修改：
 *  ```html
 *  <section class="alain-default__content">
 *    <reuse-tab #reuseTab></reuse-tab>
 *    <router-outlet (activate)="reuseTab.activate($event)"></router-outlet>
 *  </section>
 *  ```
 */
// import { RouteReuseStrategy } from '@angular/router';
// import { ReuseTabService, ReuseTabStrategy } from '@delon/abc/reuse-tab';
// alainProvides.push({
//   provide: RouteReuseStrategy,
//   useClass: ReuseTabStrategy,
//   deps: [ReuseTabService],
// } as any);

// #endregion

// #endregion

// Please refer to: https://ng.ant.design/docs/global-config/en#how-to-use
// #region NG-ZORRO Config

const ngZorroConfig: NzConfig = {};

const zorroProvides = [{ provide: NZ_CONFIG, useValue: ngZorroConfig }];

// #endregion

@NgModule({
  imports: [...alainModules, ...(environment.modules || [])]
})
export class GlobalConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: GlobalConfigModule) {
    throwIfAlreadyLoaded(parentModule, 'GlobalConfigModule');
  }

  static forRoot(): ModuleWithProviders<GlobalConfigModule> {
    return {
      ngModule: GlobalConfigModule,
      providers: [...alainProvides, ...zorroProvides]
    };
  }
}
