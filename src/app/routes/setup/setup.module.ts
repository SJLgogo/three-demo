/* eslint-disable */
import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';

import { SetupIndexComponent } from './index/index.component';
import { SystemContactJobEditComponent } from './organization/job/job-edit.component';
import { SystemContactPostSetupComponent } from './organization/post/post-setup.component';
import { SetupSecurityResourceMenuComponent } from './security/resource-menu/resource-menu.component';
import { SetupResourceMenuEditComponent } from './security/resource-menu/edit/edit.component';
import { SetupSecurityResourcePageElementEditComponent } from './security/resource-page-element-edit/resource-page-element-edit.component';
import { SetupSecurityRolePermissionComponent } from './security/role-permission/role-permission.component';
import { SetupSecurityRoleEditComponent } from './security/role-permission/role-edit/role-edit.component';
import { SetupSecurityResourceMenuCheckComponent } from './security/resource-menu/check/check.component';
import { SetupAppPermissionsComponent } from './security/app-permissions/app-permissions.component';
import { SetupSecurityAppPermissionsEditComponent } from './security/app-permissions/edit/edit.component';
import { SetupSecurityAppPermissionsViewComponent } from './security/app-permissions/view/view.component';
import { SetupUserPermissionComponent } from './security/user-permission/user-permission.component';
import { SetupCheckUserTableComponent } from './security/user-permission/check-user-table/check-user-table.component';
import { SetupContactComponent } from './organization/contact/contact.component';
import { SetupAccountComponent } from './account/account.component';
import { SetupAccountEditComponent } from './account/edit/edit.component';
import { SetupAccountViewComponent } from './account/view/view.component';
import { SetupSynchronizeComponent } from './account/synchronize/synchronize.component';
import { SetupDataPermissionsComponent } from './security/data-permissions/data-permissions.component';
import { SetupSecurityDataPermissionsEditComponent } from './security/data-permissions/edit/edit.component';
import { SetupSecurityDataPermissionsViewComponent } from './security/data-permissions/view/view.component';
import { SystemContactTagEmployeeComponent } from './organization/tag/role-employee/tag-employee.component';
import { SystemRoutingModule } from '../system/system-routing.module';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { SystemContactTagEditComponent } from './organization/tag/tag-edit.component';
import { SystemContactPostEditComponent } from './organization/post/post-edit.component';
import { SystemContactOrgEditComponent } from './organization/org/org-edit.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { SetupRoutingModule } from './setup-routing.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserManagementComponent } from './user-management/user-management.component';
import { SelectPersonModule } from 'src/app/shared/select-person/select-person.module';
import {BatchIncreaseConfigurationComponent} from "./security/user-permission/batch-increase-configuration/batch-increase-configuration.component";

const COMPONENTS: Array<Type<void>> = [
  SetupIndexComponent,
  SetupSecurityResourceMenuComponent,
  SetupSecurityRolePermissionComponent,
  SetupSecurityResourceMenuCheckComponent,
  SetupAppPermissionsComponent,
  SetupUserPermissionComponent,
  SetupCheckUserTableComponent,
  BatchIncreaseConfigurationComponent,
  SetupContactComponent,
  SetupAccountComponent,
  SetupSynchronizeComponent,
  SystemContactPostSetupComponent,
  SetupDataPermissionsComponent,
  SetupSecurityDataPermissionsEditComponent,
  SetupSecurityDataPermissionsViewComponent,
  SystemContactJobEditComponent,
  SetupResourceMenuEditComponent,
  SetupSecurityResourcePageElementEditComponent,
  SetupSecurityRoleEditComponent,
  SetupSecurityAppPermissionsEditComponent,
  SetupSecurityAppPermissionsViewComponent,
  SetupAccountEditComponent,
  SetupAccountViewComponent,
  SystemContactTagEmployeeComponent,
  SystemContactTagEditComponent,
  SystemContactPostEditComponent,
  SystemContactOrgEditComponent,
  UserManagementComponent
];

@NgModule({
  imports: [
    SharedModule,
    NzDropDownModule,
    NzIconModule,
    SystemRoutingModule,
    NgJsonEditorModule,
    NzEmptyModule,
    NzTreeModule,
    NzCollapseModule,
    SetupRoutingModule,
    SelectPersonModule
  ],
  declarations: COMPONENTS,
  providers: []
})
export class SetupModule {}
