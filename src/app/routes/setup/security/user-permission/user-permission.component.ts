/* eslint-disable */
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFComponent, SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SetupCheckUserTableComponent } from './check-user-table/check-user-table.component';

@Component({
  selector: 'app-setup-user-permission',
  templateUrl: './user-permission.component.html'
})
export class SetupUserPermissionComponent implements AfterViewInit, OnChanges {
  record: any = {};
  confirmModal?: NzModalRef; // For testing by now

  @Input() role: any;

  //获取角色下的人信息
  url = `/org/service/organization/admin/account/getUserIdsByRole`;
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
  columns: STColumn[] = [
    { title: '名称', index: 'thirdPartyName', width: '100px' },
    { title: '登陆账号', index: 'account', width: '100px' },
    { title: '邮箱', index: 'user.email', width: '100px' },
    { title: '手机号', index: 'mobilePhone', width: '100px' },
    {
      title: '操作',
      width: '100px',
      buttons: [
        {
          text: '删除',
          tooltip: '删除',
          type: 'del',
          icon: 'delete',
          click: (record, _modal, comp) => {
            this.http
              .delete('/security/service/security/admin/authorization/delete', {
                userId: record.user.id,
                roleId: this.role.id,
              })
              .subscribe(
                (res) => {
                  this.messageService.success(`成功移除【${record.thirdPartyName}】角色权限`);
                  this.st.reload();
                },
                (error) => {
                  this.messageService.success(`移除失败【${record.thirdPartyName}】`);
                },
              );
          },
        },
      ]
    }
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
    this.st.req.body = { id: this.role.id }; // 给body赋值
    // this.st.reload();
  }

  searchName() {
    this.st.req.body = { roleId: this.role.id }; // 给body赋值
    this.st.reload();
  }

  addUserRole() {
    this.modal
      .createStatic(SetupCheckUserTableComponent, {
        i: { roleId: this.role.id },
        mode: 'add'
      })
      .subscribe(() => {
        this.st.req.body = { roleId: this.role.id }; // 给body赋值
        this.st.reload();
      });
  }

  /**
   * 一键转普通角色
   */
  transferToNormalRole() {
    this.nzModal.confirm({
      nzTitle: '确定要赋予所有人' + this.role.name + '的角色吗?',
      nzContent: '此操作会把你账号所在公司所有人赋予角色权限,请谨慎操作!',
      nzOnOk: () => {
        this.http.post(`/security/service/security/admin/authorization/transferToNormalRole`, { roleId: this.role.id }).subscribe((res) => {
          this.messageService.success('所有人赋予' + this.role.name + '角色成功');
          this.st.req.body = { roleId: this.role.id }; // 给body赋值
          this.st.reload();
        });
      }
    });
  }

  /**
   * 清空查询
   */
  reset() {
    this.sf.reset();
    this.sf.refreshSchema();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('点击进来:', this.role);
    // this.customRequest.body = {
    //   roleId: this.role.id,
    // };
    // this.st.reload({roleId:this.role.id});
    this.reloadTable();
  }

  customRequest: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize',
    },
  };

  customPage: any = {
    zeroIndexed: true,
    pageSizes: [10, 20, 30, 40, 50],
    front: false,
    showSize: true,
    showQuickJumper: true,
  };

  customResponse: any = {
    reName: {
      total: 'data.totalElements',
      list: 'data.content',
    },
  };

  /**
   * 刷新表格数据
   */
  reloadTable() {
    if (this.role.index === 2) {
      this.st.req.body = { roleId: this.role.id }; // 给body赋值
      this.st.reload();  // 引起页面问题
    }
  }
}
