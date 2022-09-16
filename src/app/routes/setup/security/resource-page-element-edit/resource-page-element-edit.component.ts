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
        title: '按钮还是标签',
        enum: [
          { label: '按钮', value: 'button' },
          { label: '标签', value: 'div' }
        ],
        default: 'button',
        ui: {
          widget: 'select',
          width: 200,
        } as SFSelectWidgetSchema
      },
      remark: { type: 'string', title: '备注', maxLength: 140 }
      // isPermissionElement: {
      //   type: 'boolean',
      //   title: '是否权限授权元素',
      //   ui: {
      //     checkedChildren: '是',
      //     unCheckedChildren: '否',
      //   },
      // },
      // permissionName: { type: 'string', title: '权限名称', ui: { visibleIf: { isPermissionElement: [true] } } },
      // permissionIdentifier: { type: 'string', title: '权限标识符', ui: { visibleIf: { isPermissionElement: [true] } } },
    },
    required: ['name']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150
    },
    $remark: {
      widget: 'textarea',
      grid: { span: 24 }
    }
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {
  }

  ngOnInit(): void {
    // if (this.pageElement.id != null) {
    //   this.http
    //     .get('/security/service/security/admin/security-resource/page-element-view', { pageElementId: this.pageElement.id })
    //     .subscribe((res) => {
    //       if (res.success) {
    //         this.pageElement = res.data;
    //       } else {
    //         this.msgSrv.error('数据获取失败:' + res.message);
    //       }
    //     });
    // }
  }

  save(value: any) {
    let url = `/security/service/security/admin/authority/permission/create`;
    //添加的按钮所属于哪个菜单下面
    value.parentId = this.menuId;
    if (this.pageElement.id != null) {
      url = `/security/service/security/admin/authority/permission/create/update`;
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
