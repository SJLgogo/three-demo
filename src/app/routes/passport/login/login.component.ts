import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {StartupService} from '@core';
import {ReuseTabService} from '@delon/abc/reuse-tab';
import {DA_SERVICE_TOKEN, ITokenService, SocialService} from '@delon/auth';
import {_HttpClient, SettingsService} from '@delon/theme';
import {NzTabChangeEvent} from 'ng-zorro-antd/tabs';
import {finalize} from 'rxjs/operators';
import {variable} from "../../../api/common-interface/common-interface";
import {fn} from "../../../hz/select-person/select-project-person/department/department.interface";
import {environment} from "@env/environment";
import {NzMessageService} from "ng-zorro-antd/message";

declare global {
  interface Window {
    WwLogin: any;
  }
}

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLoginComponent implements OnInit, OnDestroy {
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
  error = '';
  type = 0;
  loading = false;

  // #region get captcha

  count = 0;
  interval$: any;

  // #endregion

  switch({index}: NzTabChangeEvent): void {
    this.type = index!;
    if (this.type === 1) {
      window.WwLogin({
        id: 'wx_reg',
        appid: this.corpId,
        agentid: this.agentId,
        redirect_uri: window.location.href,
        state: `${this.randomState()}`,
      });
    }
  }


  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({onlySelf: true});
      this.mobile.updateValueAndValidity({onlySelf: true});
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

  // #endregion

  submit(): void {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      this.loginWay = 'accountPassword'
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) {
        return;
      }
    }

    if (!this.appId) {
      this.message.error('无效链接')
    }

    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this.loading = true;
    this.cdr.detectChanges();
    this.loginHttp()
  }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }

  async ngOnInit(): Promise<any> {
    this.activeRoute.queryParams.subscribe((params: any) => {
      const code = params.code;
      const appId = params.appId;
      if (code !== undefined && code !== '' && appId !== undefined && appId !== '') {
        this.oauthLogin = false
        console.log(this.oauthLogin);
      }
    });
    await this.judgeScanQrCodeLogin()
    const appId = await this.obtainUrlId()
    await this.obtainCorpId(appId)
  }

  judgeScanQrCodeLogin(): void {
    this.activeRoute.queryParams.subscribe((params: any) => {
      console.log(params);
      const code = params.code;
      const appId = params.appId;
      if (code !== undefined && code !== '' && appId !== undefined && appId !== '') {
        this.scanQrCodeTechnologicalProcess(code, appId)
      }
    });
  }

  obtainUrlId(): Promise<string> {
    return new Promise<string>(((resolve, reject) => {
      if (!location.href.includes('appId=')) {
        this.appId = localStorage.getItem('appId')
      } else {
        this.appId = location.href.split('appId=')[1].split('&')[0]
        localStorage.setItem('appId', this.appId)
      }
      resolve((this.appId as string))
    }))
  }

  obtainCorpId(appId: string): void {
    if (!this.appId) {
      return
    }
    this.http.get('service/portal/appId/' + appId + '?_allow_anonymous=true').subscribe(res => {
      this.corpId = res.data.corpId
      this.agentId = res.data.agentId
    })
  }


  randomState(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }


  async scanQrCodeTechnologicalProcess(authCode: string, appId: string): Promise<void> {
    this.loginWay = 'scanCode'
    await this.loginHttp(authCode, appId)
  }


  loginHttp(authCode?: string, appId?: string): void {
    const post = this.postDataGet(authCode, appId)
    this.http
      .post('/service/portal/login?_allow_anonymous=true', post)
      .pipe(
        finalize(() => {
          this.loading = true;
          this.cdr.detectChanges();
        })
      )
      .subscribe(res => {
        if (res.code !== 200) {
          this.error = res.msg;
          this.cdr.detectChanges();
          return;
        }
        // 清空路由复用信息
        this.reuseTabService.clear();
        // 设置用户Token信息
        // res.user.expired = +new Date() + 1000 * 60 * 5;
        this.tokenService.set(res.data);
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().subscribe(() => {
          let url = this.tokenService.referrer!.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          this.router.navigateByUrl(url);
        });
      });
  }

  postDataGet(authCode?: string, appId?: string): any {
    const post: any = {
      type: this.type,
      account: this.userName.value,
      password: this.password.value,
      appId: this.appId,
      loginWay: this.loginWay
    }
    if (authCode && appId) {
      post.authCode = authCode
      post.appId = appId
      delete post.password
      delete post.account
      delete post.type
    }
    return post
  }


}
