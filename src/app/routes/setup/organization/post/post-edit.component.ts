import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-system-contact-post-edit',
  templateUrl: './post-edit.component.html',
})
export class SystemContactPostEditComponent implements OnInit {
  record: any = {};
  organization: any = {};
  postData: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '岗位名称' },
      organizationName: { type: 'string', title: '所属部门', readOnly: true },
      level: { type: 'number', title: '层级编号' },
      organizationPrincipal: {
        type: 'boolean',
        title: '是否责任岗位',
        ui: {
          checkedChildren: '开',
          unCheckedChildren: '关',
        },
      },
      remark: { type: 'string', title: '描述', maxLength: 100 },
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
    console.log(this.record);
    console.log(this.organization);
    if (this.record != null) {
      this.http.get(`/service/contact/admin/post/` + this.record.id).subscribe((res) => {
        if (res.success) {
          this.postData = res.data;
        }
      });
    }
  }

  save(value: any) {
    if (value.id == null) {
      value.organizationId = this.organization.id;
    }
    this.http.post(`/service/contact/admin/post/save`, value).subscribe((res) => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
