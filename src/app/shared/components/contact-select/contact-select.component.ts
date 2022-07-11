/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-setup-contact-select',
  templateUrl: './contact-select.component.html'
})
export class SetupContactSelectComponent implements OnInit {
  activedNode: any; // 编译报错补充，未测试
  // 初始化数据
  organizationMode = false; // 部门和雇员混合选择模式
  departmentMode = false; // 部门选择模式
  employeeMode = false; // 员工选择模式
  postMode = false; // 岗位选择模式
  jobMode = false; // 职务选择模式
  tagMode = false; // 标签选择模式

  selectedItems: any = [];
  mode: any = [];
  isSingleSelect = false;

  organizationTab = false;
  jobTab = false;
  postTab = false;
  tagTab = false;

  // ------------------------搜索
  showSearchResult = false;
  searchValue: any = '';
  // ------------------------岗位树
  optPostId = null;
  optPostName = null;
  selectedPostId = null;
  postTreeLoading = true;
  activedPostNode: NzTreeNode | undefined;
  postNodes: any = [];
  // ------------------------职务机构树
  optJobId = null;
  optJobName = null;
  selectedJobId = null;
  activedJobNode: NzTreeNode | undefined;
  jobsNodes: any = [];
  panels: any = [];
  // ------------------------组织机构树
  optOrgId: string | undefined;
  optOrgName: string | undefined;
  orgTreeLoading = false;
  selectedOrgId = null;
  activedOrgNode: NzTreeNode | undefined;
  orgNodes = [];
  // ------------------------标签列表
  tagList: any = [];

  globalSearch(event: any) {
    console.log(event);
    const params = {
      searchValue: this.searchValue,
      mode: this.mode
    };
    if (this.searchValue === '' || this.searchValue === 'undefined') {
      this.showSearchResult = false;
    } else {
      this.orgTreeLoading = true;
      this.showSearchResult = true;
      this.http.post(`/service/organization/admin/employee/global-search`, params).subscribe((res) => {
        if (res.success) {
          this.panels = res.data;
        }
        this.orgTreeLoading = false;
      });
    }
  }

