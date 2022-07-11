/* eslint-disable */
import { Component, OnInit, ViewChild } from '@angular/core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SystemContactPostEditComponent } from './post-edit.component';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-system-contact-post-setup',
  templateUrl: './post-setup.component.html'
})
export class SystemContactPostSetupComponent implements OnInit {
  organization: any = {};
  postList: any = [];
  // 表格
  url = `/service/contact/admin/post/organization/table`;
  postTableRequest: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize'
    },
    params: {
      orgId: null,
      isRecursive: false
    }
  };
  columns: STColumn[] = [
    { title: '编号', index: 'id', type: 'radio' },
    { title: '岗位名称', index: 'name' },
    { title: '责任岗位', index: 'organizationPrincipal', type: 'badge' },
    { title: '排序', index: 'level' },
    { title: '岗位描述', index: 'remark' },
    {
      title: '操作',
      buttons: [
        { text: '编辑', type: 'static', icon: 'edit', click: (item: any) => this.edit(item) },
        { text: '删除', icon: 'delete', type: 'del', click: (item: any) => this.remove(item) }
      ]
    }
  ];
  @ViewChild('st', { static: false }) st!: STComponent;

  change(ret: STChange) {
    console.log('change', ret);
  }

  dataChange(data: STData[]) {
    return data.map((i: any, index: number) => {
      i.disabled = index === 0;
      i.hidden = index === 1;
      return i;
    });
  }

  // 表格

  ngOnInit(): void {
    this.findPostByOrg(this.organization.id);
  }

  constructor(private modal: NzModalRef, private modalHelper: ModalHelper, private msgSrv: NzMessageService, public http: _HttpClient) {

  }

  findPostByOrg(orgId:string) {
    let params = {
      orgId: orgId,
      isRecursive: false
    };
    this.http.post(`/service/contact/admin/post/organization`, params).subscribe((res) => {
      if (res.success) {
        this.postList = res.data;
      }
    });
  }

  addPost(record: any) {
    this.modalHelper
      .createStatic(SystemContactPostEditComponent, { record: record, organization: this.organization })
      .subscribe(() => this.findPostByOrg(this.organization.id));
  }

  edit(record: any) {
    this.modalHelper.createStatic(SystemContactPostEditComponent, { record }).subscribe(() => this.findPostByOrg(this.organization.id));
  }

  remove(record: any) {
    this.http.post(`/service/contact/admin/post/remove`, record).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success(res.message);
        this.findPostByOrg(this.organization.id);
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }

  save(): void {
  }

  close() {
    this.modal.destroy();
  }
}
