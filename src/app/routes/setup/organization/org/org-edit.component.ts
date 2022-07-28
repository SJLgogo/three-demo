/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-system-contact-org-edit',
  templateUrl: './org-edit.component.html',
})
export class SystemContactOrgEditComponent implements OnInit {
  organization: any = {};
  title = '';
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '编号' },
      remark: { type: 'string', title: '描述', maxLength: 140 },
    },
    required: ['owner', 'callNo', 'href', 'description'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
    },
    $description: {
      widget: 'textarea',
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    console.log(this.organization);
    if (this.organization.mode === 'add') {
      this.title = '[' + this.organization.name + '] 添加下级部门';
      this.i = {};
    } else if (this.organization.mode === 'edit') {
      this.title = '编辑 [' + this.organization.name + '] ';
      this.i = this.organization;
    }
  }

  save(value: any) {
    if (this.organization.mode === 'add') {
      let params = {
        parentId: this.organization.id,
        name: value.name,
        remark: value.remark,
      };
      this.http.post(`/service/contact/admin/organization/create`, params).subscribe((res) => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    } else if (this.organization.mode === 'edit') {
      let params = {
        id: this.organization.id,
        name: value.name,
        remark: value.remark,
      };
      this.http.post(`/service/contact/admin/organization/edit`, params).subscribe((res) => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
