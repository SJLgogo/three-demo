/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-system-contact-job-edit',
  templateUrl: './job-edit.component.html',
})
export class SystemContactJobEditComponent implements OnInit {
  record: any = {};
  parentJob: any;
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      code: { type: 'string', title: '编号' },
      level: { type: 'number', title: '排序' },
      remark: { type: 'string', title: '描述', maxLength: 140 },
    },
    required: ['name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
    },
    $remark: {
      widget: 'textarea',
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    console.log(this.parentJob);
    console.log(this.record);
    if (this.record.id > 0) {
      this.http.get(`/service/contact/admin/job/${this.record.id}`).subscribe((res) => {
        this.i = res.data;
      });
    } else {
      this.i = {};
    }
  }

  save(value: any) {
    // console.log(value);
    value.parentId = this.parentJob.id;
    this.http.post(`/service/contact/admin/job/save`, value).subscribe((res) => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
