/* eslint-disable */
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-setup-security-resource-menu-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.less']
})
export class SetupSecurityResourceMenuCheckComponent implements OnInit, OnChanges {
  @Input('role') role: any;
  @ViewChild('roleTreeComponent', { static: false }) roleTreeComponent!: NzTreeComponent;

  defaultCheckedKeys = [];
  checkedMenuIds: any = [];
  checkedPermissionIds: any = [];
  //选中的按钮权限id
  checkedButtonPermissionIds: any = [];
  // 内存中的菜单和权限选择数据
  checkedMenuPermissionMap: Map<string, Set<string>> = new Map<string, Set<string>>();

  menuNodes = [];
  optMenuId = '';
  optMenuName = '无';
  orgTreeLoading = true;
  activeMenuNode!: NzTreeNode;
  confirmModal!: NzModalRef;
  halfCheckedIds: any = [];

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
    { title: '', type: 'checkbox', index: 'permissionId' },
    { title: '元素名称', index: 'name' },
    { title: '页面标识符', index: 'identifier' },
    { title: '备注', index: 'remark' }
  ];

  loadPageElementResourceTable(menuId: string): void {
    if (this.st != null) {
      this.st.reload({
        menuId: this.optMenuId
      });
    }
  }

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private cdr: ChangeDetectorRef,
    private modalSrv: NzModalService
  ) {
  }

  ngOnInit() {
    // this.loadMenuTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadMenuTree();
  }

  // 表格点击事件
  permissionTableChange(e: any): void {
    if (e.type === 'checkbox') {
      //点击一行的数据
      for (const permission of e.checkbox) {
        // if (!this.checkedMenuPermissionMap.has(p.menuId)) {
        //   this.msgSrv.error('请选中该权限所属的菜单!');
        //   this.st.clearCheck();
        //   return;
        // } else {
        //   permissionIds.push(p.permissionId);
        // }
        this.checkedButtonPermissionIds.push(permission.id);
      }
    }
  }


  // 点击树节点
  menuEvent(event: NzFormatEmitEvent): void {
    const node: any = event.node;
    if (event.eventName === 'click' || event.eventName === 'dblclick') {
      this.optMenuId = node.key;
      this.optMenuName = node.title;
      this.loadPageElementResourceTable(this.optMenuId);
      this.activeMenuNode = node;
    } else if (event.eventName === 'check') {
      const checkedMenuIdArray = this.getCheckedMenuIds(this.roleTreeComponent.getCheckedNodeList());
      // console.log('checkedMenuIdArray:', checkedMenuIdArray);
      this.updateMenuCheckNodes(checkedMenuIdArray);
      this.updateCheckIds();
    }
  }

  // 加载角色对应的菜单数据
  loadMenuTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/security/service/security/admin/security-resource/menu-tree/` + this.role.id).subscribe((res) => {
      if (res.success) {
        //下拉树赋值
        this.defaultCheckedKeys = res.data.selectedMenuKeys;
        //按钮选中赋值
        this.checkedButtonPermissionIds = res.data.selectedButtonKeys;
        this.menuNodes = res.data.tree;
        this.orgTreeLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  // 数据前端再处理一次
  dataProcess = (data: STData[]): STData[] => {
    return data.map((i: any, index) => {
      if (this.checkedButtonPermissionIds != null && this.checkedButtonPermissionIds.includes(i.id)) {
        i.checked = true;
      }
      return i;
    });
  };


  optMenu(node: any) {
    this.activeMenuNode = node;
    this.optMenuId = node.key;
    this.optMenuName = node.title;
  }

  // 菜单-根据已选中菜单节点更新内存数据
  updateMenuCheckNodes(checkedMenuIdArray: Set<string>): void {
    if (checkedMenuIdArray.size > 0) {
      // 删除已取消选择的数据
      const toRemoveIds = new Array();
      this.checkedMenuPermissionMap.forEach((value, menuId) => {
        if (!checkedMenuIdArray.has(menuId)) {
          toRemoveIds.push(menuId);
        }
      });
      toRemoveIds.forEach((removeId) => this.checkedMenuPermissionMap.delete(removeId));
      checkedMenuIdArray.forEach((menuId) => {
        if (!this.checkedMenuPermissionMap.has(menuId)) {
          this.checkedMenuPermissionMap.set(menuId, new Set<string>());
        }
      });
    } else {
      // 清空已经选择的所有信息
      this.checkedMenuPermissionMap.clear();
    }
  }

  // 菜单-获取所有已选择的节点id数组
  getCheckedMenuIds(treeNodes: NzTreeNode[]): Set<string> {
    const checkedMenuIds = new Set('');
    treeNodes.forEach((treeNode, index) => {
      checkedMenuIds.add(treeNode.key);
      if (treeNode.children.length > 0) {
        this.getCheckedMenuIds(treeNode.children).forEach((childTreeNodeKey) => {
          checkedMenuIds.add(childTreeNodeKey);
        });
      }
    });

    return checkedMenuIds;
  }


  //获取选中的资源id
  updateCheckIds(): void {
    this.checkedMenuIds = [];
    this.checkedMenuPermissionMap.forEach((value, key, map) => {
      this.checkedMenuIds.push(key);
    });
    this.cdr.detectChanges();
  }


  //递归遍历选中的菜单
  findCheckedNode(nodeList: any, menuList: string []): void {
    if (nodeList && nodeList.length > 0) {
      nodeList.forEach((res: any) => {
        menuList.push(res.key);
        if (res.children && res.children.length) {
          this.findCheckedNode(res.children, menuList);
        }
      });
    }
  }


  saveCheckMenu(): void {
    // 获取半选状态的数据
    const halfChecked = this.roleTreeComponent.getHalfCheckedNodeList();

    halfChecked.forEach((value, number) => {
      this.halfCheckedIds.push(value.key);
    });

    const checkedNodeList = this.roleTreeComponent.getCheckedNodeList();
    if ((!checkedNodeList || checkedNodeList.length === 0) && (!this.checkedButtonPermissionIds || this.checkedButtonPermissionIds.length === 0)) {
      this.msgSrv.error('请选择菜单或菜单对应的按钮、标签！');
      return;
    }

    const menuIds: any[] = [];
    this.findCheckedNode(checkedNodeList, menuIds);


    const requestParams = {
      roleId: this.role.id,
      permissionIds: this.checkedButtonPermissionIds.concat(menuIds),
      halfCheckedIds: this.halfCheckedIds
    };

    this.http.post(`/security/service/security/admin/authority/role/assign-permissions`, requestParams).subscribe((res) => {
      this.msgSrv.success(res.message);
    });
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }
}
