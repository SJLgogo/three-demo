/* eslint-disable */
import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-setup-security-app-permissions-edit',
  templateUrl: './edit.component.html',
})
export class SetupSecurityAppPermissionsEditComponent implements OnInit {
  record: any = {};
  i: any;

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      // logo: {
      //   type: 'string',
      //   title: '应用logo',
      //   enum: [],
      //   ui: {
      //     widget: 'upload',
      //     action: '/upload',
      //     resReName: 'resource_id',
      //     urlReName: 'url',
      //   } as SFUploadWidgetSchema,
      // },
      name: { type: 'string', title: '应用名称' },
      category: {
        type: 'string',
        title: '应用类型',
        enum: [
          { label: '企业微信', value: 'wxcp' },
          { label: '企业小程序', value: 'miniapp' },
          { label: '钉钉', value: 'ding' },
          { label: '云之家', value: 'yzj' },
          { label: '后台应用', value: 'admin' },
        ],
        default: 'wxcp',
        ui: {
          widget: 'select',
        } as SFSelectWidgetSchema,
      },
      corpId: { type: 'string', title: '第三方应用CorpId' },
      // wxcpAgentId: { type: 'string', title: 'AgentId' },
      // wxcpSecret: { type: 'string', title: 'Secret' },
      // wxcpUrl: { type: 'string', title: '应用链接' },

      // yzjEid: { type: 'string', title: '云之家Eid' },
      // yzjAppId: { type: 'string', title: '云之家AppId' },
      // yzjAppSecret: { type: 'string', title: '云之家AppSecret' },
      // yzjUrl: { type: 'string', title: '应用链接' },
      //
      // dingAgentId: { type: 'string', title: '钉钉AgentId' },
      //
      // adminUrl: { type: 'string', title: '管理后菜单' },

      remark: { type: 'string', title: '描述', maxLength: 140 },
    },
    required: ['name', 'category'],
    // if: {
    //   properties: { category: { enum: [ 'wxcp' ] } }
    // },
    // then: {
    //   required: [ 'wxcpCorpId', 'wxcpAgentId','wxcpSecret','wxcpUrl' ]
    // },
    // else: {
    //   required: [ 'adminUrl' ]
    // }
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
    const categoryProperty = this.sf.getProperty('/category')!;
    let category: any = categoryProperty.schema.enum?.find((item: any) => item.value == value.category);
    console.log('category:', category);
    value.categoryName = category.label;
    this.http.post(`//base/service/security/admin/application/add`, value).subscribe((res) => {
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
