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
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-passport-login-dd',
  templateUrl: './login-dd.component.html',
  styleUrls: ['./login-dd.component.less'],
  providers: [SocialService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PassportLoginDdComponent implements OnInit, OnDestroy {
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
  //钉钉内部应用 AppKey
  appKey: variable<string>;
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

  switch({ index }: NzTabChangeEvent): void {
    this.type = index!;
    if (this.type === 1) {
      //旧版本登录
      // const url = encodeURIComponent(window.location.href);
      // const goto = encodeURIComponent(
      //   `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=` +
      //   url
      // );
      // @ts-ignore
      //生成内嵌二维码
      // DDLogin({
      //   id: 'wx_reg',
      //   goto,
      //   style: 'border:none;background-color:#FFFFFF;',
      //   width: '365',
      //   height: '500'
      // });
      // // tslint:disable-next-line:only-arrow-functions
      // const handleMessage = (event: any) => {
      //   const origin = event.origin;
      //   // console.log('origin', event.origin);
      //   console.log('appKey:', this.appKey);
      //   if (origin == 'https://login.dingtalk.com') {
      //     // 判断是否来自ddLogin扫码事件。
      //     const loginTmpCode = event.data;
      //     // 获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了
      //     console.log('loginTmpCode', loginTmpCode);
      //     let href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}&loginTmpCode=${loginTmpCode}`;
      //     window.location.href = href;
      //     // console.log("href:",href)
      //   }
      // };
      // if (typeof window.addEventListener != 'undefined') {
      //   window.addEventListener('message', handleMessage, false);
      // } else {
      //   // @ts-ignore
      //   if (typeof window.attachEvent != 'undefined') {
      //     // @ts-ignore
      //     window.attachEvent('onmessage', handleMessage);
      //   }
      // }

      // STEP3：在需要的时候，调用 window.DTFrameLogin 方法构造登录二维码，并处理登录成功或失败的回调。
      window.DTFrameLogin(
        {
          id: 'wx_reg',
          style: 'border:none;background-color:#FFFFFF;',
          width: '300',
          height: '300'
        },
        {
          redirect_uri: encodeURIComponent('http://localhost:4200/passport/login'),
          client_id: this.appKey,
          scope: 'openid',
          response_type: 'code',
          state: 'dddd',
          prompt: 'consent'
        },
        (loginResult: any) => {
          const { redirectUrl, authCode, state } = loginResult;
          // 这里可以直接进行重定向
          window.location.href = redirectUrl;
          // 也可以在不跳转页面的情况下，使用code进行授权
          console.log(authCode);
        },
        (errorMsg: any) => {
          // 这里一般需要展示登录失败的具体原因
          alert(`Login Error: ${errorMsg}`);
        }
      );
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

  // #endregion

  submit(): void {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      this.loginWay = 'accountPassword';
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

    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this.loading = true;
    this.cdr.detectChanges();
    this.loginHttp();
  }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }

  async ngOnInit(): Promise<any> {
    //此处写死、读取配置文件
    let appId = environment.api['appId'];
    this.activeRoute.queryParams.subscribe((params: any) => {
      const code = params.authCode;
      if (code !== undefined && code !== '') {
        this.oauthLogin = false;
        // console.log(this.oauthLogin);
      }
    });
    await this.obtainCorpId(appId);
    await this.judgeScanQrCodeLogin();

  }

  judgeScanQrCodeLogin(): void {
    this.activeRoute.queryParams.subscribe((params: any) => {
      // console.log(params);
      const code = params.authCode;
      if (code !== undefined && code !== '') {
        this.scanQrCodeTechnologicalProcess(code);
      }
    });
  }


  obtainCorpId(appId: string): void {
    if (!appId) {
      return;
    }
    this.http.get('service/portal/appId/' + appId + '?_allow_anonymous=true').subscribe(res => {
      this.corpId = res.data.corpId;
      this.agentId = res.data.agentId;
      this.appKey = res.data.appKey;
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


  async scanQrCodeTechnologicalProcess(authCode: string): Promise<void> {
    this.loginWay = 'scanCode';
    await this.loginHttp(authCode);
  }


  loginHttp(authCode?: string): void {
    const post = this.postDataGet(authCode);
    console.log('登录传值:', post);
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

  postDataGet(authCode?: string): any {
    //此处写死、读取配置文件
    let appId = environment.api['appId'];
    const post: any = {
      type: this.type,
      account: this.userName.value,
      password: this.password.value,
      appId: appId,
      loginWay: this.loginWay
    };
    if (authCode) {
      post.authCode = authCode;
      post.appId = appId;
      delete post.password;
      delete post.account;
      delete post.type;
    }
    return post;
  }

}
