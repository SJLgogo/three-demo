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
  loadPermission(employeeId:any) {
    this.http.get(`/service/security/admin/actor/user/findPermissionByRoles/${employeeId}`).subscribe((res) => {
      if (res.success) {
        let identifiers:any = [];
        res.data.forEach(function (value:any, index :any, array:any) {
          identifiers.push(value.identifier);
        });
        console.log('web权限:', res);
        const app: any = {
          name: `HuizTech`,
          description: ``,
          identifiers: identifiers,
        };
        this.settingsService.setApp(app);
      }
    });
  }
}
