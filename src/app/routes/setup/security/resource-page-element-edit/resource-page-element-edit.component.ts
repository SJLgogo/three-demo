/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { SFSchema, SFSchemaEnumType, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-setup-security-resource-page-element-edit',
  templateUrl: './resource-page-element-edit.component.html',
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
      applicationId: {
        type: 'string',
        title: '关联的公司',
        ui: {
          widget: 'select',
          asyncData: () => {
            return this.http.get(`/service/security/admin/application/list`).pipe(
              map((item) => {
                const children = item.data.map((element:any) => {
                  return { label: element.name, value: element.id };
                });
                const type: SFSchemaEnumType = [
                  {
                    label: '公司列表',
                    group: true,
                    children,
                  },
                ];
                return type;
              }),
            );
          },
        } as SFSelectWidgetSchema,
      },
      remark: { type: 'string', title: '备注', maxLength: 140 },
      isPermissionElement: {
        type: 'boolean',
        title: '是否权限授权元素',
        ui: {
          checkedChildren: '是',
          unCheckedChildren: '否',
        },
      },
      permissionName: { type: 'string', title: '权限名称', ui: { visibleIf: { isPermissionElement: [true] } } },
      permissionIdentifier: { type: 'string', title: '权限标识符', ui: { visibleIf: { isPermissionElement: [true] } } },
    },
    required: ['name', 'identifier'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150,
    },
    $remark: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.pageElement.id != null) {
      this.http
        .get('/service/security/admin/security-resource/page-element-view', { pageElementId: this.pageElement.id })
        .subscribe((res) => {
          if (res.success) {
            this.pageElement = res.data;
          } else {
            this.msgSrv.error('数据获取失败:' + res.message);
          }
        });
    }
  }

  save(value: any) {
    let url = `/service/security/admin/security-resource/page-element-create`;
    value.menuId = this.menuId;
    if (this.pageElement.id != null) {
      url = `/service/security/admin/security-resource/page-element-update`;
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
