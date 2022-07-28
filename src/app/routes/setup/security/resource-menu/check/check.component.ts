/* eslint-disable */
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
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
  // 内存中的菜单和权限选择数据
  checkedMenuPermissionMap: Map<string, Set<string>> = new Map<string, Set<string>>();

  menuNodes = [];
  optMenuId = '';
  optMenuName = '无';
  orgTreeLoading = true;
  activedMenuNode!: NzTreeNode;
  confirmModal!: NzModalRef;
  halfCheckedIds: any = [];

  url = `//base/service/security/admin/authority/permission/page-element-table`;
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
    { title: '权限受控', index: 'isPermissionElement', type: 'badge' },
    { title: '权限名称', index: 'permissionName' },
    { title: '权限标识符', index: 'permissionIdentifier' },
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

  // selectedRole;
  ngOnInit() {
    // console.log('role:', this.role);
    // this.loadMenuTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('测试:', this.role);
    this.loadMenuTree();
  }

  // 表格点击事件
  permissionTableChange(e: any): void {
    if (e.type === 'checkbox') {
      const permissionIds = [];
      for (const p of e.checkbox) {
        if (!this.checkedMenuPermissionMap.has(p.menuId)) {
          this.msgSrv.error('请选中该权限所属的菜单!');
          this.st.clearCheck();
          return;
        } else {
          permissionIds.push(p.permissionId);
        }
      }
      this.updatePermissionCheck(e.checkbox);
      this.updateCheckIds();
    }
  }

  // 点击树节点
  menuEvent(event: NzFormatEmitEvent): void {
    // console.log('role222:', this.role);

    const node: any = event.node;
    if (event.eventName === 'click' || event.eventName === 'dblclick') {
      this.optMenuId = node.key;
      this.optMenuName = node.title;
      this.loadPageElementResourceTable(this.optMenuId);
      this.activedMenuNode = node;
    } else if (event.eventName === 'check') {
      const checkedMenuIdArray = this.getCheckedMenuIds(this.roleTreeComponent.getCheckedNodeList());

      console.log('checkedMenuIdArray:', checkedMenuIdArray);

      this.updateMenuCheckNodes(checkedMenuIdArray);
      this.updateCheckIds();
    }
  }

  // 加载组织机构树
  loadMenuTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`//base/service/security/admin/security-resource/menu-tree?menuId=root&roleId=` + this.role.id).subscribe((res) => {
      if (res.success) {
        // this.defaultCheckedKeys = ['ff808081751a80fd01751a9fdc770009'];
        console.log('res.data:', res.data);
        this.defaultCheckedKeys = res.data.selectedKeys;
        console.log('defaultCheckedKeys:', this.defaultCheckedKeys);

        this.menuNodes = res.data.tree;
        // this.defaultCheckedKeys = ['ff808081751a80fd01751a9fdc770009'];

        this.orgTreeLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  optMenu(node: any) {
    this.activedMenuNode = node;
    this.optMenuId = node.key;
    this.optMenuName = node.title;
  }

  // 菜单-根据已选中菜单节点更新内存数据
  updateMenuCheckNodes(checkedMenuIdArray: Set<string>): void {
    if (checkedMenuIdArray.size > 0) {
      // 删除已取消选择的数据
      const toRemoveIds = new Array();
      // console.log(this.checkedMenuPermissionMap);
      this.checkedMenuPermissionMap.forEach((value, menuId) => {
        // console.log('menuId',menuId,'has',checkedMenuIdArray.has(menuId));
        if (!checkedMenuIdArray.has(menuId)) {
          toRemoveIds.push(menuId);
        }
      });
      toRemoveIds.forEach((removeId) => this.checkedMenuPermissionMap.delete(removeId));
      // console.log('after remove ', this.checkedMenuPermissionMap);

      checkedMenuIdArray.forEach((menuId) => {
        if (!this.checkedMenuPermissionMap.has(menuId)) {
          this.checkedMenuPermissionMap.set(menuId, new Set<string>());
        }
      });
      // console.log('after set ', this.checkedMenuPermissionMap);
    } else {
      // 清空已经选择的所有信息
      this.checkedMenuPermissionMap.clear();
    }
  }

  // 菜单-获取所有已选择的节点id数组
  getCheckedMenuIds(treeNodes: NzTreeNode[]): Set<string> {
    const checkedMenuIds = new Set('');

    console.log('treeNodes', treeNodes);

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

  // 权限-根据已选中权限表格的数据航更新内存数据
  updatePermissionCheck(checkPermissionRow: any): void {
    const permissionIdSet = new Set<string>();
    if (checkPermissionRow.length > 0) {
      checkPermissionRow.forEach((permissionRow: any) => {
        permissionIdSet.add(permissionRow.permissionId);
      });
      this.checkedMenuPermissionMap.set(checkPermissionRow[0].menuId, permissionIdSet);
    }
  }

  updateCheckIds(): void {
    this.checkedMenuIds = [];
    this.checkedPermissionIds = [];
    this.checkedMenuPermissionMap.forEach((value, key, map) => {
      this.checkedMenuIds.push(key);
      value.forEach((permissionId) => this.checkedPermissionIds.push(permissionId));
    });
    this.cdr.detectChanges();
  }

  saveCheckMenu(): void {
    // 获取半选状态的数据
    const halfChecked = this.roleTreeComponent.getHalfCheckedNodeList();

    console.log('checkedMenuIds:', this.checkedMenuIds);
    console.log('this.checkedMenuIds.length:', this.checkedMenuIds.length);

    if (this.checkedMenuIds.length === 0) {
      this.msgSrv.warning('没有修改任何菜单权限,请改变数据后提交！');
      return;
    }

    console.log('halfChecked:', halfChecked);

    halfChecked.forEach((value, number) => {
      console.log('value:', value.key, 'has:', number);
      this.halfCheckedIds.push(value.key);
    });

    const requestParams = {
      roleId: this.role.id,
      menuResourceIds: this.checkedMenuIds.join(','),
      permissionIds: this.checkedPermissionIds.join(','),
      halfCheckedIds: this.halfCheckedIds.join(',')
    };

    console.log('requestParams:', requestParams);
    this.http.post(`//base/service/security/admin/authority/role/assign-permissions`, requestParams).subscribe((res) => {
      this.msgSrv.success(res.message);
    });
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }
}
