import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';

@Component({
  selector: 'app-system-login-log',
  templateUrl: './login-log.component.html'
})
export class SystemLoginLogComponent implements OnInit {
  url = `/service/system/system-login-log/page-all`;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '序号', type: 'no' },
    { title: '用户名', index: 'userName' },
    { title: '登录地址', index: 'loginLocation' },
    { title: '登录状态', index: 'success' },
    { title: '操作系统', index: 'os' },
    { title: 'ip地址', index: 'ipAddress' },
    { title: '登录时间', index: 'loginTime' },
    {
      title: '',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) {}

  ngOnInit(): void {}

  add(): void {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  refresh(): void {
    this.st.reload();
  }
}
