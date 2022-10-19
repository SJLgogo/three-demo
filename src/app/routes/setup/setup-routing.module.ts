// eslint-disable
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SetupSecurityResourceMenuComponent} from './security/resource-menu/resource-menu.component';
import {SetupSecurityRolePermissionComponent} from './security/role-permission/role-permission.component';
import {SetupSecurityResourceMenuCheckComponent} from './security/resource-menu/check/check.component';
import {SetupAppPermissionsComponent} from './security/app-permissions/app-permissions.component';
import {SetupUserPermissionComponent} from './security/user-permission/user-permission.component';
import {SetupCheckUserTableComponent} from './security/user-permission/check-user-table/check-user-table.component';
import {BatchIncreaseConfigurationComponent} from "./security/user-permission/batch-increase-configuration/batch-increase-configuration.component";
import {SetupContactComponent} from './organization/contact/contact.component';
import {SetupAccountComponent} from './account/account.component';
import {SetupSynchronizeComponent} from './account/synchronize/synchronize.component';
import {SetupDataPermissionsComponent} from './security/data-permissions/data-permissions.component';
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {UserManagementComponent} from "./user-management/user-management.component";
import {VolumeIncreaseComponent} from "./security/volume-increase/volume-increase.component";

const routes: Routes = [
  {path: '', redirectTo: 'security/contact', pathMatch: 'full'},
  {path: 'check', component: SetupSecurityResourceMenuCheckComponent},
  {path: 'app-permissions', component: SetupAppPermissionsComponent},
  {path: 'user-permission', component: SetupUserPermissionComponent},
  {path: 'check-user-table', component: SetupCheckUserTableComponent},
  {path: 'batch-increase-configuration', component: BatchIncreaseConfigurationComponent},
  {path: 'volume-increase', component: VolumeIncreaseComponent},
  {path: 'data-permissions', component: SetupDataPermissionsComponent},
  {
    path: 'security/resource-menu',
    component: SetupSecurityResourceMenuComponent,
    data: {title: '菜单', titleI18n: '菜单'}
  },
  {
    path: 'security/role-permission',
    component: SetupSecurityRolePermissionComponent,
    data: {title: '角色权限', titleI18n: '角色权限'}
  },
  {path: 'security/contact', component: SetupContactComponent, data: {title: '组织机构', titleI18n: '组织机构'}},
  {path: 'security/account', component: SetupAccountComponent, data: {title: '账号管理', titleI18n: '账号管理'}},
  {path: 'synchronize', component: SetupSynchronizeComponent, data: {title: '第三方账户同步', titleI18n: '第三方账户同步'}},
  {path: 'user', component: UserManagementComponent, data: {title: '用户管理', titleI18n: '用户管理'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule {
}
