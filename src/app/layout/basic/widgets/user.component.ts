import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient, SettingsService, User } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from '@delon/util';

@Component({
  selector: 'header-user',
  template: `
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
      <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{ user['loginUserName'] }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
<!--        <div nz-menu-item routerLink="/pro/account/center">-->
<!--          <i nz-icon nzType="user" class="mr-sm"></i>-->
<!--          {{ 'menu.account.center' | i18n }}-->
<!--        </div>-->
<!--        <div nz-menu-item routerLink="/pro/account/settings">-->
<!--          <i nz-icon nzType="setting" class="mr-sm"></i>-->
<!--          {{ 'menu.account.settings' | i18n }}-->
<!--        </div>-->
<!--        <div nz-menu-item routerLink="/exception/trigger">-->
<!--          <i nz-icon nzType="close-circle" class="mr-sm"></i>-->
<!--          {{ 'menu.account.trigger' | i18n }}-->
<!--        </div>-->
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'menu.account.logout' | i18n }}
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent {
  get user(): User {
    return this.settings.user;
  }

  constructor(
    private settings: SettingsService,
    private cookieSrv: CookieService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private http: _HttpClient,
    private msgSrv: NzMessageService
  ) {}

  logout(): void {
    //清除服务器的cookies
    this.http.post('/service/portal/logout', {}).subscribe(res => {
      if (res.success) {
        this.msgSrv.success('清除后台cookies成功!');
        this.tokenService.clear();
        this.cookieSrv.removeAll()
        localStorage.clear();
        // window.location.href = environment['logout_url'];
        //路由跳转到登录页面
        this.router.navigateByUrl('/passport/login');
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }
}
