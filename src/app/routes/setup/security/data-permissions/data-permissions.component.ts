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
  selectedScope: any = [];
  appList = [
    { name: '组织机构', id: '1', category: 'org' },
    { name: '线路', id: '3', category: 'line' },
    { name: '站点', id: '2', category: 'station' },
    { name: '变电所', id: '4', category: 'main_power_supply' },
    { name: '停车场', id: '5', category: 'main_power_supply' },
    { name: '车辆段', id: '6', category: 'main_power_supply' },
    { name: '控制中心', id: '7', category: 'main_power_supply' }];
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
    // this.http.post(`/security/service/security/admin/scopePermission/findAllDTO`).subscribe((res) => {
    //   if (res.success) {
    //     // this.selectedScope = res.data;
    //   }
    // });
  }

  optDataPermission(scope: any) {
    this.selectedScope = scope;
    if (scope.category == 'org') {
      this.loadOrgTree();
    } else if (scope.category == 'line') {
      this.loadLine();
    } else {
      // this.loadLineTree()
    }

  }

  // 数据权限-角色-操作按钮权限授权
  saveRolePermission(): void {
    const params = {
      roleId: this.role.id,
      scopeId: this.selectedScope.id,
      checkedOrgIds: this.checkedOrgIds.join(),
      category: this.selectedScope.category
    };
    this.http.post(`//base/service/security/admin/scopePermission/update`, params).subscribe((res) => {
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
    } else if (event.eventName === 'check') {
      const checkedMenuIdArray = this.getCheckedMenuIds(this.dataPermissionsTreeComponent.getCheckedNodeList());
      this.updateDataPermissionsCheckNodes(checkedMenuIdArray);
      this.updateCheckIds();
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

  /**
   * 加载组织机构树
   */
  loadOrgTree(): void {
    this.http.get(`/org/service/organization/admin/organization/tree/child/root`).subscribe((res) => {
      if (res.success) {
        this.orgNodes = [];
        if (this.selectedScope.orgIds != '' && this.selectedScope.orgIds != null) {
          res.data.forEach((value: any) => {
            const orgNode = this.orgTree1(value, this.selectedScope.orgIds);
            this.orgNodes.push(orgNode);
          });
        } else {
          this.orgNodes = res.data;
        }
        this.cdr.detectChanges();
        this.orgTreeLoading = false;
      }
    });
  }


  /**
   *  加载线路
   */
  loadLine(): void {
    this.http.get(`/service/metro-network/service/metro-network/metro-line/find-all`).subscribe((res) => {
      if (res.success) {
        this.orgNodes = [];
        res.data.forEach((value: any) => {
          const orgNode = { 'title': value.name, 'key': value.id };
          this.orgNodes.push(orgNode);
        });

        this.cdr.detectChanges();
        this.orgTreeLoading = false;
      }
    });
  }


  /**
   *  节点类型（all():所有,station:车站,block:区间,power_supply:供电所,cocc:控制中心,depot:车辆段,park:停车场,depot_park:场段）,查询多个用,号隔开，默认值：all
   */
  loadLineTree(lineId: string, category: string): void {
    this.http.post(`/service/metro-network/service/metro-network/rpc/line/nodes`, {
      'metroLineId': lineId,
      'category': category
    }).subscribe((res) => {
      if (res.success) {
        this.orgNodes = [];
        if (this.selectedScope.orgIds != '' && this.selectedScope.orgIds != null) {
          res.data.forEach((value: any) => {
            const orgNode = this.orgTree1(value, this.selectedScope.orgIds);
            this.orgNodes.push(orgNode);
          });
        } else {
          this.orgNodes = res.data;
        }
        this.cdr.detectChanges();
        this.orgTreeLoading = false;
      }
    });
  }


  /**
   * 递归获取所有的
   */
  private orgTree1(orgNode: any, scopeOrgIds: string): any {
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
  }
}
