/* eslint-disable */
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { SetupResourceMenuEditComponent } from './edit/edit.component';
import { SetupSecurityResourcePageElementEditComponent } from '../resource-page-element-edit/resource-page-element-edit.component';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-setup-security-resource-menu',
  templateUrl: './resource-menu.component.html',
  styleUrls: ['./resource-menu.component.less']
})
export class SetupSecurityResourceMenuComponent implements OnInit {
  menuNodes = [];
  optMenuId = '';
  optMenuName = '无';
  orgTreeLoading = true;
  activedMenuNode!: NzTreeNode;
  confirmModal!: NzModalRef;

  url = `/security/service/security/admin/authority/permission/page-element-table`;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };

  pageElementCustomRequest: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize'
    },
    params: {
      menuId: this.optMenuId
    }
  };

  pageElementCustomPage: any = {
    zeroIndexed: true,
    pageSizes: [100],
    front: false,
    showSize: true,
    showQuickJumper: true
  };

  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '元素名称', index: 'name' },
    { title: '页面标识符', index: 'identifier' },
    // { title: '权限受控', index: 'isPermissionElement', type: 'badge' },
    // { title: '权限名称', index: 'permissionName' },
    // { title: '权限标识符', index: 'permissionIdentifier' },
    { title: '备注', index: 'remark' },
    {
      title: '',
      buttons: [
        { text: '编辑', type: 'static', icon: 'edit', click: (item: any) => this.updatePageElementResource(item) },
        {
          text: '删除',
          type: 'static',
          icon: 'delete',
          click: (item: any) => {
            this.confirmModal = this.modalSrv.confirm({
              nzTitle: '删除确认?',
              nzContent: '是否确认删除元素 [' + item.name + '] ?',
              nzOnOk: () => {
                this.http.post(`//base/service/security/admin/security-resource/page-element-delete`, item).subscribe((res) => {
                  if (res.success) {
                    this.msgSrv.success('删除成功');
                    this.loadPageElementResourceTable(this.optMenuId);
                  }
                });
              }
            });
          }
        }
      ]
    }
  ];

  loadPageElementResourceTable(menuId: string): void {
    this.st.reload({
      parentId: this.optMenuId
    });
  }

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private cdr: ChangeDetectorRef,
    private modalSrv: NzModalService,

  ) {
  }

  ngOnInit() {
    this.loadMenuTree();
  }

  // 点击加载下级树节点
  menuEvent(event: NzFormatEmitEvent): void {
    const node:any = event.node;
    if (event.eventName === 'click') {
      this.activedMenuNode = node;
      this.optMenuId = node.key;
      this.optMenuName = node.title;
      this.loadPageElementResourceTable(this.optMenuId);
      this.activedMenuNode = node;
    }
  }

  // 加载组织机构树
  loadMenuTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/security/service/security/admin/security-resource/myMenuTree`).subscribe((res) => {
      if (res.success) {
        this.menuNodes = res.data.tree;
        this.orgTreeLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  optMenu(node:any) {
    this.activedMenuNode = node;
    this.optMenuId = node.key;
    this.optMenuName = node.title;
  }

  openFolder(node: any): void {
  }

  menuOperation(opt:string, node:any) {
    // console.log(opt,node);
    if (opt === 'add') {
      this.modal
        .createStatic(SetupResourceMenuEditComponent, {
          menu: {
            key: node.key,
            title: node.title,
            mode: 'add'
          }
        }, { size: 'md' })
        .subscribe(() => {
          this.loadMenuTree();
          this.cdr.detectChanges();
        });
    } else if (opt === 'edit') {
      this.modal
        .createStatic(
          SetupResourceMenuEditComponent,
          {
            menu: {
              id: node.key,
              name: node.title,
              url: node.origin.url,
              level: node.origin.level,
              position: node.origin.position,
              menuIcon: node.origin.icon,
              mode: 'edit'
            }
          },
          { size: 'md' }
        )
        .subscribe(() => {
          this.loadMenuTree();
        });
    } else if (opt === 'remove') {
      this.confirmModal = this.modalSrv.confirm({
        nzTitle: '删除确认?',
        nzContent: '是否确认删除菜单 [' + node.title + '] ?',
        nzOnOk: () => {
          let params = {
            menuId: node.key
          };
          this.http.post(`//base/service/security/admin/security-resource/menu-delete`, params).subscribe((res) => {
            if (res.success) {
              this.msgSrv.success('删除成功');
              this.loadMenuTree();
            } else {
              this.msgSrv.error(res.message);
            }
          });
        }
      });
    }
  }

  createPageElementResource() {
    if (this.optMenuId == null || this.optMenuId === '') {
      this.msgSrv.warning('请先选中菜单，再添加页面元素!');
    } else {
      this.modal
        .createStatic(
          SetupSecurityResourcePageElementEditComponent,
          { pageElement: {}, menuId: this.optMenuId, menuName: this.optMenuName },
          { size: 'md' }
        )
        .subscribe(() => this.st.reload());
    }
  }

  updatePageElementResource(item:any) {
    this.modal
      .createStatic(
        SetupSecurityResourcePageElementEditComponent,
        { pageElement: item, menuId: this.optMenuId, menuName: this.optMenuName },
        { size: 'md' }
      )
      .subscribe(() => this.st.reload());
  }
}
