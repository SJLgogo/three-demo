import {Component, OnInit, ViewChild} from '@angular/core';
import {STColumn, STComponent} from "@delon/abc/st";
import {SystemJdlEditComponent} from "../../system/jdl/edit/edit.component";
import {ModalHelper} from "@delon/theme";
import {AppAddComponent} from "./app-add/app-add.component";
import {SelectProjectPersonComponent} from "../../../hz/select-person/select-project-person/select-project-person.component";


@Component({
  selector: 'app-organization-management',
  templateUrl: './organization-management.component.html',
  styleUrls: ['./organization-management.component.less']
})
export class OrganizationManagementComponent implements OnInit {
  @ViewChild('stPro') private readonly stPro!: STComponent;
  @ViewChild('stApp') private readonly stApp!: STComponent;

  constructor(private  modal: ModalHelper) {
  }

  urlPro = ''
  urlApp = ''

  columnsPro: STColumn[] = [
    {title: '组织机构名称', type: 'no'},
    {title: '企业CorpId', index: 'name'},
    {title: '通讯录自动同步', index: 'description'},
    {title: '描述', index: 'updateTime'},
    {
      title: '操作',
      buttons: [
        {
          text: `编辑`,
        },
        {
          text: `删除`,
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
    {title: '应用名称', type: 'no'},
    {title: '应用类型', index: 'name'},
    {title: '访问地址', index: 'description'},
    {title: '应用Code', index: 'updateTime'},
    {title: '三方应用ID', index: 'updateTime'},
    {title: '创建时间', index: 'updateTime'},
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

    })
  }

  tableRefresh(tableName: string): void {
    // @ts-ignore
    this[tableName].reload()
  }

  choosePerson(): void {
    this.modal.createStatic(SelectProjectPersonComponent).subscribe(res=>{

    })
  }

}
