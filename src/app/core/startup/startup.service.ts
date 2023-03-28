import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzIconService } from 'ng-zorro-antd/icon';
import {Observable, of, zip} from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { I18NService } from '../i18n/i18n.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }


  load(): Observable<void> {
    //此处写死、读取配置文件
    let appId = environment.api['appId'];
    this.tokenService.options.store_key = appId + `_token`;
    let user: any = this.tokenService.get();
    if (user != null && user.loginUserId && user.loginUserId.length > 0) {
      return this.afterLogin();
    } else {
      return this.beforeLogin();
    }
  }


  /**
   * 登录前调用、用的是默认配置
   * @private
   */
  private beforeLogin(): Observable<any> {
    const defaultLang = this.i18n.defaultLang;
    return zip(this.i18n.loadLangData(defaultLang),
      this.httpClient.get('assets/tmp/app-data.json')
    ).pipe(
      catchError(res => {
        console.warn(`StartupService.load: Network request failed`, res);
        setTimeout(() => this.router.navigateByUrl(`/exception/500`));
        return [];
      }),
      map(([langData]: [Record<string, string>, NzSafeAny]) => {
        // setting language data
        this.i18n.use(defaultLang, langData);
      })
    );
  }


  /**
   * 系统菜单没有导入后台开发的时候打开此段代码、正式部署请用下面的方法
   * @private
   */
  // private afterLogin(): Observable<void> {
  //   const defaultLang = this.i18n.defaultLang;
  //   return zip(this.i18n.loadLangData(defaultLang), this.httpClient.get('assets/tmp/app-data.json')).pipe(
  //     // 接收其他拦截器后产生的异常消息
  //     catchError(res => {
  //       console.warn(`StartupService.load: Network request failed`, res);
  //       setTimeout(() => this.router.navigateByUrl(`/exception/500`));
  //       return [];
  //     }),
  //     map(([langData, appData]: [Record<string, string>, NzSafeAny]) => {
  //       // setting language data
  //       this.i18n.use(defaultLang, langData);
  //
  //       // 应用信息：包括站点名、描述、年份
  //       this.settingService.setApp(appData.app);
  //       // 用户信息：包括姓名、头像、邮箱地址
  //       this.settingService.setUser(appData.user);
  //       // ACL：设置权限为全量
  //       this.aclService.setFull(true);
  //       // 初始化菜单
  //       this.menuService.add(appData.menu);
  //       // 设置页面标题的后缀
  //       this.titleService.default = '';
  //       this.titleService.suffix = appData.app.name;
  //     })
  //   );
  // }

  /**
   * 登录后调用、正式环境用
   * @private
   */
  private afterLogin(): Observable<any> {
    const defaultLang = this.i18n.defaultLang;
    return zip(this.i18n.loadLangData(defaultLang),
      this.httpClient.get('/security/service/security/admin/security-resource/myAlainAppData'),
      this.httpClient.get(`/service/dictionary/dict-data/find-all`)
    ).pipe(
      // 接收其他拦截器后产生的异常消息
      catchError(res => {
        console.warn(`StartupService.load: Network request failed`, res);
        setTimeout(() => this.router.navigateByUrl(`/exception/500`));
        return [];
      }),
      map(([langData, appData, dicData]: [Record<string, string>, NzSafeAny, any]) => {
        // setting language data
        this.i18n.use(defaultLang, langData);
        //后端获取格式不一样
        if (appData.success) {
          appData = appData.data;
          // 应用信息：包括站点名、描述、年份
          this.settingService.setApp(appData.app);
          // 用户信息：包括姓名、头像、邮箱地址
          this.settingService.setUser(appData.user);
          // ACL：设置权限为全量
          this.aclService.setFull(true);
          // 初始化菜单
          this.menuService.add(appData.menu);
          // 设置页面标题的后缀
          this.titleService.default = '';
          this.titleService.suffix = appData.app.name;
        }else {
          //如果后台接口报错暂时不处理、根据统一拦截器处理
        }
      })
    );
  }


}
