import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SFComponent, SFSchema } from '@delon/form';
import { STChange, STClickRowClassNameType, STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SetupPostCheckUserTableComponent } from '../post-check-user-table/post-check-user-table.component';

@Component({
  selector: 'app-setup-post-bind-user',
  templateUrl: './post-bind-user.component.html'
})
export class SetupPostBindUserComponent implements OnInit {
  record: any = {};
  confirmModal?: NzModalRef; // For testing by now
  @Input() post: any;
  userId: string = '';
  @Output() permission = new EventEmitter<string>();
  //获取岗位下的人信息
  url = `/org/service/organization/admin/user/findPageUserByPostId`;
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '用户名称'
      }
    }
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  clickRowClassName: STClickRowClassNameType = { exclusive: true, fn: () => 'text-processing' };
  columns: STColumn[] = [
    {
      title: '操作',
      width: 50,
      buttons: [
        {
          text: '删除',
          tooltip: '删除',
          type: 'del',
          icon: 'delete',
          click: (record, _modal, comp) => {
            this.http
              .delete('/security/service/security/admin/post/unbindUser' + '/' + this.post.id + '/' + record.id)
              .subscribe(
                (res: any) => {
                  if (res.code === 200) {
                    this.messageService.success(`成功移除【${record.name}】角色权限`);
                    this.st.reload();
                  } else {
                    this.messageService.success(`移除失败【${record.name}】`);
                  }
                });
          }
        }
      ]
    },
    { title: '名称', index: 'name', width: '100px' },
    // {title: '登陆账号', index: 'account', width: '100px'},
    // {title: '公司', index: 'companyName', width: '100px'},
    // { title: '邮箱', index: 'email', width: '100px' },
    { title: '手机号', index: 'mobilePhone', width: '100px' }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public settingsService: SettingsService,
    private messageService: NzMessageService,
    private nzModal: NzModalService
  ) {
  }


  ngAfterViewInit(): void {
    this.st.req.body = { postId: this.post.id }; // 给body赋值
    this.st.reload();
  }

  searchName() {
    this.st.req.body = { postId: this.post.id }; // 给body赋值
    this.st.reload();
  }


  addUserPost() {
    this.modal
      .createStatic(SetupPostCheckUserTableComponent, {
        i: { postId: this.post.id },
        mode: 'add'
      })
      .subscribe(() => {
        this.st.req.body = { postId: this.post.id }; // 给body赋值
        this.st.reload();
      });
  }


  /**
   * 清空查询
   */
  reset() {
    this.sf.reset();
    this.sf.refreshSchema();
    this.st.reload({});
    this.st.resetColumns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadTable();
  }

  /**
   * 刷新表格数据
   */
  reloadTable() {
    if (this.post.index === 1) {
      this.st.req.body = { postId: this.post.id }; // 给body赋值
      this.st.reload();
    }
  }


  clickContent(e: STChange): void {
    if (e.click) {
      // @ts-ignore
      let data = e.click?.item;
      this.userId = data?.user?.id;
      this.permission.emit(this.userId);
    }
  }

  /**
   * 搜索
   */
  search(event: any): void {
    this.st.reload(event);
    this.st.resetColumns();
  }

  ngOnInit(): void {
  }

}
