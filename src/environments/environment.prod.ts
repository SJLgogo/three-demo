import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: false,
  api: {
    baseUrl: './api/',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  }
} as Environment;
