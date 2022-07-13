import {inject, Injectable} from "@angular/core";
import {BaseApi, Body, DELETE, GET, Path, POST} from "@delon/theme";
import {Observable} from "rxjs";
import {HttpResult, variable} from "../../common-interface/common-interface";
import {SavePro} from "../../../routes/dict/organization-management/organization.interface";

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends BaseApi {
  @POST('/base/api/agent/company')
  savePro(@Body request: SavePro): Observable<HttpResult> | any {
    return;
  }

  @DELETE('/base/api/agent/company/:id')
  deletePro(@Path('id') id: string): Observable<HttpResult> | any {
    return;
  }

  @POST('/base/api/agent/company')
  saveApp(@Body request: any): Observable<HttpResult> | any {
    return;
  }

  @GET('/base/api/agent/company/find-all')
  allPro(@Path() typeId: string): Observable<HttpResult> | any {
    return;
  }

}
