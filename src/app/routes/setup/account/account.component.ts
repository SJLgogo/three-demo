
import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc/st';
import { SetupAccountEditComponent } from './edit/edit.component';
import { SetupSynchronizeComponent } from './synchronize/synchronize.component';

@Component({
  selector: 'app-setup-account',
  templateUrl: './account.component.html'
})
export class SetupAccountComponent implements OnInit {
  url = `/org/service/organization/admin/account/page-all`;
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '用户名称'
      }
    }
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '平台账号', index: 'account' },
    { title: '用户名称', index: 'thirdPartyName' },
    { title: '手机号', index: 'mobilePhone' },
    { title: '用户所属公司', index: 'companyName' },
    {
      title: '',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        { text: '编辑', type: 'static', icon: 'edit', click: (item: any) => this.updatePageElementResource(item) },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) {
  }

  updatePageElementResource(item: any) {
    this.modal.createStatic(SetupAccountEditComponent, { i: item }, { size: 'md' }).subscribe(() => this.st.reload());
  }

  // /service/security/admin/userThirdPartyApi

  close() {
    // this.modalRef.destroy();
  }

  /**
   * 清空查询
   */
  reset() {
    this.sf.reset();
    this.sf.refreshSchema();
  }

  /**
   * 同步第三方通讯录信息
   */
  synchronizeThirdPartyAccount() {
    this.modal.createStatic(SetupSynchronizeComponent, { i: { id: 0 }, mode: 'add' }).subscribe(() => this.st.reload());
  }

  ngOnInit() {
  }

  add() {
    this.modal.createStatic(SetupAccountEditComponent, { i: { id: 0 }, mode: 'add' }).subscribe(() => this.st.reload());
  }
}
