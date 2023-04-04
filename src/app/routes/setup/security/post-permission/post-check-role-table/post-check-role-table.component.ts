import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFSchemaEnumType, SFUISchema } from '@delon/form';
import { STColumn, STComponent } from '@delon/abc/st';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-setup-post-check-role-table',
  templateUrl: './post-check-role-table.component.html',
})
export class SetupPostCheckRoleTableComponent implements OnInit,AfterViewInit {
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

  url = `/security/service/security/admin/authority/role/page`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '角色名称'
      },
      appId: {
        type: 'string', title: '应用名称',
        ui: {
          width: 300,
          placeHolder: '请输入', widget: 'select',
          asyncData: () => {
            return this.http.get(`/base/api/agent/app/find-all`).pipe(
              map((item) => {
                const children = item.data.map((element: any) => {
                  return { label: element.name, value: element.id };
                });
                const type: SFSchemaEnumType = [
                  {
                    label: '应用列表',
                    group: true,
                    children
                  }
                ];
                return type;
              })
            );
          },
        }
      },
    }
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    {
      title: '编号',
      index: 'id',
      type: 'checkbox'
    },
    { title: '名称', index: 'name'},
    { title: '公司', index: 'companyName' },
    { title: '应用名称', index: 'appName' },
    { title: '应用appId', index: 'appId' },
    { title: '编码', index: 'code' },

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
        checkedIds.push(i.id);
      }
    });
    value.roleIds = checkedIds;
    value.postId = this.i.postId;
    this.http.post(`/security/service/security/admin/post/batchBindRole`, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('岗位和角色的关系绑定成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }

}
