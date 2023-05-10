/* eslint-disable */
import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { Router } from '@angular/router';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzContextMenuService } from 'ng-zorro-antd/dropdown';
import { SystemContactPostSetupComponent } from '../post/post-setup.component';
import { SystemContactOrgEditComponent } from '../org/org-edit.component';
import { SystemContactJobEditComponent } from '../job/job-edit.component';
import { SystemContactTagEditComponent } from '../tag/tag-edit.component';
import { SetupAccountEditComponent } from '../../account/edit/edit.component';
import { SelectProjectPersonComponent } from 'src/app/shared/select-person/select-project-person/select-project-person.component';

@Component({
  selector: 'app-setup-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.less']
})
export class SetupContactComponent implements OnInit {
  // ------------------------搜索
  showSearchResult = false;
  searchValue: any = '';
  // -----------标签页
  activeTabIndex = 0;
  panels: any = [];
  // ------------------------人员table
  employeeTableTitle = '【组织人员信息】';
  // ------------------------标签列表
  tagId = null;
  tagList: any = [];
  // 是否显示添加账户按钮
  showAssignEmployeeButton = true;
  // ------------------------组织机构树
  optOrgId = null;
  optOrgName = null;
  orgTreeLoading = true;
  // 选中的部门id
  selectedOrgId = null;
  activedOrgNode!: NzTreeNode;
  orgNodes: any = [];
  // ------------------------职务机构树
  optJobId = null;
  optJobName = null;
  selectedJobId = null;
  activedJobNode!: NzTreeNode;
  jobsNodes: any = [];
  confirmModal!: NzModalRef;

