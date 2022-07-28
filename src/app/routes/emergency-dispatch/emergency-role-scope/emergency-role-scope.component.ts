import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { environment } from '@env/environment';
import { EmergencyDispatchEmergencyRoleScopeEditComponent } from './edit/edit.component';
import { STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import {Base} from "../../../api/common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-role-scope',
  templateUrl: './emergency-role-scope.component.html',
})
export class EmergencyDispatchEmergencyRoleScopeComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/emergencyRoleApi/findForPage`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '岗位名称',
      },
      feedBackName: {
        type: 'string',
        title: '可反馈岗位名称',
      },
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '岗位名称', index: 'name', width: 200 },
    { title: '可反馈岗位范围', index: 'scope', width: 200 },
    { title: '设置人员', index: 'settingUserName', width: 200 },
    { title: '设置时间', index: 'createdDate', width: 200 },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'static',
          icon: 'edit',
          click: (record) => {
            if (this.isPermission('emergency-role-scope:button:edit', this.settingsService.app['identifiers'])) {
              this.modal
                .createStatic(EmergencyDispatchEmergencyRoleScopeEditComponent, { i: record, mode: 'edit' })
                .subscribe(() => this.st.reload());
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          },
        },
        {
          text: '删除',
          icon: 'delete',
          type: 'del',
          click: (item: any) => {
            if (this.isPermission('emergency-scope:button:delete', this.settingsService.app['identifiers'])) {
              this.remove(item);
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          },
        },
      ],
      width: 300,
    },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public settingsService: SettingsService,
    private messageService: NzMessageService,
  ) {
    super();
  }

  ngOnInit() {
    // body请求体加参数
    this.customRequest.body = {
      category: 'emergencyScope',
    };
  }

  add() {
    this.modal
      .createStatic(EmergencyDispatchEmergencyRoleScopeEditComponent, { i: { id: '' }, mode: 'add' })
      .subscribe(() => this.st.reload());
  }

  remove(record:any) {
    this.http
      .get(`/service/emergency-base-config/admin/emergencyRoleApi/deleteById/` + record.id)
      .subscribe((res) => {
        if (res.success) {
          this.messageService.success(res.message);
          this.st.reload();
        }
      });
  }
}
