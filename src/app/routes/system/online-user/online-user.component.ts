import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SystemOnlineUserService } from '../../../api/system/system-online-user.service';

@Component({
  selector: 'app-system-online-user',
  templateUrl: './online-user.component.html'
})
export class SystemOnlineUserComponent implements OnInit {
  url = `/service/system/system-online-user/page-all`;
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
    { title: '回话id', index: 'tokenId' },
    { title: '用户名', index: 'username' },
    { title: '用户id', index: 'userId' },
    { title: 'ip地址', index: 'ipAddress' },
    { title: '操作系统', index: 'os' },
    { title: '浏览器', index: 'browser' },
    { title: '登录地址', index: 'loginLocation' },
    { title: '登录时间', index: 'loginTime', type: 'date' },
    {
      title: '',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private systemOnlineUserService: SystemOnlineUserService) {}

  ngOnInit(): void {}

  reload(): void {
    this.systemOnlineUserService.reload({}).subscribe(res => {
      if (res.success) {
        this.refresh();
      }
    });
  }

  refresh(): void {
    this.st.reload();
  }
}
