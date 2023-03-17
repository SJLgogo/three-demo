import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { STColumn, STColumnTag, STComponent } from '@delon/abc/st';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 账户状态
 */
const statusTAG: STColumnTag = {
  '1': { text: '激活状态', color: '#45d703' },
  '2': { text: '休眠状态', color: '#708090' },
  '3': { text: '注销账号', color: '#E02020' }
};

@Component({
  selector: 'app-setup-post-check-user-table',
  templateUrl: './post-check-user-table.component.html'
})
export class SetupPostCheckUserTableComponent implements OnInit, AfterViewInit {
  i: any;

  schema: SFSchema = {
    properties: {},
    required: []
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 }
    },
    $no: {
      widget: 'text'
    },
    $href: {
      widget: 'string'
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 }
    }
  };

  url = `/org/service/organization/admin/account/page-all`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '用户名称'
      }
    }
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    {
      title: '编号',
      index: 'id',
      type: 'checkbox'
    },
    { title: '名称', index: 'thirdPartyName', width: '100px' },
    { title: '手机号', index: 'mobilePhone', width: '100px' },
    // { title: 'email', index: 'user.email', width: '100px' },
    { title: '公司', index: 'companyName', width: '100px' },
    { title: '账户状态', index: 'status', width: '100px', type: 'tag', tag: statusTAG }
  ];

  constructor(public http: _HttpClient, private modal: NzModalRef, private msgSrv: NzMessageService) {
  }


  ngAfterViewInit(): void {
    this.st.req.body = {
      postId: this.i.postId,
      selected: true
    };
  }


  ngOnInit() {

  }

  add() {
  }

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
    value.userIds = checkedIds;
    value.postId = this.i.postId;
    this.http.post(`/security/service/security/admin/post/bindUser`, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('岗位和人的关系绑定成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }

}
