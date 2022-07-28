import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { environment } from '@env/environment';

import { STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadEmergencyPlanFilesComponent } from './upload-files/upload-file.component';
import {Base} from "../../../api/common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-plan-file',
  templateUrl: './emergency-plan-file.component.html',
})
export class EmergencyDispatchEmergencyPlanFileComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/adminEmergencyPlanFileApi/findAll`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称',
      },
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '应急预案名称', index: 'name' },
    {
      title: '操作',
      buttons: [
        {
          text: '删除',
          icon: 'delete',
          tooltip: '此处删除的是基础数据,会影响已经用此数据的其他关联数据,请谨慎操作!!!!',
          type: 'del',
          click: (item: any) => {
            if (this.isPermission('emergency-plan-file:button:delete', this.settingsService.app['identifiers'])) {
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
      category: 'emergencyPlanFile',
    };
  }

  add() {
    this.modal.createStatic(UploadEmergencyPlanFilesComponent, {}).subscribe(() => this.st.reload());
  }

  remove(record:any) {
    this.http
      .post(`/service/emergency-base-config/admin/adminEmergencyPlanFileApi/deleteById/` + record.id)
      .subscribe((res) => {
        if (res.success) {
          this.messageService.success(res.message);
          this.st.reload();
        }
      });
  }
}
