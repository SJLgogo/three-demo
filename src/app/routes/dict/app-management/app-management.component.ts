import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {STColumn, STColumnBadge, STComponent} from "@delon/abc/st";
import {SystemJdlEditComponent} from "../../system/jdl/edit/edit.component";
import {ModalHelper} from "@delon/theme";
import {AppAddComponent} from "./app-add/app-add.component";
import {ProAddComponent} from "./pro-add/pro-add.component";
import {OrganizationService} from "../../../api/dict/organization-management/organization.service.ts";
import {HttpResult, variable} from "../../../api/common-interface/common-interface";
import {NzMessageService} from "ng-zorro-antd/message";
import { SelectProjectPersonComponent } from '../../../shared/select-person/select-project-person/select-project-person.component';
import { SFComponent, SFSchema } from '@delon/form';

declare var ClipboardJS: any;

@Component({
  selector: 'app-organization-management',
  templateUrl: './app-management.component.html',
  styleUrls: ['./app-management.component.less']
})
export class AppManagementComponent implements OnInit {
  @ViewChild('stPro') private readonly stPro!: STComponent;
  @ViewChild('stApp') private readonly stApp!: STComponent;
  @ViewChild('cpTrigger')
  cpTrigger!: ElementRef;

  constructor(private  modal: ModalHelper, private organizationService: OrganizationService, private msgSrv: NzMessageService) {
  }

  cpData: variable<string>;
  urlPro = '/base/api/agent/company/page-all'
  urlApp = '/base/api/agent/app/page-all'
  columnsPro: STColumn[] = [
    {title: '名称', index: 'name'},
    {title: '第三方公司id', index: 'corpId'},
    {title: '应用', index: 'category', type: 'enum', enum: {'wxCp': '企业微信', 'ding': '钉钉', 'yzj': '云之家', 'other': '其他'}},
    {title: '通讯录自动同步', index: 'automaticUpdate', type: 'yn'},
    {
      title: '操作',
      buttons: [
        {
          text: `编辑`,
          click: (e) => this.editPro(e)
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
    {title: '公司', index: 'companyName'},
    {title: '访问地址', index: 'url', render: 'renderAppAuthUrl'},
    {title: '应用类型', index: 'category', type: 'enum', enum: {'app': 'app访问', 'web': 'web端访问', 'contact': '通讯录'}},
    {title: '企业微信通讯录secret', index: 'secret'},
    {title: '通讯录token', index: 'messageToken'},
    {title: '通讯录Key', index: 'messageEncodingAesKey'},
    {title:'第三方应用id',index:'agentId'},
    {title:'第三方公司id',index:'corpId'},
    {
      title: '操作',
      buttons: [
        {
          text: `编辑`,
          click: (e) => this.editApp(e)
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
            this.deleteAppHttp(e.id)
          },
        },
      ],
    },
  ];
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '应用名称'
      }
    }
  };
  searchSchema1: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '应用名称'
      }
    }
  };
  @ViewChild('sf') sf!: SFComponent;
  ngOnInit(): void {
    const clipboard = new ClipboardJS('.cp-trigger', {
      text: (event: any) => {
        return this.cpData;
      }
    });
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
    this.modal
      .createStatic(SelectProjectPersonComponent, {
        chooseMode: 'employee', // department organization employee
        functionName: 'not-clock'
      })
      .subscribe(res => {
      });
  }

  deleteProHttp(id: string): void {
    this.organizationService.deletePro(id).subscribe((res: HttpResult) => {
      this.httpAfterOperation(res.success, res.message)
      this.refresh()
    })
  }

  deleteAppHttp(id: string): void {
    this.organizationService.deleteApp(id).subscribe((res: HttpResult) => {
      this.httpAfterOperation(res.success, res.message)
      this.refresh()
    })
  }

  editPro(e: any): void {
    this.modal.createStatic(ProAddComponent, {i: e}).subscribe(res => {
      this.tableRefresh('stPro')
    })
  }

  editApp(e: any): void {
    this.modal.createStatic(AppAddComponent, {i: e}).subscribe(res => {
      this.tableRefresh('stApp')
    })
  }

  httpAfterOperation(status: boolean, msg: variable<string>): void {
    status ? this.msgSrv.success(msg as string) : this.msgSrv.error(msg as string)
  }

  refresh(): void {
    this.tableRefresh('stPro')
    this.tableRefresh('stApp')
  }

  cpClickTrigger(data: string): void {
    this.cpData = data;
    this.cpTrigger.nativeElement.click();
  }
}


