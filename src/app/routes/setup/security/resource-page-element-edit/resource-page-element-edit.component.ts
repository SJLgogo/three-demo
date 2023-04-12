/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { SFSchema, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-setup-security-resource-page-element-edit',
  templateUrl: './resource-page-element-edit.component.html'
})
export class SetupSecurityResourcePageElementEditComponent implements OnInit {
  record: any = {};
  menuId = '';
  menuName = '';
  pageElement: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '元素名称' },
      identifier: { type: 'string', title: '页面元素标识符' },
      type: {
        type: 'string',
        width: 100,
        title: '按钮还是标签',
        enum: [
          { label: '按钮', value: 'button' },
          { label: '标签', value: 'div' }
        ],
        default: 'button',
        ui: {
          widget: 'select',
        } as SFSelectWidgetSchema
      },
      remark: { type: 'string', title: '备注', maxLength: 140 }
    },
    required: ['name']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150
    },
    $remark: {
      widget: 'textarea',
      autosize: { minRows: 2, maxRows: 2 }, // 设置 minRows 和 maxRows 为相同的值来固定高度
      grid: { span: 24 }
    }
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {
  }

  ngOnInit(): void {
  }

  save(value: any) {
    let url = `/security/service/security/admin/authority/permission/create`;
    //添加的按钮所属于哪个菜单下面
    value.parentId = this.menuId;
    if (this.pageElement.id != null) {
      url = `/security/service/security/admin/authority/permission/update`;
    }

    this.http.post(url, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error('保存失败:' + res.message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
