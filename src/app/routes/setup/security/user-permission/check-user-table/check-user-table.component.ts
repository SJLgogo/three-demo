/* eslint-disable */
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { STColumn, STColumnTag, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';


/**
 * 账户状态
 */
const statusTAG: STColumnTag = {
  '1': { text: '激活状态', color: '#45d703' },
  '2': { text: '休眠状态', color: '#708090' },
  '3': { text: '注销账号', color: '#E02020' },
};
@Component({
  selector: 'app-setup-check-user-table',
  templateUrl: './check-user-table.component.html',
})
export class SetupCheckUserTableComponent  implements OnInit {
  i: any;

  schema: SFSchema = {
    properties: {},
    required: [],
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $no: {
      widget: 'text',
    },
    $href: {
      widget: 'string',
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  url = `/org/service/organization/admin/account/page-all`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '用户名称',
      },
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    {
      title: '编号',
      index: 'id',
      type: 'checkbox',
    },
    { title: '名称', index: 'thirdPartyName', width: '100px' },
    { title: '手机号', index: 'mobilePhone', width: '100px' },
    { title: 'email', index: 'user.email', width: '100px' },
    {title: '公司', index: 'companyName', width: '100px'},
    {title: '账户状态', index: 'status', width: '100px',type: 'tag', tag: statusTAG},
  ];

  constructor(public http: _HttpClient, private modal: NzModalRef, private msgSrv: NzMessageService) {
  }

  ngOnInit() {
    this.st.req.body = {
      roleId: this.i.roleId,
      selected: true,
    };
  }

  add() {}

  change(e: any) {
    if (e.type === 'click') {
      // 点击行就选中。如果是选中状态再点击一次就取消选中
      this.st._data.map((i: any) => {
        if (i.id === e.click.item.id) {
          if (i.checked) {
            i.checked = false;
          } else {
            i.checked = true;
          }
        }
      });
    } else if (e.type === 'checkbox') {
    }
  }

  close() {
    this.modal.destroy();
  }

  save(value: any) {
    let checkedIds = new Array();
    this.st._data.map((i: any) => {
      if (i.checked) {
        checkedIds.push(i.user.id);
      }
    });
    // console.log('checkedIds:', checkedIds);
    value.userIds = checkedIds;
    value.roleId = this.i.roleId;
    this.http.post(`/security/service/security/admin/authorization/assign-role-to-user`, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('角色授权成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }
}
