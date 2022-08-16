import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { environment } from '@env/environment';
import { EmergencyDispatchEmergencyCategoryEditComponent } from './edit/edit.component';
import { STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import {Base} from "../../../common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-category',
  templateUrl: './emergency-category.component.html',
})
export class EmergencyDispatchEmergencyCategoryComponent extends Base implements OnInit {
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
    { title: '类型名称', index: 'label' },
    { title: '所属大类', index: 'parentLabel' },
    // { title: '备注',index: 'remark' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'static',
          icon: 'edit',
          // modal: { component: EmergencyDispatchEmergencyCategoryEditComponent },
          click: (record) => {
            if (this.isPermission('emergency-category:button:edit', this.settingsService.app['identifiers'])) {
              this.modal
                .createStatic(EmergencyDispatchEmergencyCategoryEditComponent, { record: record, mode: 'edit' })
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
          tooltip: '此处删除的是基础数据,会影响已经用此数据的其他关联数据,请谨慎操作!!!!',
          click: (item: any) => {
            if (this.isPermission('emergency-category:button:delete', this.settingsService.app['identifiers'])) {
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
      category: 'emergencyCategory',
    };
  }

  add() {
    this.modal
      .createStatic(EmergencyDispatchEmergencyCategoryEditComponent, { i: { id: '' }, mode: 'add' })
      .subscribe(() => this.st.reload());
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