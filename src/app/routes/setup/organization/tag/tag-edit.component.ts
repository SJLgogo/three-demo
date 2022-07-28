import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-system-contact-tag-edit',
  templateUrl: './tag-edit.component.html',
})
export class SystemContactTagEditComponent implements OnInit {
  record: any = {};
  postData: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '标签名称' },
      remark: { type: 'string', title: '标签描述', maxLength: 140 },
    },
    required: ['name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $name: {
      widget: 'string',
    },
    $remark: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.record.id != null) {
      this.http.get(`/service/contact/admin/tag/` + this.record.id).subscribe((res) => {
        if (res.success) {
          this.postData = res.data;
        }
      });
    }
  }

  save(value: any) {
    this.http.post(`/service/contact/admin/tag/add`, value).subscribe((res) => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
