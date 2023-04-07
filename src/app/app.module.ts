/* eslint-disable import/order */
/* eslint-disable import/no-duplicates */
// #region Http Interceptors
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { default as ngLang } from '@angular/common/locales/zh';
import { APP_INITIALIZER, LOCALE_ID, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleInterceptor } from '@delon/auth';
import { ALAIN_I18N_TOKEN, DELON_LOCALE, zh_CN as delonLang } from '@delon/theme';
import { NZ_DATE_LOCALE, NZ_I18N, zh_CN as zorroLang } from 'ng-zorro-antd/i18n';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

// #region default language
// 参考：https://ng-alain.com/docs/i18n
// #region Startup Service
import { DefaultInterceptor, I18NService, StartupService } from '@core';
import { zhCN as dateLang } from 'date-fns/locale';
// register angular
import { registerLocaleData } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
// #region JSON Schema form (using @delon/form)
import { JsonSchemaModule } from '@shared';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GlobalConfigModule } from './global-config.module';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import { SharedModule } from './shared/shared.module';
import { STWidgetModule } from './shared/st-widget/st-widget.module';
import { Observable } from 'rxjs';
import { WidgetRegistry } from '@delon/form';
import { SelectEmployeeButtonComponent } from './shared/components/select-employee-button/select-employee-button.component';
import { DelonACLModule } from '@delon/acl';

const LANG = {
  abbr: 'zh',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang
};

registerLocaleData(LANG.ng, LANG.abbr);
const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: LANG.abbr },
  { provide: NZ_I18N, useValue: LANG.zorro },
  { provide: NZ_DATE_LOCALE, useValue: LANG.date },
  { provide: DELON_LOCALE, useValue: LANG.delon }
];
// #endregion

// #region i18n services

const I18NSERVICE_PROVIDES = [{ provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false }];

// #endregion

// #region global third module

const GLOBAL_THIRD_MODULES: Array<Type<any>> = [BidiModule];

// #endregion

const FORM_MODULES = [JsonSchemaModule];
// #endregion

const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true }
];
// #endregion

export function StartupServiceFactory(startupService: StartupService): () => Observable<void> {
  return () => startupService.load();
}

const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  }
];
// #endregion

@NgModule({
  declarations: [AppComponent],
  imports: [
    DelonACLModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GlobalConfigModule.forRoot(),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    STWidgetModule,
    NzNotificationModule,
    ...GLOBAL_THIRD_MODULES,
    ...FORM_MODULES
  ],
  providers: [...LANG_PROVIDES, ...INTERCEPTOR_PROVIDES, ...I18NSERVICE_PROVIDES, ...APPINIT_PROVIDES],
  bootstrap: [AppComponent]
})
export class AppModule {
  //注册选人的button小部件
  constructor(widgetRegistry: WidgetRegistry) {
    widgetRegistry.register(SelectEmployeeButtonComponent.KEY /* 'range-input' */, SelectEmployeeButtonComponent);
  }
}