  url = `/org/service/organization/admin/account/page-all`;
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    // { title: '头像', type: 'img', width: 60, index: 'wxAvatar', fixed: 'left' },
    { title: '公司', index: 'companyName', fixed: 'left' },
    { title: '姓名', index: 'thirdPartyName', fixed: 'left' },
    { title: '账号', index: 'mobilePhone', fixed: 'left' },
    {
      title: '来源',
      index: 'scene',
      format: (item: any) => {
        if (item.scene == 'wxCp') {
          return '企业微信';
        } else if (item.scene == 'miniapp') {
          return '小程序';
        } else if (item.scene == 'ding') {
          return '钉钉';
        } else if (item.scene == '' || item.scene == null) {
          return '其它平台';
        } else if (item.scene == 'this_platform') {
          return '本平台';
        } else {
          return item.scene;
        }
      }
    },
    // { title: '工号', index: 'name', fixed: 'left', width: '80px'   },
    // { title: '部门', index: 'orgInfo',
    //   format: (item: any) => {
    //     let pathName = "";
    //     for (let org of item.orgInfoList){
    //       pathName = org.path + "\n";
    //     }
    //     return pathName;
    //   }},
    // { title: '岗位', index: 'postInfo',
    //   format: (item: any) => {
    //     let postNames = "";
    //     for (let post of item.postInfoList){
    //       postNames = post.name + "\n";
    //     }
    //     return postNames;
    //   }},
    // { title: '职务', index: 'jobInfo',
    //   format: (item: any) => {
    //     let jobNames = "";
    //     for (let job of item.jobInfoList){
    //       jobNames = job.name + "\n";
    //     }
    //     return jobNames;
    //   }},
    // { title: '性别', index: 'genderEnum',type:'badge', badge: this.BADGE_GENDER  },
    // { title: '电话', index: 'mobilePhone' },
    // { title: '状态', index: 'employeeEnum',type:'badge', badge: this.BADGE_EMPLOYEE_STATUS  },
    {
      title: '',
      buttons: [
        // { text: '更多设置',icon: 'setting', click: (item: any) => this.showEmployeeDetail(item) }
      ]
    }
  ];

  globalSearch() {
    const params = {
      searchValue: this.searchValue,
      mode: ['organization', 'job', 'post', 'tag']
    };
    if (this.searchValue === '' || this.searchValue === 'undefined') {
      this.showSearchResult = false;
    } else {
      this.showSearchResult = true;
      this.http.post(`/org/service/organization/admin/account/global-search`, params).subscribe((res: any) => {
        if (res.success) {
          this.panels = res.data;
        }
      });
    }
  }

  searchResult(item: any) {
    if (item.type === 'employee') {
      this.employeeTableTitle = '【人员信息】' + item.name;
      this.loadEmployeeTable('employee', '', item.id, null, null, null, item.id);
    } else if (item.type === 'organization') {
      this.employeeTableTitle = '【组织人员信息】' + item.name;
      this.loadEmployeeTable('organization', '', item.id, null, null, null, null);
    } else if (item.type === 'post') {
      this.employeeTableTitle = '【岗位人员信息】' + item.name;
      this.loadEmployeeTable('post', '', null, item.id, null, null, null);
    } else if (item.type === 'job') {
      this.employeeTableTitle = '【职务人员信息】' + item.name;
      this.loadEmployeeTable('job', '', null, null, item.id, null, null);
    } else if (item.type === 'tag') {
      this.employeeTableTitle = '【标签人员信息】' + item.name;
      this.loadEmployeeTable('tag', '', null, null, null, item.id, null);
    }
  }

  loadEmployeeTable(mode: string, searchName: any, orgId: any, postId: any, jobId: any, tagId: any, employeeId: any) {
    // this.st.reload({
    //   mode: mode,
    //   searchName: searchName,
    //   employeeId: orgId,
    //   parentOrgId: orgId,
    //   postId: postId,
    //   jobId: jobId,
    //   tagId: tagId
    // });

    this.st.reload({ orgId: orgId });
  }

  activeTab(tabIndex: number) {
    this.activeTabIndex = tabIndex;
    if (this.activeTabIndex === 0) {
      this.loadOrgTree();
    } else if (this.activeTabIndex === 1) {
      this.loadJobTree();
    } else if (this.activeTabIndex === 2) {
      this.loadTagList();
    }
  }

  // 点击加载下级树节点
  orgEvent(event: NzFormatEmitEvent): void {
    const node: any = event.node;
    if (event.eventName === 'expand') {
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        this.http
          .get(`/org/service/organization/admin/organization/tree/child/` + node.origin!.key + '/' + node.origin['companyId'])
          .subscribe((res: any) => {
            res.success && node.addChildren(res.data);
          });
      }
    } else if (event.eventName === 'click') {
      this.activedOrgNode = node;
      this.selectedOrgId = node.key;
      this.loadEmployeeTable('organization', '', this.selectedOrgId, null, null, null, null);
      this.employeeTableTitle = '【员工信息】' + node.title;
      this.activedOrgNode = node;
    }
  }

  // 加载组织机构树
  loadOrgTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/org/service/organization/admin/organization/tree/child/root`).subscribe((res: any) => {
      if (res.success) {
        this.orgNodes = res.data;
        this.orgTreeLoading = false;
        this.employeeTableTitle = '【组织人员信息】' + this.orgNodes[0].title;

        this.selectedOrgId = this.orgNodes[0].key;

        this.loadEmployeeTable('index', '', this.orgNodes[0].key, null, null, null, null);
      }
    });
  }

  optOrg(node: any) {
    this.optOrgId = node.key;
    this.optOrgName = node.title;
  }

  orgOperation(opt: string, node: any) {
    console.log(opt, node);
    if (opt === 'setup-post') {
      this.modal
        .createStatic(SystemContactPostSetupComponent, {
          organization: {
            id: node.key,
            name: node.title
          }
        })
        .subscribe(() => {
        });
    } else if (opt === 'add') {
      this.modal
        .createStatic(
          SystemContactOrgEditComponent,
          {
            organization: {
              id: node.key,
              name: node.title,
              mode: 'add'
            }
          },
          { size: 'md' }
        )
        .subscribe(() => {
          this.loadOrgTree();
        });
    } else if (opt === 'edit-name') {
      this.modal
        .createStatic(
          SystemContactOrgEditComponent,
          {
            organization: {
              id: node.key,
              name: node.title,
              mode: 'edit'
            }
          },
          { size: 'md' }
        )
        .subscribe(() => {
          this.loadOrgTree();
        });
    } else if (opt === 'remove') {
      this.confirmModal = this.modalSrv.confirm({
        nzTitle: '删除确认?',
        nzContent: '是否确认删除部门 [' + node.title + '] ?',
        nzOnOk: () => {
          const params = {
            id: node.key
          };
          this.http.post(`/org/service/organization/admin/organization/remove`, params).subscribe((res: any) => {
            if (res.success) {
              this.msgSrv.success('删除成功');
              this.loadOrgTree();
            } else {
              this.msgSrv.error(res.message);
            }
          });
        }
      });
    }
  }

  // 点击加载下级树节点
  jobEvent(event: NzFormatEmitEvent): void {
    const node: any = event.node;
    if (event.eventName === 'expand') {
      if (node && node.getChildren().length === 0 && node.isExpanded) {
        this.http.get(`/org/service/organization/admin/job/tree/child/` + node.key).subscribe((res: any) => {
          if (res.success) {
            node.addChildren(res.data);
          }
        });
      }
    } else if (event.eventName === 'click') {
      this.selectedJobId = node.key;
      this.loadEmployeeTable('job', null, null, null, this.selectedJobId, null, null);
      this.activedJobNode = node;
      this.employeeTableTitle = '【职务人员信息】' + node.title;
    }
  }

  // 加载职务树
  loadJobTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/org/service/organization/admin/job/tree`).subscribe((res: any) => {
      if (res.success) {
        this.jobsNodes = [...res.data];
        this.orgTreeLoading = false;
      }
      this.employeeTableTitle = '【职务人员信息】' + this.jobsNodes[0].title;
      this.loadEmployeeTable('job', null, null, null, this.jobsNodes[0].key, null, null);
    });
  }

  optJob(node: any) {
    this.optJobId = node.key;
    this.optJobName = node.title;
  }

  jobOperation(opt: string, node: any) {
    console.log(node);
    if (opt === 'add') {
      this.modal
        .createStatic(SystemContactJobEditComponent, {
          parentJob: {
            id: node.key,
            name: node.title
          }
        })
        .subscribe(() => {
          this.loadJobTree();
        });
    } else if (opt === 'edit') {
      this.modal
        .createStatic(SystemContactJobEditComponent, {
          record: { id: node.key, name: node.title },
          parentJob: { id: node.key, name: node.title }
        })
        .subscribe(() => {
          this.loadJobTree();
        });
    } else if (opt === 'remove') {
      const value = {
        id: node.key
      };
      this.http.post(`/service/contact/admin/job/remove`, value).subscribe((res: any) => {
        if (res.success) {
          this.msgSrv.success(res.message);
        } else {
          this.msgSrv.error(res.message);
        }
        this.loadJobTree();
      });
    }
  }

  addTag() {
    this.modal.createStatic(SystemContactTagEditComponent, { i: { id: 0 } }).subscribe(() => {
      this.loadTagList();
    });
  }

  editTag(record: any) {
    this.modal.createStatic(SystemContactTagEditComponent, { record }).subscribe(() => {
      this.loadTagList();
    });
  }

  removeTag(tag: any) {
    this.confirmModal = this.modalSrv.confirm({
      nzTitle: '删除确认?',
      nzContent: '是否确认删除 [' + tag.name + '] 标签?',
      nzOnOk: () => {
        this.http.post(`/service/contact/admin/tag/remove`, tag).subscribe((res: any) => {
          if (res.success) {
            this.msgSrv.success('删除成功');
            this.loadTagList();
          }
        });
      }
    });
  }

  loadTagList() {
    this.orgTreeLoading = true;
    this.http.get(`/service/contact/admin/tag/list`).subscribe((res: any) => {
      if (res.success) {
        this.tagList = [...res.data];
      }
      this.orgTreeLoading = false;
      if (this.tagList.length > 0) {
        this.loadEmployeeTable('tag', null, null, null, null, this.tagList[0].id, null);
        this.employeeTableTitle = '【标签人员信息】' + this.tagList[0].name;
        this.tagId = this.tagList[0].id;
      }
    });
  }

  activeTag(tag: any) {
    this.tagId = tag.id;
    this.loadEmployeeTable('tag', null, null, null, null, this.tagId, null);
    this.employeeTableTitle = '【标签人员信息】' + tag.name;
  }

  /**
   * 添加账号
   */
  addAccount() {
    this.modal
      .createStatic(SetupAccountEditComponent, {
        i: { id: 0, orgId: this.selectedOrgId },
        mode: 'add'
      })
      .subscribe(() => this.st.reload());
  }

  constructor(
    private http: _HttpClient,
    private router: Router,
    private modal: ModalHelper,
    private modalSrv: NzModalService,
    private msgSrv: NzMessageService,
    private nzContextMenuService: NzContextMenuService
  ) {
  }

  selectUser() {
    const mode = ['employee', 'organization', 'post', 'job', 'tag'];
  }

  openFolder(node: any): void {
  }

  ngOnInit() {
    this.loadOrgTree();
  }

  choosePerson1() {
    this.modal
      .createStatic(SelectProjectPersonComponent, {
        chooseMode: 'employee', // department organization employee
        functionName: '1',
        singleChoice: true
      })
      .subscribe(res => {
        console.log(res);
      });
  }

  choosePerson2() {
    this.modal
      .createStatic(SelectProjectPersonComponent, {
        chooseMode: 'employee', // department organization employee
        functionName: '2'
      })
      .subscribe(res => {
        console.log(res);
      });
  }
}