  // 点击加载下级树节点
  orgEvent(event: NzFormatEmitEvent): void {
    const node: any = event.node;
    if (event.eventName === 'expand') {
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        this.http.get(`/service/organization/admin/employee/tree/organization/` + node.key + '/' + node.origin.corpId).subscribe((res) => {
          if (res.success) {
            node.addChildren(res.data);
          }
        });
      }
    } else if (event.eventName === 'click') {
      if (node.origin.category === 'employee') {
        if (this.employeeMode) {
          this.addSelectedList(
            'employee',
            node.key,
            node.title,
            node.origin.corpId,
            node.origin.companyName + '_',
            node.origin.thirdPartyAccountUserId
          );
        } else if (this.organizationMode) {
          this.addSelectedList(
            'employee',
            node.key,
            node.title,
            node.origin.corpId,
            node.origin.companyName + '_',
            node.origin.thirdPartyAccountUserId
          );
        }
      } else if (node.origin.category === 'organization') {
        if (this.departmentMode) {
          this.addSelectedList('organization', node.key, node.title, node.origin.corpId, '', '');
        } else if (this.organizationMode) {
          this.addSelectedList('organization', node.key, node.title, node.origin.corpId, this.getOrgCompanyName(node), '');
        }
      }
    }
  }

  // 加载组织机构树
  loadOrgTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/service/organization/admin/organization/tree/child/root`).subscribe((res) => {
      if (res.success) {
        this.orgNodes = res.data;
        this.orgTreeLoading = false;
      }
    });
  }

  optOrg(node: any) {
    this.optOrgId = node.key;
    this.optOrgName = node.title;
  }

  // ------------------------组织机构树

  // 点击加载下级树节点
  postEvent(event: NzFormatEmitEvent): void {
    const node: any = event.node;
    if (event.eventName === 'expand') {
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        this.http.get(`/service/organization/admin/post/tree/organization/` + node.key + '/' + node.origin.corpId).subscribe((res) => {
          if (res.success) {
            node.addChildren(res.data);
          }
        });
      }
    } else if (event.eventName === 'click') {
      this.selectedPostId = node.key;
      this.activedPostNode = node;
      this.addSelectedList('post', node.key, node.title, '', '', '');
      // if (node.isLeaf) {
      //
      // }
    }
  }

  // 加载角色
  loadPostTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/service/security/admin/authority/role/role-tree`).subscribe((res) => {
      if (res.success) {
        this.postNodes = [...res.data];
        this.orgTreeLoading = false;
      }
    });
  }

  optPost(node: any) {
    this.optPostId = node.key;
    this.optPostName = node.title;
  }

  // ------------------------岗位树

  // 点击加载下级树节点
  jobEvent(event: NzFormatEmitEvent): void {
    const node: any = event.node;
    if (event.eventName === 'expand') {
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        this.http.get(`/service/organization/admin/job/tree/child/` + node.key).subscribe((res) => {
          if (res.success) {
            node.addChildren(res.data);
          }
        });
      }
    } else if (event.eventName === 'click') {
      this.addSelectedList('job', node.key, node.title, '', '', '');
    }
  }

  // 加载职务树
  loadJobTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/service/organization/admin/job/tree`).subscribe((res) => {
      if (res.success) {
        this.jobsNodes = [...res.data];
        this.orgTreeLoading = false;
      }
    });
  }

  optJob(node: any) {
    this.optJobId = node.key;
    this.optJobName = node.title;
  }

  loadTagList() {
    this.orgTreeLoading = true;
    this.http.get(`/service/organization/admin/tag/list`).subscribe((res) => {
      if (res.success) {
        this.tagList = [...res.data];
      }
      this.orgTreeLoading = false;
    });
  }

  activeTag(tag: any) {
    this.addSelectedList('tag', tag.id, tag.name, '', '', '');
  }

  // ------------------------标签列表
  constructor(public http: _HttpClient, private modal: ModalHelper, private modalRef: NzModalRef) {
  }

  ngOnInit() {
    for (const index of Object.keys(this.mode)) {
      if (this.mode[index] === 'organization') {
        this.organizationTab = true;
        this.organizationMode = true;
        this.loadOrgTree();
      }
      if (this.mode[index] === 'department') {
        this.organizationTab = true;
        this.departmentMode = true;
        this.loadOrgTree();
      }
      if (this.mode[index] === 'employee') {
        this.organizationTab = true;
        this.employeeMode = true;
        this.loadOrgTree();
      } else if (this.mode[index] === 'post') {
        this.postTab = true;
        this.postMode = true;
        this.loadPostTree();
      } else if (this.mode[index] === 'job') {
        this.jobTab = true;
        this.jobMode = true;
        this.loadJobTree();
      } else if (this.mode[index] === 'tag') {
        this.tagTab = true;
        this.tagMode = true;
        this.loadTagList();
      }
    }
  }

  optSearchResult(value: any) {
    this.addSelectedList(value.type, value.id, value.name, value.corpId, value.companyName + '_', value.thirdPartyAccountUserId);
  }

  addSelectedList(category: string, id: string, name: string, corpId: string, companyName: string, thirdPartyAccountUserId: string) {
    if (this.isSingleSelect) {
      this.selectedItems[0] = {
        category,
        id,
        name,
        corpId,
        companyName,
        thirdPartyAccountUserId
      };
    } else {
      let exist = false;
      // 判断业务数据传过来的数据值、如果employeeId 和corpId 相等就不再选中
      for (const index of Object.keys(this.selectedItems)) {
        if (this.selectedItems[index].id === id && this.selectedItems[index].corpId === corpId) {
          exist = true;
          break;
        }

        if (
          this.selectedItems[index].category === 'employee' &&
          this.selectedItems[index].thirdPartyAccountUserId === thirdPartyAccountUserId
        ) {
          exist = true;
          break;
        }
      }

      if (!exist) {
        const selectedItem = {
          category,
          id,
          name,
          corpId,
          companyName,
          thirdPartyAccountUserId
        };
        this.selectedItems.push(selectedItem);
      }
    }
  }

  removeSelectedItem(item: any) {
    let index = -1;
    for (let i = 0; i < this.selectedItems.length; i++) {
      if (this.selectedItems[i].id === item.id && this.selectedItems[i].corpId === item.corpId) {
        index = i;
        break;
      }

      if (this.selectedItems[i].category === 'employee' && this.selectedItems[i].thirdPartyAccountUserId === item.thirdPartyAccountUserId) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    }
  }

  getOrgCompanyName(node: any): string {
    if (node.parentNode) return this.getOrgCompanyName(node.parentNode);
    return node._title;
  }

  save() {
    this.modalRef.close({ selectedItems: this.selectedItems });
  }

  close() {
    this.modalRef.destroy();
  }
}
