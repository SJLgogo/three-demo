import {Component, OnInit} from '@angular/core';
import {NzFormatEmitEvent, NzTreeNode} from "ng-zorro-antd/tree";
import {_HttpClient, ModalHelper} from "@delon/theme";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {DepartmentInterface, fn, TreeNode, variable, childNode} from "./department.interface";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.less']
})
export class DepartmentComponent extends DepartmentInterface implements OnInit {

  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private modalRef: NzModalRef,
    private msgSrv: NzModalService,
  ) {
    super()
  }

  chooseMode: variable<string>; // 员工选择模式
  orgTreeLoading = true
  orgNodes: TreeNode[] = [];
  initList: fn[] = [this.loadOrgTree]
  searchValue: variable<string>;
  activeNode: any;
  panels: any = [];
  mode: any = [];
  timer: any;
  showSearchResult = false;
  selectedPerson: Map<string,any> = new Map<string,any>()

  ngOnInit(): void {
    Promise.all(this.initList.map(fn => fn.call(this)))
  }


  loadOrgTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/org/service/organization/admin/organization/tree/child/root`).subscribe((res: any) => {
      res.success ? this.orgNodes = res.data : this.msgSrv.warning(res.message);
      this.orgTreeLoading = false;
    });
  }

  inputChange(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.globalSearch()
      clearTimeout(this.timer);
    }, 1000);
  }

  globalSearch() {
    const params = {
      searchValue: this.searchValue,
      mode: this.mode,
    };
    if (this.searchValue === '' || this.searchValue === 'undefined') {
      this.showSearchResult = false;
    } else {
      this.orgTreeLoading = true;
      this.showSearchResult = true;
      this.http.post(`/service/support/admin/UserApi/global-search`, params).subscribe((res: any) => {
        if (res.success) {
          this.panels = res.data;
        }
        this.orgTreeLoading = false;
      });
    }
  }

  orgEvent(event: NzFormatEmitEvent): void {
    const node: NzTreeNode | null | undefined = event.node;
    const eventName: string = event.eventName
    switch (eventName) {
      case 'click' :
        this.treeNodeClick(node as NzTreeNode)
        break;
      case 'expand' :
        this.treeExpand(node as NzTreeNode)
        break;
    }
  }

  treeExpand(node: NzTreeNode): void {
    if (node!.getChildren().length === 0 && node.isExpanded) {
      console.log(node, node.origin);
      this.http.get(`/org/service/organization/admin/organization/tree/child/` + node.origin!.key + '/' + node.origin['companyId']).subscribe((res: any) => {
        res.success && node.addChildren(res.data);
      });
    }
  }

  treeNodeClick(node: NzTreeNode): void {
    switch (this.chooseMode) {
      case 'employee':
        this.addSelectedList('employee', node.key, node.title, node.origin['corpId'], node.parentNode!['key'], node.parentNode!['title'], node.origin['thirdPartyAccountUserId'])
        break;
      case 'project':
        this.addSelectedList('outsourceProject', node.key, node.title, node.origin['corpId'], '', '', '');
        break;
    }
  }

  optSearchResult(value: any) {
    this.addSelectedList(value.category, value.id, value.name, '', value.projectId, value.projectName, value.thirdPartyAccountUserId);
  }


  addSelectedList(category: string, id: string, name: string, corpId: string, projectId: variable<string>, projectName: variable<string>, thirdPartyAccountUserId: variable<string>) {

  }


}
