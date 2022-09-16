import { Injectable } from '@angular/core';
import { BaseApi, BaseUrl, Body, POST } from '@delon/theme';
import { Observable } from 'rxjs';
import { HttpResult } from '../common-interface/common-interface';

@Injectable({
  providedIn: 'root'
})
@BaseUrl('/service/system/system-online-user')
export class SystemOnlineUserService extends BaseApi {
  @POST('/reload')
  reload(@Body data: any): Observable<HttpResult> {
    // @ts-ignore
    return;
  }
}
