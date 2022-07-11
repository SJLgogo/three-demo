/* eslint-disable */
import { Injectable } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private http: _HttpClient, public settingsService: SettingsService) {}

  /**
   * 加载所有web权限
   */
  // loadPermission() {
  //   this.http.get(`/service/contact/admin/role/findPermissionByRoles/`).subscribe((res) => {
  //     if (res.success) {
  //       let identifiers = [];
  //       res.data.forEach(function (value, index, array) {
  //         identifiers.push(value.identifier);
  //       });
  //       console.log('web权限:', res);
  //       const app: any = {
  //         name: `HuizTech`,
  //         description: ``,
  //         identifiers: identifiers,
  //       };
  //       this.settingsService.setApp(app);
  //     }
  //   });
  // }
}
