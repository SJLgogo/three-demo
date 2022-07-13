import {Component, OnInit, ViewChild} from '@angular/core';
import {STColumn, STComponent} from "@delon/abc/st";
import {SystemJdlEditComponent} from "../../system/jdl/edit/edit.component";
import {ModalHelper} from "@delon/theme";
import {AppAddComponent} from "./app-add/app-add.component";
import {SelectProjectPersonComponent} from "../../../hz/select-person/select-project-person/select-project-person.component";
import {ProAddComponent} from "./pro-add/pro-add.component";
import {OrganizationService} from "../../../api/dict/organization-management/organization.service.ts";
import {HttpResult, variable} from "../../../api/common-interface/common-interface";
import {NzMessageService} from "ng-zorro-antd/message";


@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.less']
})
export class OrganizationManagementComponent implements OnInit {
  @ViewChild('stPro') private readonly stPro!: STComponent;
  @ViewChild('stApp') private readonly stApp!: STComponent;

  constructor(private  modal: ModalHelper, private organizationService: OrganizationService, private msgSrv: NzMessageService) {
  }

  urlPro = '/base/api/agent/company/page-all'
  urlApp = '/base/api/agent/app/page-all'

  columnsPro: STColumn[] = [
    {title: '名称', index: 'name'},
    {title: '公司Id', index: 'corpId'},
    {title: '应用Id', index: 'agentId'},
    {title: '通讯录自动同步', index: 'automaticUpdate', type: 'yn'},
    {
      title: '操作',
      buttons: [
        {
          text: `编辑`,
          click: (e) => {
            this.editPro(e)
          },
        },
        {
          text: "删除",
          icon: "delete",
          type: "del",
          pop: {
            title: "确认删除该计划?",
            okType: "danger",
            icon: "star",
          },
          click: (e) => {
            this.deleteProHttp(e.id)
          },
        },
        {
          text: `应用列表`,
        },
        {
          text: `管理员账号`,
        },
      ],
    },
  ];
  columnsApp: STColumn[] = [
    {title: '应用名称', index: 'name'},
    {title: '公司', index: 'companyId'},
    {title: '访问地址', index: 'url'},
    {title: '应用类型', index: 'category'},
    {title: '企业微信通讯录secret', index: 'secret'},
    {title: '通讯录token', index: 'messageToken'},
    {title: '通讯录Key', index: 'messageEncodingAesKey'},
    {
      title: '操作',
      buttons: [
        {
          text: `编辑`,
        },
        {
          text: `删除`,
        },
      ],
    },
  ];

  ngOnInit(): void {
  }


  addApp(): void {
    this.modal.createStatic(AppAddComponent).subscribe(res => {
      this.tableRefresh('stApp')
    })
  }

  addPro(): void {
    this.modal.createStatic(ProAddComponent).subscribe(res => {
      this.tableRefresh('stPro')
    })
  }

  tableRefresh(tableName: string): void {
    // @ts-ignore
    this[tableName].reload()
  }

  choosePerson(): void {
    this.modal.createStatic(SelectProjectPersonComponent).subscribe(res => {

    })
  }


  deleteProHttp(id: string): void {
    this.organizationService.deletePro(id).subscribe((res: HttpResult) => {
      this.httpAfterOperation(res.success, res.message)
    })
  }

  editPro(e: any): void {
    this.modal.createStatic(ProAddComponent, {i: e}).subscribe(res => {
      this.tableRefresh('stPro')
    })
  }

  httpAfterOperation(status: boolean, msg: variable<string>): void {
    status ? this.msgSrv.success(msg as string) : this.msgSrv.error(msg as string)
  }

}
