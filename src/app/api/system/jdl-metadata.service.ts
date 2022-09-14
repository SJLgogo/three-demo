import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApi, BaseUrl, Body, GET, Path, POST, PUT } from '@delon/theme';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@BaseUrl('/service/system/jdl-metadata')
export class JdlMetadataService extends BaseApi {
  @GET('/page-all')
  findAll(): Observable<HttpResponse<any>> {
    // @ts-ignore
    return;
  }

  @GET('/test')
  test(): Observable<HttpResponse<any>> {
    // @ts-ignore
    return;
  }

  @POST('')
  save(@Body data: any): Observable<HttpResponse<any>> {
    // @ts-ignore
    return;
  }

  @PUT('')
  update(@Body data: any): Observable<HttpResponse<any>> {
    // @ts-ignore
    return;
  }

  @GET('/:id')
  findById(@Path('id') id: string): Observable<HttpResponse<any>> {
    // @ts-ignore
    return;
  }
}
