import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApi, BaseUrl, Body, GET, POST } from '@delon/theme';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@BaseUrl('/api/route-config')
export class SystemRoutesService extends BaseApi {
  @GET('/find-all')
  findAll(): Observable<HttpResponse<any>> {
    // @ts-ignore
    return;
  }

  @POST('/reload-all')
  reloadAll(): Observable<HttpResponse<any>> {
    // @ts-ignore
    return;
  }

  @POST('/add-route')
  addRoute(@Body data: any): Observable<HttpResponse<any>> {
    // @ts-ignore
    return;
  }

  @POST('/update')
  updateRoute(@Body data: any): Observable<HttpResponse<any>> {
    // @ts-ignore
    return;
  }
}
