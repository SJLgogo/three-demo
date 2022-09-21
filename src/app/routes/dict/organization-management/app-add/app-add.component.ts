import {Component, OnInit, ViewChild} from '@angular/core';
import { SFComponent, SFSchema, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {CommonSelect, EmptyObject, HttpResult, variable} from "../../../../api/common-interface/common-interface";
import {applicationType, SaveApp, SavePro} from "../organization.interface";
import {OrganizationService} from "../../../../api/dict/organization-management/organization.service.ts";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-app-add',
  templateUrl: './app-add.component.html',
  styleUrls: ['./app-add.component.less'],
})
export class AppAddComponent implements OnInit {
  @ViewChild('sf', {static: false}) sf!: SFComponent;

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private organizationService: OrganizationService
  ) {
  }

  i: SavePro | EmptyObject = {};

  schema: SFSchema = {
    properties: {
      name: {type: 'string', title: '应用名称', maxLength: 100, ui: {placeHolder: '请输入'}},
      companyId: {
        type: 'string', title: '接入公司', maxLength: 100, ui: {
          // width:100,
          placeHolder: '请输入', widget: 'select',
          asyncData: () => {
            return this.organizationService.allPro().pipe(
              map((item: any) => {
                const children: CommonSelect[] = item.data.map(
                  (element: any) => {
                    return {label: element.name, value: element.id};
                  }
                );
                return children;
              })
            );
          },
        }
      },
      agentId: {type: 'string', title: '三方应用Id', maxLength: 100, ui: {placeholder: "请输入"}},
      url: {type: 'string', title: '访问路径', maxLength: 100, ui: {placeHolder: '请输入'}},
      category: {
        type: 'string',
        title: '应用类型',
        enum: applicationType,
        ui: {placeHolder: '请选择', widget: 'select'}
      } as SFSelectWidgetSchema,
      secret: {
        type: 'string',
        title: '企业微信通讯录',
        maxLength: 100,
        ui: {visibleIf: {category: ['contact']}, placeHolder: '请输入'}
      },
      messageToken: {
        type: 'string',
        title: '企业微信token',
        maxLength: 100,
        ui: {visibleIf: {category: ['contact']}, placeHolder: '请输入'}
      },
      messageEncodingAesKey: {
        type: 'string',
        title: '企业微信Key',
        maxLength: 100,
        ui: {visibleIf: {category: ['contact']}, placeHolder: '请输入'}
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
    console.log(this.i);
  }

  save(value: SaveApp | any): void {
    this.saveOperation(value)
  }

  close(): void {
    this.modal.destroy();
  }

  saveOperation(value: SaveApp): void {
    if(this.i?.id){
      value.id = this.i.id
      this.fn('editApp',value)
    }else {
      this.fn('saveApp',value)
    }
  }


  fn(fnName:string,value:SaveApp):void{
    // @ts-ignore
    this.organizationService[fnName](value).subscribe((res: HttpResult) => {
      this.httpAfterOperation(res.success, res.message)
    });
  }

  httpAfterOperation(status: boolean, msg: variable<string>): void {
    status ? this.msgSrv.success(msg as string) : this.msgSrv.error(msg as string)
    status && this.modal.close(true);
  }
}
