import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService, SocialService } from '@delon/auth';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { StartupService } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { variable } from '../../../api/common-interface/common-interface';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { environment } from '@env/environment';

@Component({
  selector: 'passport-login',
  templateUrl: './login-dl.component.html',
  styleUrls: ['./login-dl.component.less'],
  providers: [SocialService],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PassportLoginDlComponent implements OnInit,OnDestroy {
  constructor(
    fb: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    private activeRoute: ActivatedRoute,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true]
    });
  }

  oauthLogin: boolean = true;
  agentId: variable<string>;
  corpId: variable<string>;
  appId: variable<string>;
  accountId: variable<string>;
  loginWay: variable<string>;

  get userName(): AbstractControl {
    return this.form.get('userName')!;
  }

  get password(): AbstractControl {
    return this.form.get('password')!;
  }

  get mobile(): AbstractControl {
    return this.form.get('mobile')!;
  }

  get captcha(): AbstractControl {
    return this.form.get('captcha')!;
  }

  form: FormGroup;
  type = 0;
  loading = false;

  // #region get captcha
  count = 0;
  interval$: any;
  // #endregion

  switch({ index }: NzTabChangeEvent): void {
    this.type = index!;
    if (this.type === 1) {
      window.WwLogin({
        id: 'wx_reg',
        appid: this.corpId,
        agentid: this.agentId,
        redirect_uri: window.location.href,
        state: `${this.randomState()}`
      });
    }
  }

  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }

  async ngOnInit(): Promise<any> {
    //此处写死、读取配置文件
    let appId = environment.api['appId'];
    this.appId = appId;
    this.activeRoute.queryParams.subscribe((params: any) => {
      const code = params.code;
      const appId = params.appId;
      const accountId = params.accountId;
      if (code !== undefined && code !== '' && appId !== undefined && appId !== '') {
        this.oauthLogin = false;
      }
      if (accountId !== undefined && accountId !== '') {
        this.accountId = accountId;
      }

    });

    appId == '0' ? this.clearCookie() : '';
    //获取软件系统信息
    await this.obtainCorpId(appId);


    this.loading = true;
    this.loginHttp();
  }

  clearCookie(): void {
    var temp = document.cookie.split(';');
    temp.forEach((i: any) => this.deleteCookie(i.split('=')[0]));
  }

  deleteCookie(name: string): void {
    document.cookie = name + '=0;expires=' + new Date(0).toUTCString();
  }


  obtainCorpId(appId: string): void {
    if (!this.appId) {
      return;
    }
    this.http.get('service/portal/appId/' + appId + '?_allow_anonymous=true').subscribe(res => {
      this.corpId = res.data.corpId;
      this.agentId = res.data.agentId;
    });
  }

  randomState(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  loginHttp(): void {
    let post = this.postDataGet();
    this.http.post('/service/portal/login?_allow_anonymous=true', post).subscribe(res => {
      if (res.success) {
        // 清空路由复用信息
        this.reuseTabService.clear();
        // 设置用户Token信息
        // res.user.expired = +new Date() + 1000 * 60 * 5;
        this.tokenService.options.store_key = `${this.appId}_token`;
        this.tokenService.set(res.data);
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().subscribe(() => {
          let url = this.tokenService.referrer!.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          this.router.navigateByUrl(url);
        });
      }
    });
  }

  postDataGet(): any {
    //打开注释可以本地测试
    // this.accountId="1539562808276983810";

    const post: any = {
      account: this.accountId,
      appId: this.appId,
      loginWay: 'accountId'
    };
    return post;
  }
}
