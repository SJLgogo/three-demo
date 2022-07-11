/* eslint-disable */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

import { SetupSecurityAppPermissionsEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-setup-app-permissions',
  templateUrl: './app-permissions.component.html',
  styleUrls: ['./permission.component.less']
})
export class SetupAppPermissionsComponent implements OnInit, OnChanges {
  @Input('role') role: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.role.index == 2 && this.selectedApp != null) {
      //刷新权限项目列表
      this.loadRoleAppPermission();
    }
  }

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService) {
  }

  // 应用列表
  selectedApp: any = null;
  appList: any = [];

  loadAppList() {
    this.selectedApp = {};
    this.http.get(`/service/security/admin/application/list`).subscribe((res) => {
      if (res.success) {
        this.appList = res.data;

        if (this.appList.length > 0) {
          // console.log('99999999');
          this.optAppPermission(this.appList[0]);
        }
      }
    });
  }

  ///service/security/admin/authority/role/permission/list/all
  optAppPermission(app: any) {
    console.log('选择应用：：：：：', app);

    this.selectedApp = app;
    this.roleAppPermissions = [];
    this.loadRoleAppPermission();
  }

  // 权限操作
  roleAppPermissions: any = [];

  loadRoleAppPermission(): void {
    let params = {
      roleId: this.role.id,
      applicationId: this.selectedApp.id
    };
    this.http.post(`/service/security/admin/authority/role/permission/list/all`, params).subscribe(res => {
      console.log('权限资源:', res);
      if (res.success) {
        this.roleAppPermissions = res.data;
      }
    });
  }

  changeRolePermission(permission: any) {
    this.roleAppPermissions.map((item: any) => {
      if (item.value == permission.value) {
        item.checked = !permission.checked;
      }
    });
  }

  //应用-角色-操作按钮权限授权
  saveRolePermission(): void {
    let params = {
      roleId: this.role.id,
      appId: this.selectedApp.id,
      permissions: this.roleAppPermissions
    };
    this.http.post(`/service/security/admin/authority/role/updateRolePermissionsByButton`, params).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success(res.message);
        this.loadRoleAppPermission();

        // this.msgSrv.loadPermission();
      }
    });
  }

  //保存角色和用户的关系
  assignPartyEmployeeButton = false;
  // assignPartyEmployeeView(role) {
  //   // this.modal
  //   //   .createStatic(SystemContactRolePartyComponent, {
  //   //     mode:'add',
  //   //     role:role
  //   //   },{size:'md'})
  //   //   .subscribe(() => this.loadRoleList());
  //
  //   if(this.assignPartyEmployeeButton==false){
  //     this.http.get(`${environment.SERVER_URL}/service/contact/admin/role/findByRoleIdAndPartyCategory/${role.id}`).subscribe(res => {
  //       console.log("resRole:",res);
  //       if(res.success){
  //         // this.assignPartyEmployeeButton=true;
  //         this.selectEmployee(role.id,res.data);
  //       }
  //     }, error => {
  //       this.messageService.error('查询失败');
  //     });
  //   }
  // }

  //选人控件
  // selectEmployee(roleId,selectEmployeeInfo:any){
  //   console.log(selectEmployeeInfo);
  //   // let mode = ['employee','organization','post','job','tag'];
  //   let mode = ['employee','organization'];
  //   this.modal
  //     .createStatic(SystemContactUserSelectComponent, { selectedItems: selectEmployeeInfo, mode: mode })
  //     .subscribe((res) => {
  //       let tagEmployees = [];   //选中的用户数据
  //       let tagEmployeeIds = []; //选中的用户id
  //       let organizationIds = []; //选中的部门id
  //
  //       console.log("res：",res);
  //       res.selectedItems.forEach(function(value, index, array) {
  //         if(value.category=="organization"){
  //           organizationIds.push(value.id);
  //         }else if(value.category=="employee"){
  //           tagEmployeeIds.push(value.id);
  //         }
  //       });
  //       console.log('tagEmployees:', tagEmployees);
  //       console.log('tagEmployeeIds:', tagEmployeeIds);
  //       this.saveRoleEmployee(tagEmployeeIds,roleId,organizationIds);
  //     });
  //   // this.assignPartyEmployeeButton=false;
  // }

  //保存角色和人员关系
  // saveRoleEmployee(selectEmployeeIds:any,roleId,organizationIds:any) {
  //   let params = {
  //     'employeeIds': selectEmployeeIds,
  //     'roleId': roleId,
  //     'organizationIds':organizationIds
  //   }
  //   this.http.post(`/service/contact/admin/role/assign/party/batchBindRoleAndEmployee`, params).subscribe(res => {
  //     if ( res.success ) {
  //       // this.assignPartyEmployeeButton=false;
  //       this.messageService.success('保存成功');
  //       // this.modal.close(true);
  //       this.permissionService.loadPermission();
  //     }
  //   });
  // }

  addApp() {
    this.modal.createStatic(SetupSecurityAppPermissionsEditComponent, {
      record: {},
      i: {}
    }, { size: 'md' }).subscribe(res => {
    });
  }

  ngOnInit(): void {
    console.log('app');
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }
}
