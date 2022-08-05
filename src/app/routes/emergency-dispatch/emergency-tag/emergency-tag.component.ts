import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { EmergencyDispatchEmergencyTagEditComponent } from './edit/edit.component';
import { environment } from '@env/environment';
import { STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmergencyDispatchEmergencyTagRelatedPersonComponent } from './related-person/related-person.component';
import {Base} from "../../../common/base";
import {SetupContactSelectComponent} from "../../../shared/components/contact-select/contact-select.component";

@Component({
  selector: 'app-emergency-dispatch-emergency-tag',
  templateUrl: './emergency-tag.component.html',
})
export class EmergencyDispatchEmergencyTagComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/adminTagApi/findAllPage`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '应急标签名称',
      },
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    {
      title: '',
      buttons: [
        {
          text: '批量关联应急人',
          type: 'static',
          icon: 'edit',
          click: (record) => {
            if (this.isPermission('emergency-tag:button:edit', this.settingsService.app['identifiers'])) {
              this.modal
                .createStatic(EmergencyDispatchEmergencyTagRelatedPersonComponent, { record: record, mode: 'edit' })
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
                .createStatic(EmergencyDispatchEmergencyTagEditComponent, { i: record, mode: 'edit' })
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
      width: 300,
    },
    { title: '应急标签名称', index: 'name', width: 300 },
    {
      title: '区域',
      index: 'area',
      format: function (item, col) {
        if (item.area == false) {
          return '否 ';
        } else {
          return '是 ';
        }
      },
      width: 100,
    },
    { title: '负责地点/区域', index: 'siteName', width: 1000 },
    { title: '负责事件类别', index: 'eventCategory', width: 500 },
    { title: '负责事件等级', index: 'eventLevel', width: 500 },
    { title: '对应应急人员', index: 'emergencyEmployee', width: 1000 },
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
    this.http.delete(`/service/emergency-base-config/admin/adminTagApi/delete/` + record.id).subscribe((res) => {
      if (res.success) {
        this.messageService.success(res.message);
        this.st.reload();
      }
    });
  }

  ngOnInit() {}

  peopleImport() {
    const mode = ['employee'];
    this.modal.createStatic(SetupContactSelectComponent, { mode }).subscribe((res) => {
      this.st.reload();
    });
    // this.modal
    //   .createStatic(EmergencyDispatchEmployeeShiftEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  add() {
    this.modal.createStatic(EmergencyDispatchEmergencyTagEditComponent, { i: {}, mode: 'add' }).subscribe(() => {
      this.st.reload();
    });
  }
}
