import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SystemConfigEditComponent } from './edit/edit.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SystemConfigService } from '../../../api/system/system-config.service';

@Component({
  selector: 'app-system-config',
  templateUrl: './config.component.html'
})
export class SystemConfigComponent implements OnInit {
  url = `/service/dictionary/api/admin/system-config/page`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称'
      }
    }
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '序号', type: 'no' },
    { title: '名称', index: 'name' },
    { title: '键值', index: 'value' },
    { title: '内容', index: 'content' },
    { title: '描述', index: 'description' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'modal',
          modal: { component: SystemConfigEditComponent },
          click: 'reload'
        },
        {
          text: '删除',
          tooltip: '删除',
          type: 'del',
          click: (record, _modal, comp) => {
            this.systemConfigService.deleteSystemConfig(record.id).subscribe(
              res => {
                if (res.success) {
                  this.msgSrv.success(res.message ?? '');
                  this.st.reload();
                } else {
                  this.msgSrv.error(res.message ?? '');
                }
              },
              error => {
                this.msgSrv.success(`删除失败【${record.name}】`);
              }
            );
          }
        }
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private systemConfigService: SystemConfigService,
    private msgSrv: NzMessageService
  ) {}

  ngOnInit(): void {}

  add(): void {
    this.modal.createStatic(SystemConfigEditComponent, { record: { id: '' } }).subscribe(() => this.st.reload());
  }

  refresh(): void {
    this.st.reload();
  }
}
