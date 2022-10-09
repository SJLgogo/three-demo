/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFSchemaEnumType, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-setup-resource-menu-edit',
  templateUrl: './edit.component.html'
})
export class SetupResourceMenuEditComponent implements OnInit {
  record: any = {};
  menu: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '菜单名称' },
      menuIcon: { type: 'string', title: '菜单图标' },
      // level: { type: 'number', title: '菜单级别' },
      position: { type: 'number', title: '菜单排序位置' },
      url: { type: 'string', title: '菜单URL' }
    },
    required: ['name', 'position']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 }
    }
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {
  }

  ngOnInit(): void {
    console.log(this.menu);
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    let url = '';
    value.type='menu';
    if (this.menu.mode === 'add') {
      value.parentId = this.menu.key;
      url = `/security/service/security/admin/authority/permission/create`;
    } else if (this.menu.mode === 'edit') {
      value.id = this.menu.id;
      url = `/security/service/security/admin/authority/permission/create/update`;
    }

    this.http.post(url, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('保存成功');
        this.modal.close({});
      } else {
        this.msgSrv.error('保存失败: ' + res.message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
