import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Base } from '../../../api/common/base';
import { FixPhoneInfoManagementEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-fix-phone-info-management',
  templateUrl: './fix-phone-info-management.component.html'
})
export class FixPhoneInfoManagementComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/adminTelephoneApi/findForPage`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '固话信息名称'
      }
    }
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '固话名称', index: 'name' },
    { title: '固话号码', index: 'telephoneNum' },
    { title: '更新人', index: 'employeeName' },
    { title: '更新时间', index: 'lastModifiedDate' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'static',
          icon: 'edit',
          click: record => {
            if (this.isPermission('emergency-level:button:edit', this.settingsService.app['identifiers'])) {
              this.modal.createStatic(FixPhoneInfoManagementEditComponent, { i: record, mode: 'edit' }).subscribe(() => this.st.reload());
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          }
        },
        {
          text: '删除',
          icon: 'delete',
          tooltip: '此处删除的是基础数据,会影响已经用此数据的其他关联数据,请谨慎操作!!!!',
          type: 'del',
          click: (item: any) => {
            if (this.isPermission('emergency-level:button:delete', this.settingsService.app['identifiers'])) {
              this.remove(item);
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          }
        }
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public settingsService: SettingsService,
    private messageService: NzMessageService
  ) {
    super();
  }

  ngOnInit() {}

  add() {
    this.modal.createStatic(FixPhoneInfoManagementEditComponent, { i: { id: '' }, mode: 'add' }).subscribe(() => this.st.reload());
  }

  remove(record: any) {
    this.http.get(`/service/emergency-base-config/admin/adminTelephoneApi/deleteById/${record.id}`).subscribe(res => {
      if (res.success) {
        this.messageService.success(res.message);
        this.st.reload();
      }
    });
  }
}
