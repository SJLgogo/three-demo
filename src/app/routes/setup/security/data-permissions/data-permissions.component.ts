/* eslint-disable */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzFormatEmitEvent, NzTreeComponent, NzTreeNode} from 'ng-zorro-antd/tree';
import {zip} from 'rxjs';

@Component({
  selector: 'app-setup-data-permissions',
  templateUrl: './data-permissions.component.html',
  styleUrls: ['./data-permission.component.less']
})
export class SetupDataPermissionsComponent implements OnInit, OnChanges {
  @Input('role') role: any;
  @Input('permissionUserId') permissionUserId: any;
  @ViewChild('dataPermissionsTreeComponent', {static: false}) dataPermissionsTreeComponent!: NzTreeComponent;
  @ViewChild("appUsePermission") appUsePermission: any;
  @Output() permissions = new EventEmitter<string>();
  checkedOrgIds: string[] = [];
  checkedPermissionIds: string[] = [];
  //默认选中的树
  defaultCheckedKeys = [];
  // 权限范围组列表列表
  selectedScope: any = [];
  appList = [
    {name: '组织机构', id: '1', category: 'org'},
    {name: '线路', id: '3', category: 'line'},
    {name: '站点', id: '2', category: 'station'},
    {name: '变电所', id: '4', category: 'main_power_supply'},
    {name: '停车场', id: '5', category: 'park'},
    {name: '车辆段', id: '6', category: 'depot'},
    {name: '控制中心', id: '7', category: 'cocc'}];
  // 内存中的组织数据范围权限选择数据
  checkedDataPermissionMap: Map<string, Set<string>> = new Map<string, Set<string>>();
  // ------------------------组织机构树
  optOrgId = null;
  optOrgName = null;
  orgTreeLoading = true;
  selectedOrgId = null;
  activedOrgNode: NzTreeNode | undefined;
  treeNodes: any = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.optDataPermission(this.selectedScope);
  }

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService, private cdr: ChangeDetectorRef) {
  }

  //获取某个权限
  loadPermissionList(category: string) {
    this.http.post(`/security/service/security/admin/scopePermission/findAllDTO`, {
      'roleId': this.role.id,
      'category': category,
      'userId':this.permissionUserId,
    }).subscribe((res) => {
      console.log('res', res);
      if (res.success) {
        this.selectedScope = res.data;
      }
    });
  }

  optDataPermission(scope: any) {
      this.selectedScope = scope;
      this.permissions.emit('');
      if (scope.category == 'org') {
        this.loadOrgTree();
      } else if (scope.category == 'line') {
        this.loadLine();
      } else if (scope.category == 'station' || scope.category == 'main_power_supply' || scope.category == 'park' || scope.category == 'depot' || scope.category == 'cocc') {
        this.loadLineTree();
      }
  }


  //递归遍历选中的数据
  findCheckedNode(nodeList: any, menuList: any, category: string): void {
    if (nodeList && nodeList.length > 0) {
      nodeList.forEach((res: any) => {
        menuList.push({'dataId': res.key, 'category': category, 'name': res.origin.title});
        if (res.children && res.children.length) {
          this.findCheckedNode(res.children, menuList, category);
        }
      });
    }
  }


  // 数据范围权限-某个角色可以看到哪些数据
  saveRolePermission(): void {
    const scopeVos: any[] = [];
    const checkedNodeList = this.dataPermissionsTreeComponent.getCheckedNodeList();
    this.findCheckedNode(checkedNodeList, scopeVos, this.selectedScope.category);
    const params = {
      roleId: this.role.id,
      scopeVos: scopeVos,
      category: this.selectedScope.category,
      userIds:[this.permissionUserId],
    };
    this.http.post(`/security/service/security/admin/scopePermission/assignRoleToScope`, params).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success(res.message);
      }
    });
  }


  // 点击加载下级树节点
  orgEvent(event: NzFormatEmitEvent): any {
    const node: any = event.node;
    if (event.eventName === 'expand') {
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        console.log('点击事件-操作');
        if (this.selectedScope.category == 'org') {
          this.http.get(`/org/service/organization/admin/organization/findChildOrgTree/` + node.key + '/' + node.origin.companyId).subscribe((res) => {
            if (res.success) {
              node.addChildren(res.data);
            }
          });
        } else if (this.selectedScope.category == 'station' || this.selectedScope.category == 'main_power_supply' || this.selectedScope.category == 'park' || this.selectedScope.category == 'depot' || this.selectedScope.category == 'cocc') {
          // this.loadLineTree();
        }
      }
    } else if (event.eventName === 'click') {
      console.log('点击事件-操作');
    } else if (event.eventName === 'check') {
      console.log('点击事件-操作',this.dataPermissionsTreeComponent.getCheckedNodeList(),this.dataPermissionsTreeComponent.getCheckedNodeList().length);
      // if(this.dataPermissionsTreeComponent.getCheckedNodeList().length>0){
      //   let Checked = [];
      //   for (let i = 0; i < this.dataPermissionsTreeComponent.getCheckedNodeList().length; i++) {
      //     // @ts-ignore
      //     Checked.push(this.dataPermissionsTreeComponent.getCheckedNodeList()[i].origin.title);
      //   }
      //   this.permissions.emit(Checked.toString());
      // }
    }
  }
  /**
   * 加载组织机构树
   */
  loadOrgTree(): void {
    if(!this.permissionUserId){
      this.msgSrv.error('请先选择人员');
    }
    else{
      zip(this.http.post(`/security/service/security/admin/scopePermission/findAllDTO`, {
        'roleId': this.role.id,
        'category': 'org',
        'userId':this.permissionUserId,
      }), this.http.get(`/org/service/organization/admin/organization/tree/child/root`)).subscribe(([orgScope, orgTree]) => {
        if (orgTree.success && orgScope.success) {
          this.treeNodes = [];
          if (orgScope.data != '' && orgScope.data != null) {
            this.defaultCheckedKeys = orgScope.data;
            orgTree.data.forEach((value: any) => {
              this.treeNodes.push(value);
            });
          } else {
            this.treeNodes = orgTree.data;
          }
        }
        this.cdr.detectChanges();
      });
    }
  }
  /**
   *  加载线路
   */
  loadLine(): void {
    if(!this.permissionUserId){
      this.msgSrv.error('请先选择人员');
    }
    else{
      zip(this.http.post(`/security/service/security/admin/scopePermission/findAllDTO`, {
        'roleId': this.role.id,
        'category': 'line',
        'userId':this.permissionUserId,
      }), this.http.get(`/service/metro-network/service/metro-network/metro-line/find-all`)).subscribe(([lineScope, lineTree]) => {
        if (lineTree.success && lineScope.success) {
          this.treeNodes = [];
          this.defaultCheckedKeys = lineScope.data;
          lineTree.data.forEach((value: any) => {
            const orgNode = {
              'title': value.name,
              'key': value.id,
              'isLeaf': true
            };
            this.treeNodes.push(orgNode);
            console.log(this.defaultCheckedKeys,'测试3');
          });
        }
        this.cdr.detectChanges();
      });
    }
  }
  /**
   *  节点类型（all():所有,station:车站,block:区间,power_supply:供电所,cocc:控制中心,depot:车辆段,park:停车场,depot_park:场段）,查询多个用,号隔开，默认值：all
   */
  loadLineTree(): void {
    if(!this.permissionUserId){
      this.msgSrv.error('请先选择人员');
    }
    else{
      this.http.post(`/security/service/security/admin/scopePermission/findScopeBaseData`, {
        'roleId': this.role.id,
        'category': this.selectedScope.category,
        'userId':this.permissionUserId,
      }).subscribe((res) => {
        if (res.success) {
          //下拉树赋值
          this.defaultCheckedKeys = res.data.selectedMenuKeys;
          this.treeNodes = res.data.treeNodes;
          console.log(this.defaultCheckedKeys,'this.defaultCheckedKeys',this.treeNodes)
        }
      });
    }
  }
  // ------------------------组织机构树
  openFolder(node: any): void {
  }
  ngOnInit() {
    // this.loadMenuPermissionList();
  }
  add() {
  }
}
