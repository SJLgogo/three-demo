/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-setup-security-data-permissions-edit',
  templateUrl: './edit.component.html',
})
export class SetupSecurityDataPermissionsEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '权限组名称' },
    },
    required: ['name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150,
    },
    $name: {
      widget: 'string',
    },
    $remark: {
      widget: 'textarea',
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (typeof this.record.id != 'undefined') {
      this.http.get(`//base/service/security/admin/application/${this.record.id}`).subscribe((res) => {
        if (res.success) {
          this.i = res.data;
        }
      });
    }
  }

  save(value: any) {
    // let category: any = this.schema.properties.category.enum.find((item: any) => item.value == value.category);
    // console.log('category:', category);
    // value.categoryName = category.label;

    this.http.post(`//base/service/security/admin/scopePermission/create`, value).subscribe((res) => {
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
