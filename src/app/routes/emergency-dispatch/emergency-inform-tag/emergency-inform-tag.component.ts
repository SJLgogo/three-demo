import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { EmergencyDispatchEmergencyTagInformEditComponent } from './edit/edit.component';
import { environment } from '@env/environment';
import { EmergencyDispatchEmployeeShiftEditComponent } from '../employee-shift/edit/edit.component';
import { EmergencyDispatchEmergencyTagInformRelatedPersonComponent } from './related-person/related-person.component';
import { STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import {Base} from "../../../api/common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-inform-tag',
  templateUrl: './emergency-inform-tag.component.html',
})
export class EmergencyDispatchEmergencyInformTagComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/adminTagGroupApi/findAllPage`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '应急通知标签组名称',
      },
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '应急通知标签组名称', index: 'name', width: '20%' },
    {
      title: '对应应急人员',
      index: 'peoples',
      width: '60%',
      format: function (content) {
        let peoples = [];
        for (let i = 0; i < content.people.length; i++) {
          peoples.push(content.people[i].name);
        }
        return peoples.toString();
      },
    },
    {
      title: '操作',
      buttons: [
        {
          text: '批量关联应急人',
          type: 'static',
          icon: 'edit',
          click: (record) => {
            if (this.isPermission('emergency-tag:button:edit', this.settingsService.app['identifiers'])) {
              this.modal
                .createStatic(EmergencyDispatchEmergencyTagInformRelatedPersonComponent, { record: record, mode: 'edit' })
                .subscribe(() => this.st.reload());
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          },
        },
        {
          text: '编辑',
          type: 'static',
          icon: 'edit',
          click: (record) => {
            if (this.isPermission('emergency-tag:button:edit', this.settingsService.app['identifiers'])) {
              this.modal
                .createStatic(EmergencyDispatchEmergencyTagInformEditComponent, { i: record, mode: 'edit' })
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
            if (this.isPermission('emergency-tag:button:delete', this.settingsService.app['identifiers'])) {
              this.remove(item);
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          },
        },
      ],
      width: '20%',
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

  remove(record:any) {
    console.log(record);
    this.http.get(`/service/emergency-base-config/admin/adminTagGroupApi/delete/` + record.id).subscribe((res) => {
      if (res.success) {
        this.messageService.success(res.message);
        this.st.reload();
      }
    });
  }

  ngOnInit() {}

  peopleImport() {
    this.modal.createStatic(EmergencyDispatchEmployeeShiftEditComponent, { i: { id: 0 } }).subscribe(() => this.st.reload());
  }

  add() {
    this.modal.createStatic(EmergencyDispatchEmergencyTagInformEditComponent, { i: {}, mode: 'add' }).subscribe(() => {
      this.st.reload();
    });
  }
}
