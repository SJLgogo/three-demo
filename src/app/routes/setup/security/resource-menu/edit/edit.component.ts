/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFSchemaEnumType, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';
import { Constant } from '../../../../../common/constant';

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
      identifier: { type: 'string', title: '菜单标识符' },
      position: { type: 'number', title: '菜单排序位置' },
      url: { type: 'string', title: '菜单URL' },
      hide: {
        type: 'boolean',
        title: '是否隐藏',
        enum: Constant.trueOrFalse,
        default: false,
        ui: {
          width: 300
        }
      }
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
    if (this.menu.id)
      this.http.get(`/security/service/security/admin/authority/permission/findById/${this.menu.id}`).subscribe(res => {
        this.menu = res.data;
        this.menu.mode = 'edit';
      });
  }

  save(value: any) {
    let url = '';
    value.type = 'menu';
    if (this.menu.mode === 'add') {
      value.parentId = this.menu.key;
      url = `/security/service/security/admin/authority/permission/create`;
    } else if (this.menu.mode === 'edit') {
      value.id = this.menu.id;
      url = `/security/service/security/admin/authority/permission/update`;

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
