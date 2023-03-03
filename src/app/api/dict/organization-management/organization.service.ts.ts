import { Injectable } from '@angular/core';
import { BaseApi, Body, DELETE, GET, Path, POST, PUT } from '@delon/theme';
import { Observable } from 'rxjs';
import { HttpResult } from '../../common-interface/common-interface';
import { SavePro } from '../../../routes/dict/app-management/app.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends BaseApi {
  @POST('/base/api/agent/company')
  savePro(@Body request: SavePro): Observable<HttpResult> | any {
    return;
  }

  @PUT('/base/api/agent/company')
  editPro(@Body request: SavePro): Observable<HttpResult> | any {
    return;
  }


  @DELETE('/base/api/agent/company/:id')
  deletePro(@Path('id') id: string): Observable<HttpResult> | any {
    return;
  }

  @DELETE('/base/api/agent/app/:id')
  deleteApp(@Path('id') id: string): Observable<HttpResult> | any {
    return;
  }



  @POST('/base/api/agent/app')
  saveApp(@Body request: any): Observable<HttpResult> | any {
    return;
  }

  @PUT('/base/api/agent/app')
  editApp(@Body request: any): Observable<HttpResult> | any {
    return;
  }

  @GET('/base/api/agent/company/find-all')
  allPro(): Observable<HttpResult> | any {
    return;
  }

}
