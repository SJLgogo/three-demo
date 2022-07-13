import {Component, OnInit, ViewChild} from '@angular/core';
import {SFComponent, SFSchema, SFUISchema} from "@delon/form";
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {CommonSelect, EmptyObject, HttpResult, variable} from "../../../../api/common-interface/common-interface";
import { SavePro} from "../organization.interface";
import {OrganizationService} from "../../../../api/dict/organization-management/organization.service.ts";

@Component({
  selector: 'app-pro-add',
  templateUrl: './pro-add.component.html',
  styleUrls: ['./pro-add.component.less']
})
export class ProAddComponent implements OnInit {
  @ViewChild('sf', {static: false}) sf!: SFComponent;

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private organizationService: OrganizationService
  ) {
  }

  appRange: CommonSelect[] = [{label: '企业微信', value: 'wxCp'}, {label: '钉钉', value: 'ding'}, {
    label: '云之家',
    value: 'yzj'
  }, {label: '其他', value: 'other'},]

  i: SavePro | EmptyObject = {};
  schema: SFSchema = {
    properties: {
      name: {type: 'string', title: '项目名称', maxLength: 100, ui: {placeholder: "请输入"}},
      corpId: {type: 'string', title: '三方公司Id', maxLength: 100, ui: {placeholder: "请输入"}},
      agentId: {type: 'string', title: '三方应用Id', maxLength: 100, ui: {placeholder: "请输入"}},
      category: {
        type: "string",
        title: "应用",
        enum: this.appRange,
        ui: {
          placeholder: "请选择",
          widget: "select",
        },
      },
      automaticUpdate: {type: 'boolean', title: '自动更新通讯录'},
      synchronisedTime: {type: 'number', minimum: 0, title: '同步时间', ui: {visibleIf: {automaticUpdate: [true]}}},
    },
    required: ['name', 'corpId', 'agentId', 'category', 'automaticUpdate', 'synchronisedTime']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150,
      grid: {span: 12},
    },
  };


  ngOnInit(): void {
  }

  save(value: SavePro | any): void {
    this.saveOperation(value)
  }

  close(): void {
    this.modal.destroy();
  }

  saveOperation(value: SavePro): void {
    this.i?.id ? value.id = this.i.id : ''
    this.organizationService.savePro(value).subscribe((res: HttpResult) => {
      this.httpAfterOperation(res.success, res.message)
    });
  }

  httpAfterOperation(status: boolean, msg: variable<string>): void {
    status ? this.msgSrv.success(msg as string) : this.msgSrv.error(msg as string)
    status && this.modal.close(true);
  }

}


