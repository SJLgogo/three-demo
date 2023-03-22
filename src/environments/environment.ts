// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { DelonMockModule } from '@delon/mock';
import { Environment } from '@delon/theme';
import * as MOCKDATA from '../../_mock';



// export const environment = {
//   production: false,
//   useHash: false,
//   api: {
//     baseUrl: './api/',
//     refreshTokenEnabled: true,
//     refreshTokenType: 'auth-refresh',
//     version: 'rpc',
//     appId: 2
//   },
//   SERVER_URL: '',
//   RESOURCE_SERVER_URL: '',
//   logout_url: 'http://localhost:4200/passport/login',
//   modules: [DelonMockModule.forRoot({ data: MOCKDATA })]
// } as Environment;

/**
 * 测试环境配置
 */
export const environment = {
  production: true,
  useHash: false,
  api: {
    baseUrl: './api/',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh',
    appId: "0"
  },
  SERVER_URL: '',
  RESOURCE_SERVER_URL: '',
  logout_url: 'http://localhost:4200/passport/login',
  modules: [DelonMockModule.forRoot({ data: MOCKDATA })]
} as Environment;

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
