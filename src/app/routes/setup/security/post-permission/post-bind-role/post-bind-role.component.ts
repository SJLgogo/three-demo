import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SFComponent, SFSchema, SFSchemaEnumType } from '@delon/form';
import { STChange, STClickRowClassNameType, STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SetupPostCheckRoleTableComponent } from '../post-check-role-table/post-check-role-table.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-setup-post-bind-role',
  templateUrl: './post-bind-role.component.html'
})
export class SetupPostBindRoleComponent implements OnInit {
  record: any = {};
  confirmModal?: NzModalRef; // For testing by now
  @Input() post: any;
  userId: string = '';
  @Output() permission = new EventEmitter<string>();
  //获取岗位下的角色信息
  url = `/security/service/security/admin/post/findRoleByPostId`;
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      roleName: {
        type: 'string',
        title: '角色名称'
      }
    }
  };
  @ViewChild('st') st!: STComponent;
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
              .delete('/security/service/security/admin/post/unbindRole/' + record.post.id + '/' + record.role.id)
              .subscribe((res: any) => {
                if (res.code === 200) {
                  this.messageService.success('删除成功');
                  this.st.reload();
                } else {
                  this.messageService.error(res.message);
                }
              });
          }
        }
      ]
    },
    { title: '角色名称', index: 'role.name', width: '100px' },
    { title: '角色编码', index: 'role.code', width: '100px' },
    {title: '应用名称', index: 'role.appName', width: '100px'},
    {title: '应用appId', index: 'role.appId', width: '100px'},
    // {title: '手机号', index: 'mobilePhone', width: '100px'},
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public settingsService: SettingsService,
    private messageService: NzMessageService,
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
    this.modal.createStatic(SetupPostCheckRoleTableComponent, {
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

  onTabSelectChange(event: any): void {
    // 检查当前选中的 tab 是否为 "岗位-角色-绑定"
    if (event.index === 0) {
      // 在这里刷新表格数据
      this.reloadTable();
    }
  }


  /**
   * 刷新表格数据
   */
  reloadTable() {
    if (this.st) {
      if (this.post.index === 0) {
        this.st.req.body = { postId: this.post.id }; // 给body赋值
        this.st.reload();
      }
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
