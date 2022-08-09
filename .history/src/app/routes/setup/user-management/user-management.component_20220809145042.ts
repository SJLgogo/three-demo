import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { ModalHelper } from '@delon/theme';
import { OrganizationService } from '../../../api/dict/organization-management/organization.service.ts';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.less']
})
export class UserManagementComponent implements OnInit {
  @ViewChild('st') private readonly stApp!: STComponent;

  constructor(private modal: ModalHelper, private organizationService: OrganizationService, private msgSrv: NzMessageService) {}

  url = '/org/service/organization/admin/user/page-all';
  columns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '公司Id', index: 'corpId' },
    // {title: '应用Id', index: 'agentId'},
    { title: '应用', index: 'category', type: 'enum', enum: { wxCp: '企业微信', ding: '钉钉', yzj: '云之家', other: '其他' } },
    { title: '通讯录自动同步', index: 'automaticUpdate', type: 'yn' },
    {
      title: '操作',
      buttons: [
        {
          text: `编辑`,
          click: e => {}
        },
        {
          text: '删除',
          icon: 'delete',
          type: 'del',
          pop: {
            title: '确认删除?',
            okType: 'danger',
            icon: 'star'
          },
          click: e => {}
        }
      ]
    }
  ];
  ngOnInit(): void {}

  choosePerson(): void {}
}
