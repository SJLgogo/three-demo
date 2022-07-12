/* eslint-disable */
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { each } from '@antv/util';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNode } from 'ng-zorro-antd/tree';
import { SetupSecurityDataPermissionsEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-setup-data-permissions',
  templateUrl: './data-permissions.component.html',
  styleUrls: ['./data-permission.component.less']
})
export class SetupDataPermissionsComponent implements OnInit, OnChanges {
  @Input('role') role: any;

  checkedOrgIds: string[] = [];
  checkedPermissionIds: string[] = [];
  // 权限范围组列表列表
  selectedScope: any = null;
  appList = [{ name: '组织机构', id: '1', category: 'org' }, { name: '站点', id: '2', category: 'station' }, {
    name: '线路',
    id: '2',
    category: 'line'
  }];
  // 内存中的组织数据范围权限选择数据
  checkedDataPermissionMap: Map<string, Set<string>> = new Map<string, Set<string>>();
  // ------------------------组织机构树
  optOrgId = null;
  optOrgName = null;
  orgTreeLoading = true;
  selectedOrgId = null;
  activedOrgNode: NzTreeNode | undefined;
  orgNodes: any = [];

  ngOnChanges(changes: SimpleChanges): void {
  }

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService, private cdr: ChangeDetectorRef) {
  }

  loadAppList() {
    this.selectedScope = {};
    // this.http.get(`/service/security/admin/scopePermission/findAll`).subscribe((res) => {
    //   if (res.success) {
    //     this.appList = res.data;
    //   }
    // });
  }

  optDataPermission(scope: any) {
    // console.log('选择应用：：：：：', scope);
    this.selectedScope = scope;
    this.loadOrgTree();
  }

  // 数据权限-角色-操作按钮权限授权
  saveRolePermission(): void {
    const params = {
      roleId: this.role.id,
      scopeId: this.selectedScope.id,
      checkedOrgIds: this.checkedOrgIds.join(),
      category: this.selectedScope.category
    };
    this.http.post(`/service/security/admin/scopePermission/update`, params).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success(res.message);
      }
    });
  }

  /**
   * 添加权限范围组
   */
  addPermissionScope() {
    this.modal
      .createStatic(
        SetupSecurityDataPermissionsEditComponent,
        {
          record: {},
          i: {}
        },
        { size: 'md' }
      )
      .subscribe((res) => {
        this.loadAppList();
      });
  }

  @ViewChild('dataPermissionsTreeComponent', { static: false }) dataPermissionsTreeComponent!: NzTreeComponent;

  // 点击加载下级树节点
  orgEvent(event: NzFormatEmitEvent): void {
    const node: any = event.node;
    if (event.eventName === 'expand') {
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        this.http.get(`/org/service/organization/admin/organization/tree/child/` + node.key + '/' + node.origin.corpId).subscribe((res) => {
          if (res.success) {
            node.addChildren(res.data);
          }
        });
      }
    } else if (event.eventName === 'click') {
      // this.activedOrgNode = node;
      // this.selectedOrgId = node.key;
      // this.loadEmployeeTable('organization', '', this.selectedOrgId, null, null, null, null);
      // this.employeeTableTitle = '【员工信息】' + node.title;
      // this.activedOrgNode = node;
    } else if (event.eventName === 'check') {
      // console.log('sssssssss::', this.dataPermissionsTreeComponent.getCheckedNodeList());

      const checkedMenuIdArray = this.getCheckedMenuIds(this.dataPermissionsTreeComponent.getCheckedNodeList());
      // console.log("checkedMenuIdArray:",checkedMenuIdArray);
      this.updateDataPermissionsCheckNodes(checkedMenuIdArray);
      this.updateCheckIds();
      // console.log('checkedOrgIds:', this.checkedOrgIds);
    }
  }

  // 数据范围权限-获取所有已选择的节点id数组
  getCheckedMenuIds(treeNodes: NzTreeNode[]): Set<string> {
    const checkedOrgIds = new Set('');
    treeNodes.forEach((treeNode, index) => {
      checkedOrgIds.add(treeNode.key);
      if (treeNode.children.length > 0) {
        this.getCheckedMenuIds(treeNode.children).forEach((childTreeNodeKey) => {
          checkedOrgIds.add(childTreeNodeKey);
        });
      }
    });

    return checkedOrgIds;
  }

  // 组织范围-根据已选中组织节点更新内存数据
  updateDataPermissionsCheckNodes(checkedMenuIdArray: Set<string>): void {
    if (checkedMenuIdArray.size > 0) {
      // 删除已取消选择的数据
      const toRemoveIds = new Array();
      this.checkedDataPermissionMap.forEach((value, menuId) => {
        if (!checkedMenuIdArray.has(menuId)) {
          toRemoveIds.push(menuId);
        }
      });
      toRemoveIds.forEach((removeId) => this.checkedDataPermissionMap.delete(removeId));
      checkedMenuIdArray.forEach((menuId) => {
        if (!this.checkedDataPermissionMap.has(menuId)) {
          this.checkedDataPermissionMap.set(menuId, new Set<string>());
        }
      });
      // console.log('after set ', this.checkedMenuPermissionMap);
    } else {
      // 清空已经选择的所有信息
      this.checkedDataPermissionMap.clear();
    }
  }

  updateCheckIds(): void {
    this.checkedOrgIds = [];
    this.checkedPermissionIds = [];
    this.checkedDataPermissionMap.forEach((value, key, map) => {
      this.checkedOrgIds.push(key);
      value.forEach((permissionId) => this.checkedPermissionIds.push(permissionId));
    });
    this.cdr.detectChanges();
  }

  // 加载组织机构树
  loadOrgTree(): void {
    // this.orgTreeLoading = true;

    // console.log('selectedScope:::', this.selectedScope);

    this.http.get(`/org/service/organization/admin/organization/tree/child/root`).subscribe((res) => {
      if (res.success) {
        this.orgNodes = [];
        if (this.selectedScope.orgIds != '' && this.selectedScope.orgIds != null) {
          res.data.forEach((value: any) => {
            const orgNode = this.orgTree1(value, this.selectedScope.orgIds);
            this.orgNodes.push(orgNode);
            console.log('orgNode:', orgNode);
          });
        } else {
          this.orgNodes = res.data;
        }

        this.cdr.detectChanges();
        // this.dataPermissionsTreeComponent.re
        console.log('this.orgNodes:', this.orgNodes);

        // this.orgNodes

        this.orgTreeLoading = false;
      }
    });
  }

  // orgTree(orgNodes,scopeOrgIds){
  //   orgNodes.forEach((org)=>{
  //     if(scopeOrgIds.indexOf(org.key) != -1 ){
  //       org.check=true
  //     }
  //     if(org.children.size>0){
  //       this.orgTree(org.children,scopeOrgIds);
  //     }
  //     console.log("org::",org);
  //     return org;
  //   });
  // }

  // //先定义一下数据类型
  //
  //   interface entity {
  //
  //   id: number;
  //
  //   title: string;
  //
  //   children?: children[];
  //
  // }
  //
  // //定义子级数据类型
  //
  // interface children {
  //
  //   id: number;
  //
  //   title: string;
  //
  //   children?: children[];
  //
  // }
  //
  //   const returnft = (it: entity) => {
  //
  //     if (it.children && it.children.length) {
  //
  //       it.title="11"     //所有遍历到的title都改成“11”
  //
  //       it.children.map(res=>returnft(res))    //再次调用本身
  //
  //     }
  //
  //     return it;
  //
  //   }

  /**
   * 递归获取所有的
   */
  private orgTree1(orgNode: any, scopeOrgIds: string): any {
    // console.log("777777777777777::",scopeOrgIds);
    // console.log("9999::",orgNode);

    if (scopeOrgIds.indexOf(orgNode.key) != -1) {
      orgNode.checked = true;
    }

    each(orgNode.children, (v) => {
      orgNode.children.concat(this.orgTree1(v, scopeOrgIds));
    });

    return orgNode;
  }

  // ------------------------组织机构树
  openFolder(node: any): void {
  }

  ngOnInit() {
    this.loadAppList();
  }

  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }
}
