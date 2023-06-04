import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { fn, TreeNode, variable, Person, Organization, selected, DepartmentClass, Common } from './department.interface';
import { RxjsChangeService } from '../../rxjsChange.service';
import { Unsubscribable } from 'rxjs';
import { add } from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.less']
})
export class DepartmentComponent extends DepartmentClass implements OnInit, OnDestroy {
  @Input()
  chooseMode: variable<string>;
  @Input()
  functionName: variable<string>;
  @Input()
  externalParentId: variable<string>;
  @Input()
  externalCompanyId: variable<string>;
  @Input()
  pageSize: variable<number>;
  @Input()
  selectList: selected[] = [];
  @Input()
  singleChoice: boolean = false;
  @Output()
  selectListChange = new EventEmitter();

  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private modalRef: NzModalRef,
    private msgSrv: NzModalService,
    private msg: NzMessageService,
    private rxjsChangeService: RxjsChangeService
  ) {
    super();
  }

  unSub: variable<Unsubscribable>;
  orgTreeLoading = true;
  orgNodes: TreeNode[] = [];
  initList: fn[] = [this.loadOrgTree, this.receiveDeleteId, this.getSelectedByCatch, this.renderSelectList];
  searchValue: variable<string>;
  activeNode: any;
  panels: any = [];
  timer: any;
  showSearchResult = false;
  selected: Map<string, selected> = new Map<string, selected>();
  commonDepartments: Organization[] = [];

  ngOnInit(): void {
    Promise.all(this.initList.map(fn => fn.call(this)));
    Promise.resolve(this.commonDepartmentObtain()).then(res => this.judgeCommonDepartmentSelect(res));
  }

  loadOrgTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/org/service/organization/admin/organization/tree/child/root`).subscribe((res: any) => {
      res.success ? (this.orgNodes = res.data) : this.msgSrv.warning(res.message);
      this.orgTreeLoading = false;
    });
  }

  inputChange(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.globalSearch();
      clearTimeout(this.timer);
    }, 600);
  }

  globalSearch() {
    const params = {
      searchValue: this.searchValue,
      mode: [this.chooseMode]
    };
    if (this.searchValue === '' || this.searchValue === 'undefined') {
      this.showSearchResult = false;
    } else {
      this.orgTreeLoading = true;
      this.showSearchResult = true;
      this.http.post(`/org/service/organization/admin/account/global-search`, params).subscribe((res: any) => {
        if (res.success) {
          this.panels = res.data;
          if (!this.panels[0]) {
            this.msg.warning('在您的权限范围内未搜索到！')
          }

          this.panels.forEach((panel: any, idx: number) => {
            if (this.chooseMode == 'employee') {
              panel.childPanel = panel?.childPanel?.filter((i: any) => i.type == 'employee')
              panel.childPanel.length == 0 ? this.panels.splice(idx, 1) : ''
            }
            if (this.chooseMode == 'org') {
              panel.childPanel = panel?.childPanel?.filter((i: any) => i.type == 'organization')
              panel.childPanel.length == 0 ? this.panels.splice(idx, 1) : ''
            }
          })

          this.panels[0]?.childPanel.forEach((i: any) => {
            i.phone = i.mobilePhone ? i.mobilePhone : i.jobNumber ? i.jobNumber : ''
            if (i.type == 'employee') {
              i.orgName = i.org?.map((val: any) => {
                const index = val.pathName.indexOf('/');
                return val.pathName.substring(index + 1);
              }).join(';')
            }
          })


        }
        this.orgTreeLoading = false;
      });
    }
  }

  orgEvent(event: NzFormatEmitEvent): void {
    const node: NzTreeNode | null | undefined = event.node;
    const eventName: string = event.eventName;
    switch (eventName) {
      case 'click':
        this.treeNodeClick(node as NzTreeNode);
        break;
      case 'expand':
        this.treeExpand(node as NzTreeNode);
        break;
    }
  }

  treeExpand(node: NzTreeNode): void {
    if (node!.getChildren().length === 0 && node.isExpanded) {
      this.http
        .get(`/org/service/organization/admin/organization/tree/child/` + node.origin!.key + '/' + node.origin['companyId'])
        .subscribe((res: any) => {
          console.log(this.chooseMode);
          if (this.chooseMode == 'org') {
            const departmentList = this.removePerson(res.data)
            console.log(departmentList);
            node.addChildren(departmentList);
            return;
          } else {
            res.success && node.addChildren(res.data);
          }
        });
    }
  }

  /** 
   * 递归移除人员
   */
  removePerson(list: any): any {
    const res = list.filter((i: any) => i.category == 'org')
    list.forEach((val: any) => {
      if (val.children?.length) {
        val.children = this.removePerson(val.children)
      }
    })
    return res
  }


  treeNodeClick(node: NzTreeNode): void {
    switch (this.chooseMode) {
      case 'employee':
        this.addPerson(node);
        break;
      case 'org':
        this.addOrganization(node);
        break;
      case 'department':
        this.addSelectedDepartmentList(node);
        break;
    }
  }

  optSearchResult(value: any) {
    const name = value.type == "organization" ? value.pathName : value.loginUserName
    if (value.isDel && value.type == 'employee') {
      this.msg.warning(`${name}已被删除,无法选择`)
      return
    }
    this.addSelectedPersonList(
      value,
      value.type,
      value.loginUserId?.toString() ? value.loginUserId?.toString() : value.id?.toString(),
      name,
      '',
      value.departmentId,
      value.departmentName,
      value.companyId,
      value.companyName,
      value.thirdPartyAccountUserId,
      value.org?.map((item: any) => ({
        label: item.name,
        value: item.id
      }))
    );
  }

  addSelectedPersonList(
    addItem: any,
    category: string,
    id: string,
    name: string,
    corpId: string,
    departmentId: string,
    departmentName: string,
    companyId: string,
    companyName: string,
    thirdPartyAccountUserId: variable<string>,
    orgs: Common[]
  ) {
    const person: Person = {
      name: name,
      id: id,
      corpId: corpId,
      departmentId: departmentId,
      departmentName: departmentName,
      category: category,
      companyId: companyId,
      companyName: companyName,
      orgs: orgs,
      avatar: addItem.avatar,
      jobNumber: addItem.jobNumber,
      mobilePhone: addItem.mobilePhone,
    };
    this.singleChoice ? this.selected.clear() : '';
    this.selected.set(id, person);
    this.getSelectedList<Person>(this.selected as Map<string, Person>);
  }

  getSelectedList<T>(map: Map<string, T>): void {
    this.selectList = [];
    map.forEach((item: T) => this.selectList.push(item as unknown as Person as Organization));
    Promise.all([this.emitSelectFn()]);
  }

  receiveDeleteId(): void {
    this.unSub = this.rxjsChangeService.subscribe((res: Pick<Person, 'id' | 'category'>) => {
      this.selected.delete(res.id);
      this.getSelectedList<selected>(this.selected as Map<string, selected>);
      this.judgeCommonDepartmentSelect(this.commonDepartments);
    });
  }

  addSelectedOrganizationList(category: string, id: string, name: string, companyId: string, companyName: string): void {
    const organization: Organization = {
      name: name,
      id: id,
      category: category,
      companyId: companyId,
      companyName: companyName
    };
    this.singleChoice ? this.selected.clear() : '';
    this.selected.set(id, organization);
    this.getSelectedList<Organization>(this.selected as Map<string, Organization>);
  }

  addSelectedDepartmentList(node: NzTreeNode): void {
    if (node.origin['category'] === 'employee') {
      this.addPerson(node);
    }
    if (node.origin['category'] === 'org' || node.origin['category'] === 'organization') {
      this.addSelectedOrganizationList(
        node.origin!['category'],
        node.key,
        node.title,
        node.origin['companyId'],
        node.origin['companyName']
      );
    }
  }

  emitSelectFn(): void {
    this.selectListChange.emit(this.selectList);
  }

  cacheSelectList(): void {
    localStorage.setItem(this.functionName!, JSON.stringify(this.selectList));
  }

  addPerson(node: NzTreeNode): void {
    console.log(node);
    if (this.chooseMode === node.origin['category'] || this.chooseMode === 'department') {
      (node as any).avatar = node.icon
      this.addSelectedPersonList(
        node,
        node.origin!['category'],
        node.key,
        node.title,
        node.origin['corpId'],
        node.parentNode!['key'],
        node.parentNode!['title'],
        node.origin['companyId'],
        node.origin['companyName'],
        node.origin['thirdPartyAccountUserId'],
        [{ label: node.parentNode!['title'], value: node.parentNode!['key'] }]
      );
    }
  }

  addOrganization(node: NzTreeNode): void {
    if (
      this.chooseMode === node.origin['category'] ||
      this.chooseMode === 'department' ||
      (this.chooseMode == 'org' && node.origin['category'] == 'organization')
    ) {
      this.addSelectedOrganizationList(
        node.origin!['category'],
        node.key,
        node.title,
        node.origin['companyId'],
        node.origin['companyName']
      );
    }
  }

  commonDepartmentObtain(): Promise<Organization[]> {
    return new Promise<Organization[]>(resolve => {
      const appId = localStorage.getItem('appId');
      const postData = { pageNo: 0, pageSize: this.pageSize, appId: appId, functionId: this.functionName };
      this.http.post('/org/service/organization/SelectOrgTotalController/findByAppIdAndFunctionId', postData).subscribe(res => {
        this.commonDepartments = res.data.map((item: any) => {
          return {
            id: item.id,
            category: 'organization',
            name: item.name,
            companyId: item.companyId,
            companyName: item.companyName,
            selected: false
          };
        });
        resolve(this.commonDepartments);
      });
    });
  }

  renderSelectList(): void {
    this.selectList.length && this.selectList.forEach(item => this.selected.set(item.id as string, item));
  }

  judgeCommonDepartmentSelect(commonDepartments: Organization[]): void {
    const selectIds: string[] = this.selectList.map(item => item.id!);
    commonDepartments.forEach(item =>
      selectIds.includes(item.id as string) ? ((item as Organization).selected = true) : ((item as Organization).selected = false)
    );
  }

  getSelectedByCatch(): void {
    const res = localStorage.getItem(this.functionName!) ? JSON.parse(<string>localStorage.getItem(this.functionName!)) : [];
    res.forEach((item: selected) => this.selected.set(item.id as string, item));
  }
  commonDepartmentsClick(item: selected, idx: number): void {
    if (this.singleChoice && this.selected.size >= 1) {
      return;
    }
    if (this.chooseMode != 'department' && this.chooseMode != 'org') {
      return;
    }
    this.commonDepartments[idx].selected = true;
    this.addSelectedOrganizationList('org', item.id as string, item.name as string, item.companyId as string, item.companyName as string);
  }

  isEmployee(): string {
    return this.chooseMode == 'employee' ? 'employee' : '';
  }

  ngOnDestroy(): void {
    this.unSub && this.unSub.unsubscribe();
  }
}