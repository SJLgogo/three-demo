import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { fn, TreeNode, variable, Person, Organization, selected, DepartmentClass } from './department.interface';
import { RxjsChangeService } from '../../rxjsChange.service';
import { Unsubscribable } from 'rxjs';

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
  pageSize: variable<number>;
  @Input()
  singleChoice: boolean = false;
  @Input()
  selectList: selected[] = [];
  @Output()
  selectListChange = new EventEmitter();

  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private modalRef: NzModalRef,
    private msgSrv: NzModalService,
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
    console.log(this.singleChoice);
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
      mode: this.chooseMode
    };
    if (this.searchValue === '' || this.searchValue === 'undefined') {
      this.showSearchResult = false;
    } else {
      this.orgTreeLoading = true;
      this.showSearchResult = true;
      this.http.post(`/org/service/organization/admin/account/global-search`, params).subscribe((res: any) => {
        if (res.success) {
          this.panels = res.data;
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
          res.success && node.addChildren(res.data);
        });
    }
  }

  treeNodeClick(node: NzTreeNode): void {
    switch (this.chooseMode) {
      case 'employee':
        this.addPerson(node);
        break;
      case 'organization':
        this.addOrganization(node);
        break;
      case 'department':
        this.addSelectedDepartmentList(node);
        break;
    }
  }

  optSearchResult(value: any) {
    this.addSelectedPersonList(
      value.type,
      value.loginUserId.toString(),
      value.name,
      '',
      value.projectId,
      value.projectName,
      value.thirdPartyAccountUserId
    );
  }

  addSelectedPersonList(
    category: string,
    id: string,
    name: string,
    corpId: string,
    projectId: string,
    projectName: string,
    thirdPartyAccountUserId: variable<string>
  ) {
    const person: Person = {
      name: name,
      id: id,
      corpId: corpId,
      projectId: projectId,
      projectName: projectName,
      category: category
    };
    this.selected.set(id, person);
    this.getSelectedList<Person>(this.selected as Map<string, Person>);
  }

  getSelectedList<T>(map: Map<string, T>): void {
    this.selectList = [];
    map.forEach((item: T) => this.selectList.push(item as unknown as Person as Organization));
    Promise.all([this.emitSelectFn(), this.cacheSelectList()]);
    console.log(this.selectList);
  }

  receiveDeleteId(): void {
    this.unSub = this.rxjsChangeService.subscribe((res: Pick<Person, 'id' | 'category'>) => {
      this.selected.delete(res.id);
      this.getSelectedList<selected>(this.selected as Map<string, selected>);
      this.judgeCommonDepartmentSelect(this.commonDepartments);
    });
  }

  addSelectedOrganizationList(category: string, id: string, name: string): void {
    const organization: Organization = {
      name: name,
      id: id,
      category: category
    };
    this.selected.set(id, organization);
    this.getSelectedList<Organization>(this.selected as Map<string, Organization>);
  }

  addSelectedDepartmentList(node: NzTreeNode): void {
    if (node.origin['category'] === 'employee') {
      this.addPerson(node);
    }
    if (node.origin['category'] === 'organization') {
      this.addSelectedOrganizationList(node.origin!['category'], node.key, node.title);
    }
  }

  emitSelectFn(): void {
    this.selectListChange.emit(this.selectList);
  }

  cacheSelectList(): void {
    localStorage.setItem(this.functionName!, JSON.stringify(this.selectList));
  }

  addPerson(node: NzTreeNode): void {
    if (this.chooseMode === node.origin['category'] || this.chooseMode === 'department') {
      this.addSelectedPersonList(
        node.origin!['category'],
        node.key,
        node.title,
        node.origin['corpId'],
        node.parentNode!['key'],
        node.parentNode!['title'],
        node.origin['thirdPartyAccountUserId']
      );
    }
  }

  addOrganization(node: NzTreeNode): void {
    if (this.chooseMode === node.origin['category'] || this.chooseMode === 'department') {
      this.addSelectedOrganizationList(node.origin!['category'], node.key, node.title);
    }
  }

  commonDepartmentObtain(): Promise<Organization[]> {
    return new Promise<Organization[]>(resolve => {
      const appId = localStorage.getItem('appId');
      const postData = { pageNo: 0, pageSize: this.pageSize, appId: appId, functionId: this.functionName };
      this.http.post('/org/service/organization/SelectOrgTotalController/findByAppIdAndFunctionId', postData).subscribe(res => {
        this.commonDepartments = res.data.map((item: any) => {
          return {
            id: item?.id,
            category: 'organization',
            name: item?.name,
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
    this.commonDepartments[idx].selected = true;
    this.addSelectedOrganizationList('organization', item.id as string, item.name as string);
  }

  ngOnDestroy(): void {
    this.unSub && this.unSub.unsubscribe();
  }
}
