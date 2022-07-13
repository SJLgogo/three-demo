import {Component, OnInit, ViewChild} from '@angular/core';
import {SFComponent, SFSchema, SFUISchema} from "@delon/form";
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {CommonSelect, EmptyObject, HttpResult, variable} from "../../../../api/common-interface/common-interface";
import { SaveApp, SavePro} from "../organization.interface";
import {OrganizationService} from "../../../../api/dict/organization-management/organization.service.ts";

@Component({
  selector: 'app-app-add',
  templateUrl: './app-add.component.html',
  styleUrls: ['./app-add.component.less']
})
export class AppAddComponent implements OnInit {
  @ViewChild('sf', {static: false}) sf!: SFComponent;

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private organizationService:OrganizationService
  ) {
  }

  i: SavePro | EmptyObject = {};
  applicationType: CommonSelect[] = [{label: 'app访问', value: 'app'}, {label: 'web端访问', value: 'web'}, {
    label: '通讯录',
    value: 'contact'
  }]
  schema: SFSchema = {
    properties: {
      name: {type: 'string', title: '应用名称', maxLength: 100, ui: {placeHolder: '请输入'}},
      companyId: {type: 'string', title: '接入公司', maxLength: 100, ui: {placeHolder: '请输入'}},
      url: {type: 'string', title: '访问路径', maxLength: 100, ui: {placeHolder: '请输入'}},
      category: {
        type: 'string',
        title: '应用类型',
        enum: this.applicationType,
        ui: {placeHolder: '请选择', widget: 'select', width: 150}
      },
      secret: {type: 'string', title: '企业微信通讯录', maxLength: 100, ui: {visibleIf: {category: ['contact']}}},
      messageToken: {type: 'string', title: '企业微信token', maxLength: 100, ui: {visibleIf: {category: ['contact']}}},
      messageEncodingAesKey: {
        type: 'string',
        title: '企业微信Key',
        maxLength: 100,
        ui: {visibleIf: {category: ['contact']}}
      },
    },
    required: ['name', 'companyId', 'url', 'category', 'secret', 'messageToken', 'messageEncodingAesKey']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150,
      grid: {span: 12}
    },
    $description: {
      widget: 'textarea',
      grid: {span: 24},
      autosize: {minRows: 4, maxRows: 6}
    }
  };


  ngOnInit(): void {
  }

  save(value: SaveApp | any): void {
    this.saveOperation(value)
  }

  close(): void {
    this.modal.destroy();
  }

  saveOperation(value: SavePro): void {
    this.i?.id ? value.id = this.i.id : ''
    this.organizationService.saveApp(value).subscribe((res: HttpResult) => {
      this.httpAfterOperation(res.success, res.message)
    });
  }

  httpAfterOperation(status: boolean, msg: variable<string>): void {
    status ? this.msgSrv.success(msg as string) : this.msgSrv.error(msg as string)
    status && this.modal.close(true);
  }
}
