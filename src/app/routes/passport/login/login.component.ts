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

  agentId: variable<string>;
  corpId: variable<string>;
  urlId: variable<string>;

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
    console.log(this.type);
    if (this.type === 1) {
      this.activeRoute.queryParams.subscribe((params: any) => {
        console.log(params);
        const code = params.code;
        const state = params.state;
        const appid = params.appid;
        if (code !== undefined && code !== '' && state !== undefined && state !== '' && appid !== undefined && appid !== '') {
          this.http.get(`/auth/wxcp/codeToUser?_allow_anonymous=true`, {code: `${code}`}).subscribe(
            (res) => {
              const data = res.data;
              // 清空路由复用信息
              this.reuseTabService.clear();
              // 设置用户Token信息
              this.tokenService.set({
                token: data.AccessToken,
              });
              this.settingsService.setData('employee', data.employee);

              const employee = data.employee;
              this.settingsService.setUser({avatar: employee.avatar, email: '', name: employee.employeeName});
              // this.huiztechAppAuthServiceService.setLoginData(data);
              // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
              this.startupSrv.load().subscribe(() => {
                let url = this.tokenService.referrer!.url || '/';
                if (url.includes('/passport')) {
                  url = '/';
                }
                this.router.navigateByUrl(url);
              });
            },
            (error) => {
              this.message.error(error);
            },
          );
        } else {
          console.log(this.corpId, this.agentId);
          window.WwLogin({
            id: 'wx_reg',
            appid: this.corpId,
            agentid: this.agentId,
            redirect_uri: window.location.href,
            state: `${this.randomState()}`,
          });
        }
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
    this.http
      .post('/service/portal/login?_allow_anonymous=true', {
        type: this.type,
        account: this.userName.value,
        password: this.password.value,
        appId: this.urlId
      })
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

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }

  async ngOnInit(): Promise<any> {
    await this.obtainUrlId()
    await this.obtainCorpId()
  }

  obtainUrlId(): Promise<string> {
    return new Promise<string>(((resolve, reject) => {
      if (!location.href.includes('id=')) {
        this.urlId = localStorage.getItem('urlId')
      }else {
        this.urlId = location.href.split('id=')[1]
        localStorage.setItem('urlId', this.urlId)
      }
      resolve('')
    }))
  }

  // http://localhost:4200/#/passport/login?id=1547139498926796801

  obtainCorpId(): void {
    if (!this.urlId) {
      return
    }
    this.http.get('service/portal/appId/' + this.urlId + '?_allow_anonymous=true').subscribe(res => {
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

}
