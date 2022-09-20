import { Injectable } from '@angular/core';
import { BaseApi, BaseUrl, Body, DELETE, GET, Path, POST } from '@delon/theme';
import { Observable } from 'rxjs';
import { HttpResult } from '../common-interface/common-interface';

@Injectable({
  providedIn: 'root'
})
@BaseUrl(`/service/dictionary/api/admin/system-config`)
export class SystemConfigService extends BaseApi {
  @POST('/page')
  pageAllConfig(@Body data: any = { pageNo: 0, pageSize: 20 }): Observable<HttpResult> {
    // @ts-ignore
    return;
  }

  @GET('/:id')
  getSystemConfigById(@Path('id') id: string): Observable<HttpResult> {
    // @ts-ignore
    return;
  }

  @GET('/value/:value')
  getSystemConfigByValue(@Path('value') value: string): Observable<HttpResult> {
    // @ts-ignore
    return;
  }

  @POST()
  saveSystemConfig(@Body request: any): Observable<HttpResult> {
    // @ts-ignore
    return;
  }

  @DELETE(':id')
  deleteSystemConfig(@Path('id') id: string): Observable<HttpResult> {
    // @ts-ignore
    return;
  }
}
