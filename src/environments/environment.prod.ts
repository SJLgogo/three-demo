import { Environment } from '@delon/theme';
import { DelonMockModule } from '@delon/mock';
import * as MOCKDATA from '../../_mock';


/**
 * 大连5号线配置
 */
export const environment = {
  production: true,
  useHash: false,
  api: {
    baseUrl: './api/',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh',
    appId: 0
  },
  SERVER_URL: '',
  RESOURCE_SERVER_URL: '',
  logout_url: 'http://dl5.huiztech.cn/portal/passport/login',
  modules: [DelonMockModule.forRoot({ data: MOCKDATA })]
} as Environment;
