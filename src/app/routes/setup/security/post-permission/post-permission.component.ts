import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/core/tree';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SetupUserPermissionComponent } from '../user-permission/user-permission.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { PermissionService } from '../../service/permission.service';
import { SetupPostEditComponent } from './post-edit/post-edit.component';
import { SetupPostBindRoleComponent } from './post-bind-role/post-bind-role.component';

@Component({
  selector: 'app-setup-post-permission',
  templateUrl: './post-permission.component.html',
  styleUrls: ['./post-permission.component.less']
})
export class SetupPostPermissionComponent implements OnInit {

  /**
   * 岗位树
   */
  postNodes = [];
  roleTreeLoading = true;
  activeRoleNode!: NzTreeNode;
  confirmModal!: NzModalRef;
  index: number = 0;
  @ViewChild('appUsePermission', { static: false }) sf!: SetupUserPermissionComponent;
  @ViewChild('postAndRoleBind', { static: false }) postAndRoleBindSF!: SetupPostBindRoleComponent;

  contentDate: string = '';
  opacityNumber: string = '20';
  @ViewChild('permission') permission: any;
  @ViewChild('permissions') permissions: any;
  permissionUserId: string = '';
  appId: any;

  //----------------岗位树,用于岗位继承关系
  ngOnInit() {
    console.log('SetupPostPermissionComponent initialized');
    this.loadRoleTree();
    this.index = 0;
    this.cdr.detectChanges(); // 在这里添加更改检测的调用
  }

  //点击加载下级树节点
  postEvent(event: NzFormatEmitEvent): void {
    const node: any = event.node;
    console.log("postEvent triggered", event);
    if (event.eventName === 'click') {
      this.activeRoleNode = node;
      this.activeRole(this.activeRoleNode, this.index);
    }
  }

  //加载组织机构树
  loadRoleTree(): void {
    this.roleTreeLoading = true;
    this.http.get(`/security/service/security/admin/post/tree`).subscribe((res) => {
      if (res.success) {
        this.postNodes = res.data;
        this.roleTreeLoading = false;
      }
    });
  }

  optRole(node: any) {
    this.activeRoleNode = node;
  }

  openFolder(node: any): void {
  }

  postOperation(opt: string, node: any): void {
    if (opt === 'add') {
      this.modal
        .createStatic(
          SetupPostEditComponent,
          {
            editNode: node,
            mode: 'add'
          },
          { size: 'md' }
        )
        .subscribe(() => {
          this.loadRoleTree();
        });
    } else if (opt === 'edit') {
      if (node.key == 1) {
        this.messageService.warning('不能编辑顶级节点！');
        return;
      }
      this.modal
        .createStatic(
          SetupPostEditComponent,
          {
            editNode: node,
            mode: 'edit'
          },
          { size: 'md' }
        ).subscribe(() => {
        this.loadRoleTree();
      });
    } else if (opt === 'remove') {
      if (node.key == 1) {
        this.messageService.warning('不能删除顶级节点！');
        return;
      }
      this.confirmModal = this.modalSrv.confirm({
        nzTitle: '删除确认?',
        nzContent: '是否确认删除岗位 [' + node.title + '] ?',
        nzOnOk: () => {
          this.http.delete(`/security/service/security/admin/post/delete/` + node.key).subscribe((res) => {
            if (res.success) {
              this.messageService.success('删除成功');
              this.loadRoleTree();
            } else {
              this.messageService.error('删除失败 : ' + res.message);
            }
          });
        }
      });
    }
  }

  //-----------------岗位树,用于岗位继承关系

  //-----------------岗位列表
  // confirmModal: NzModalRef;
  roleList = [];
  roleTitle = '';
  selectedPost: any = null;

  loadRoleList() {
    this.http.get(`/service/contact/admin/role/list`).subscribe((res) => {
      if (res.success) {
        this.roleList = res.data;
      }
    });
  }

  activeRole(roleNode: any, index: number) {
    this.index = index;
    this.selectedPost = { id: roleNode.key, name: roleNode.title, index: this.index };
    this.roleTitle = this.selectedPost.name;
    console.log('selectedPost:', this.selectedPost);
    this.cdr.markForCheck();
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1);
  }

  nzSelectChange(args: any): void {
    this.index = args.index;
    this.selectedPost.index = args.index;
    if (this.index === 0) {
      // 在这里刷新表格数据
      this.postAndRoleBindSF.reloadTable();
    } else if (this.index === 1) {
      this.sf.reloadTable();
    }
    // this.cdr.detectChanges();
  }

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private messageService: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private permissionService: PermissionService
  ) {
  }

}
