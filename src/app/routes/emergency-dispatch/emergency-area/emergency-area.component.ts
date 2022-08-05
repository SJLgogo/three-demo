import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { EmergencyDispatchEmergencyAreaEditComponent } from './edit/edit.component';
import { environment } from '@env/environment';
import { STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import {Base} from "../../../common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-area',
  templateUrl: './emergency-area.component.html',
})
export class EmergencyDispatchEmergencyAreaComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/adminAreaApi/findAllAreaPage`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '区域名称',
      },
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '应急区域名称', index: 'name', width: '100px' },
    { title: '关联站点', index: 'stationNames', width: '600px' },
    {
      title: '',
      buttons: [
        {
          text: '删除',
          icon: 'delete',
          type: 'del',
          tooltip: '此处删除的是基础数据,会影响已经用此数据的其他关联数据,请谨慎操作!!!!',
          click: (item: any) => {
            if (this.isPermission('emergency-area:button:delete', this.settingsService.app['identifiers'])) {
              this.remove(item);
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          },
        },
      ],
      width: '200px',
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

  ngOnInit() {}

  remove(record:any) {
    this.http.delete(`/service/emergency-base-config/admin/adminAreaApi/delete/` + record.id).subscribe((res) => {
      if (res.success) {
        this.messageService.success(res.message);
        this.st.reload();
      }
    });
  }

  add() {
    this.modal.createStatic(EmergencyDispatchEmergencyAreaEditComponent, { i: { id: 0 }, mode: 'add' }).subscribe(() => this.st.reload());
  }
}
