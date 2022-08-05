import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { environment } from '@env/environment';
import { Base } from '../../../common/base';
import { EmergencyDispatchEmergencyLevelEditComponent } from './edit/edit.component';
import { STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-emergency-dispatch-emergency-level',
  templateUrl: './emergency-level.component.html',
})
export class EmergencyDispatchEmergencyLevelComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/dictionary/getByCategory`;
  searchSchema: SFSchema = {
    properties: {
      label: {
        type: 'string',
        title: '名称',
      },
    },
  };

  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '事件等级名称', index: 'label' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'static',
          icon: 'edit',
          click: (record) => {
            if (this.isPermission('emergency-level:button:edit', "")) {
              this.modal.createStatic(EmergencyDispatchEmergencyLevelEditComponent, { i: record }).subscribe(() => this.st.reload());
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
            if (this.isPermission('emergency-level:button:delete', "")) {
              this.remove(item);
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          },
        },
      ],
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
      category: 'emergencyLevel',
    };
  }

  add() {
    this.modal.createStatic(EmergencyDispatchEmergencyLevelEditComponent, { i: { id: '' } }).subscribe(() => this.st.reload());
  }

  remove(record:any) {
    this.http.post(`/service/emergency-base-config/admin/dictionary/delete/` + record.id).subscribe((res) => {
      if (res.success) {
        this.messageService.success(res.message);
        this.st.reload();
      }
    });
  }
}
