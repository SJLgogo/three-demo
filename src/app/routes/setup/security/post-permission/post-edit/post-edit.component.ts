import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFSchemaEnumType, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { map } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Observable, of } from 'rxjs';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-setup-post-edit',
  templateUrl: './post-edit.component.html'
})
export class SetupPostEditComponent implements OnInit, AfterViewInit {
  modalTitle = '';
  formData: any = {};
  mode: any;
  editNode: any;
  orgTree: any = [];
  schema: SFSchema = {
    properties: {
      orgId: {
        type: 'string', title: '组织机构名称',
        maxLength: 100,
        ui: {
          widget: 'tree-select',
          asyncData: () => this.getOrgTree(),
          grid: { span: 24 },
          showSearch: true,
          dropdownStyle: { 'max-height': '300px' }
        } as SFSelectWidgetSchema
      },
      name: { type: 'string', title: '岗位名称' },
      orgPrincipal: {
        type: 'string',
        title: '是否为部门负责岗位',
        enum: [{ label: '是', value: true }, { label: '否', value: false }]
      }
    },
    required: ['name']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100
    },
    $remark: {
      widget: 'textarea',
      grid: { span: 24 },
      autosize: { minRows: 4, maxRows: 6 }
    }
  };
  subAdmin: any;

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }


  // 在组件类中定义 getOrgTree 方法，用于获取组织机构树形结构数据
  private getOrgTree(): Observable<NzTreeNode[]> {
    return this.http.get<NzTreeNode[]>('/org/service/organization/admin/organization/findOrgTreeAllScope').pipe(map((res: any) => {
      this.orgTree = res.data;
      return res.data;
    }));
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    if (this.mode === 'add') {
      this.modalTitle = '添加岗位';
    } else if (this.mode === 'edit') {
      this.http.get(`/security/service/security/admin/post/${this.editNode.key}`).subscribe(res => {
        this.formData = res.data;
        this.modalTitle = '编辑岗位 [' + this.formData.name + ']';
      });
    }
  }


  //递归查询选中的组织机构name
  private findSelectedNode(nodes: NzTreeNode[], id: string): NzTreeNode | undefined {
    for (const node of nodes) {
      if (node.key === id) {
        return node;
      }
      if (node.children?.length) {
        const result = this.findSelectedNode(node.children, id);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  save(value: any) {
    //查询选中的组织机构name、递归查询
    const selectedNode = this.findSelectedNode(this.orgTree, value.orgId);
    const orgName = selectedNode?.title;
    value.orgName = orgName;
    let url = `/security/service/security/admin/post/add`;
    if (this.mode === 'add') {
      value.parentId = this.editNode.key;
    } else if (this.mode === 'edit') {
      url = `/security/service/security/admin/post/update`;
    }
    this.http.post(url, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  appIdHide(): any {
    // @ts-ignore
    let appId = this.tokenService.get()['appId'];
    // @ts-ignore
    if (appId == '0') {
      return false;
    } else {
      return true;
    }
  }
}
