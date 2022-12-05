import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutPassportComponent } from '../../layout/passport/passport.component';
import { CallbackComponent } from './callback.component';
import { UserLockComponent } from './lock/lock.component';
import { UserLoginComponent } from './login/login.component';
import { UserRegisterResultComponent } from './register-result/register-result.component';
import { UserRegisterComponent } from './register/register.component';
import { UserLogoutComponent } from './logout/logout.component';
import { PassportLoginSxComponent } from './login-sx/login-sx.component';
import { PassportLoginDlComponent } from './login-dl/login-dl.component';

const routes: Routes = [
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      // {
      //   path: 'login',
      //   component: PassportLoginSxComponent,
      //   data: { title: '绍兴登录', titleI18n: 'app.login.login' }
      // },
      // {
      //   path: 'login',
      //   component: PassportLoginDlComponent,
      //   data: { title: '大连登录', titleI18n: 'app.login.login' }
      // },
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '测试账号密码登录', titleI18n: 'app.login.login' }
      },
      {
        path: 'register',
        component: UserRegisterComponent,
        data: { title: '注册', titleI18n: 'app.register.register' }
      },
      {
        path: 'register-result',
        component: UserRegisterResultComponent,
        data: { title: '注册结果', titleI18n: 'app.register.register' }
      },
      {
        path: 'lock',
        component: UserLockComponent,
        data: { title: '锁屏', titleI18n: 'app.lock' }
      },
      { path: 'logout', component: UserLogoutComponent, data: { title: '退出登录' } },

    ]
  },
  // 单页不包裹Layout
  { path: 'passport/callback/:type', component: CallbackComponent }
,
  { path: 'login-sx', component: PassportLoginSxComponent },
  { path: 'login-dl', component: PassportLoginDlComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassportRoutingModule {}
