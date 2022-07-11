/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-setup-security-role-edit',
  templateUrl: './role-edit.component.html',
})
export class SetupSecurityRoleEditComponent implements OnInit {
  modalTitle = '';
  formData: any = {};
  mode: any;
  editNode: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '角色名称' },
      remark: { type: 'string', title: '描述' },
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
    if (this.mode === 'add') {
      this.modalTitle = '添加角色';
    } else if (this.mode === 'edit') {
      this.formData = this.editNode;
      this.modalTitle = '编辑角色 [' + this.formData.name + ']';
    }
  }

  save(value: any) {
    let url = `/service/security/admin/authority/role/create`;
    if (this.mode === 'add') {
      value.parentId = this.editNode.key;
    } else if (this.mode === 'edit') {
      url = `/service/security/admin/authority/role/edit-name`;
    }

    this.http.post(url, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('保存成功');
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
