import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { environment } from '@env/environment';
import { EmergencyDispatchEmergencyScopeEditComponent } from './edit/edit.component';
import { STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import {Base} from "../../../common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-scope',
  templateUrl: './emergency-scope.component.html',
})
export class EmergencyDispatchEmergencyScopeComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/adminVirOrganizationApi/findAll`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '虚拟组织架构名称',
      },
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'static',
          icon: 'edit',
          click: (record) => {
            if (this.isPermission('emergency-scope:button:edit', this.settingsService.app['identifiers'])) {
              this.modal.createStatic(EmergencyDispatchEmergencyScopeEditComponent, { i: record }).subscribe(() => this.st.reload());
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          },
        },
        {
          text: '删除',
          icon: 'delete',
          tooltip: '此处删除的是基础数据,会影响已经用此数据的其他关联数据,请谨慎操作!!!!',
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
    { title: '虚拟组织架构', index: 'name', width: 200 },
    {
      title: '关联范围',
      index: 'relevanceScope',
      width: 700,
      format: function (item, col) {
        let res = '';
        for (let i = 0; i < item.relevanceScopes.length; i++) {
          res = res + '[' + item.relevanceScopes[i].name + ']';
        }
        return res;
      },
    },
    {
      title: '查看范围',
      index: 'checkScope',
      width: 700,
      format: function (item, col) {
        let res = '';
        for (let i = 0; i < item.checkScopes.length; i++) {
          res = res + '[' + item.checkScopes[i].name + ']';
        }
        return res;
      },
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
    this.modal.createStatic(EmergencyDispatchEmergencyScopeEditComponent, { i: { id: '' } }).subscribe(() => this.st.reload());
  }

  remove(record:any) {
    this.http
      .post(`/service/emergency-base-config/admin/adminVirOrganizationApi/delete/` + record.id)
      .subscribe((res) => {
        if (res.success) {
          this.messageService.success(res.message);
          this.st.reload();
        }
      });
  }
}
