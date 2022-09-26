import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, SocialService } from '@delon/auth';
import { _HttpClient, SettingsService } from '@delon/theme';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { finalize } from 'rxjs/operators';
import { variable } from '../../../api/common-interface/common-interface';
import { NzMessageService } from 'ng-zorro-antd/message';

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
    this.activeRoute.queryParams.subscribe((params: any) => {
      const code = params.code;
      const appId = params.appId;
      if (code !== undefined && code !== '' && appId !== undefined && appId !== '') {
        this.oauthLogin = false;
      }
    });
    const appId = await this.obtainUrlId();
    //获取软件系统信息
    await this.obtainCorpId(appId);

    //自动登录
    if (!this.appId) {
      this.message.error('无效链接');
    }
    this.loading = true;
    this.loginHttp();
  }


  obtainUrlId(): Promise<string> {
    return new Promise<string>(((resolve, reject) => {
      if (!location.href.includes('appId=')) {
        this.appId = localStorage.getItem('appId');
      } else {
        this.appId = location.href.split('appId=')[1].split('&')[0];
        localStorage.setItem('appId', this.appId);
      }
      resolve((this.appId as string));
    }));
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

    this.http.post('/service/portal/login?_allow_anonymous=true', post).subscribe((res) => {
      if (res.success) {
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
      }
    });
  }
  postDataGet(): any {
    // localStorage.setItem("production_FawkesMain_user",'{"id":"1280788072831709185","createBy":null,"createDate":null,"updateBy":"fawkes","updateDate":"2022-09-22 14:53:00","deleteFlag":0,"userName":"admin","userNo":"","password":null,"userFullname":"系统管理员","sex":"","phone":"18340018907","email":"admin@ecidi.com","userType":2,"tenantId":100000,"accountStatus":1,"accountPeriod":1,"lastActiveTime":"2022-09-22 14:52:59","formerName":null,"citizenship":null,"age":null,"birthDay":null,"politics":null,"idcardType":null,"idcardNumber":null,"education":null,"degree":null,"majorName":null,"stature":"0000","weight":null,"nation":null,"nativePlace":null,"nationality":null,"jobNumber":null,"marriageState":null,"emergencyPhone":null,"emergencyName":null,"officeLocation":null,"signToken":null,"photoToken":"7B0EDF63AE26C16F343CF6B746BF7E40","isInitPwd":false,"officePhone":null,"otherPhone":null,"title":null,"workingSeniority":null,"hiredate":null,"remark":null,"lastUpdatePwdTime":"2022-03-04 11:25:35","avatarToken":null,"nickname":null,"introduction":null,"sort":null,"ext1":null,"ext2":null,"ext3":null,"ext4":null,"ext5":null,"postList":[{"id":"1509052210313433089","createBy":"admin","createDate":"2022-04-27 16:31:27","updateBy":"admin","updateDate":"2022-04-27 16:31:27","deleteFlag":0,"postType":null,"postCode":"Maintenance_scheduling","postName":"维修调度","sort":null,"remark":"维修调度","type":null,"portalId":null,"tenantId":100000,"ext1":null,"ext2":null,"ext3":null,"ext4":null,"ext5":null}],"orgList":[],"pwdIsExpired":false}')
    //拿到凤翎门户登录信息
    let fawkesUser: any = localStorage.getItem('production_FawkesMain_user') ? (JSON.parse(<string>localStorage.getItem('production_FawkesMain_user'))) : '';
    if (fawkesUser == '') {
      this.message.error('没有获取到用户信息、登录失败！');
      return;
    }
    let account = fawkesUser.phone;
    const post: any = {
      type: this.type,
      account: account,
      password: '000000',
      appId: this.appId,
      loginWay: 'accountPassword'
    };
    return post;
  }
}
