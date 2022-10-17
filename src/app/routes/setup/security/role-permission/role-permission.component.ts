/* eslint-disable */
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {NzFormatEmitEvent, NzTreeNode} from 'ng-zorro-antd/core/tree';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {PermissionService} from '../../service/permission.service';
import {SetupUserPermissionComponent} from '../user-permission/user-permission.component';
import {SetupSecurityRoleEditComponent} from './role-edit/role-edit.component';

@Component({
  selector: 'app-setup-security-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.less']
})
export class SetupSecurityRolePermissionComponent implements OnInit {
  roleNodes = [];
  roleTreeLoading = true;
  activeRoleNode!: NzTreeNode;
  confirmModal!: NzModalRef;
  index: number = 0;
  @ViewChild('appUsePermission', {static: false}) sf!: SetupUserPermissionComponent;
  contentDate: string = '';
  opacityNumber: string = "20"
  @ViewChild("permission") permission: any;
  permissionUserId: string = '';

  //----------------角色树,用于角色继承关系
  ngOnInit() {
    this.loadRoleTree();
    this.index = 0;
  }


  //点击加载下级树节点
  roleEvent(event: NzFormatEmitEvent): void {
    const node: any = event.node;
    if (event.eventName === 'click') {
      this.activeRoleNode = node;
      this.activeRole(this.activeRoleNode, this.index);
    }
  }

  //加载组织机构树
  loadRoleTree(): void {
    this.roleTreeLoading = true;
    this.http.get(`/security/service/security/admin/authority/role/role-tree`).subscribe((res) => {
      if (res.success) {
        this.roleNodes = res.data;
        this.roleTreeLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  optRole(node: any) {
    this.activeRoleNode = node;
  }

  openFolder(node: any): void {
  }

  roleOperation(opt: string, node: any): void {
    console.log('node:', node);
    if (opt === 'add') {
      this.modal
        .createStatic(
          SetupSecurityRoleEditComponent,
          {
            editNode: node,
            mode: 'add'
          },
          {size: 'md'}
        )
        .subscribe(() => {
          this.loadRoleTree();
        });
    } else if (opt === 'edit') {
      this.modal
        .createStatic(
          SetupSecurityRoleEditComponent,
          {
            editNode: {
              id: node.key,
              name: node.title,
              remark: node.origin.remark,
              code: node.origin.code
            },
            mode: 'edit'
          },
          {size: 'md'}
        )
        .subscribe(() => {
          this.loadRoleTree();
        });
    } else if (opt === 'remove') {
      this.confirmModal = this.modalSrv.confirm({
        nzTitle: '删除确认?',
        nzContent: '是否确认删除角色 [' + node.title + '] ?',
        nzOnOk: () => {
          this.http.post(`/security/service/security/admin/authority/role/delete/` + node.key).subscribe((res) => {
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

  //-----------------角色树,用于角色继承关系

  //-----------------角色列表
  // confirmModal: NzModalRef;
  roleList = [];
  roleTitle = '';
  selectedRole: any = null;

  loadRoleList() {
    this.http.get(`/service/contact/admin/role/list`).subscribe((res) => {
      if (res.success) {
        this.roleList = res.data;
      }
    });
  }

  activeRole(roleNode: any, index: number) {
    this.cdr.reattach();
    this.index = index;
    this.selectedRole = {id: roleNode.key, name: roleNode.title, index: this.index};
    console.log(this.selectedRole, 'this.selectedRole')
    this.roleTitle = this.selectedRole.name;
  }

  nzSelectChange(args: any): void {
    // console.log('args:', args);
    this.index = args.index;
    this.selectedRole.index = args.index;
    this.opacityNumber = this.index == 2 ? "14" : "20";
    this.sf.reloadTable();
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

  permissionsAll(value: any): any {
    this.contentDate = value;
    this.permissionUserId = this.permission.userId;
     console.log(this.permissionUserId,'用户点击人ID',this.cdr);
  }
}
