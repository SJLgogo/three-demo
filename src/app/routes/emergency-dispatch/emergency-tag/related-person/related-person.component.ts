import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-emergency-dispatch-emergency-tag-related-person',
  templateUrl: './related-person.component.html',
})
export class EmergencyDispatchEmergencyTagRelatedPersonComponent implements OnInit {
  record: any = {};
  i: any = {};
  modalTitle = '';
  schema: SFSchema = {
    properties: {
      emergencyEmployee: { type: 'string', title: '关联人名字', maxLength: 3000 },
    },
    required: ['emergencyEmployee'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $emergencyEmployee: {
      widget: 'textarea',
      grid: { span: 24 },
      autosize: { minRows: 3, maxRows: 15 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {}

  save(value: any):any {
    value.id = this.record.id;
    value.corpId = JSON.parse(<string>window.localStorage.getItem('employee')).corpId;
    this.http.post(`/service/emergency-base-config/admin/adminTagApi/saveTagAndPeople`, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('保存标签和人关联关系成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
