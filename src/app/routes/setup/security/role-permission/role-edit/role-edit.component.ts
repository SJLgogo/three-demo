/* eslint-disable */
import {Component, Inject, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {SFSchema, SFSchemaEnumType, SFUISchema} from '@delon/form';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {map} from "rxjs/operators";
import {CommonSelect} from "../../../../../api/common-interface/common-interface";
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {environment} from "@env/environment";

@Component({
  selector: 'app-setup-security-role-edit',
  templateUrl: './role-edit.component.html',
})
export class SetupSecurityRoleEditComponent implements OnInit {
  modalTitle = '';
  formData: any = {};
  mode: any;
  editNode: any;
  schema: SFSchema = {
    properties: {
      appId: {
        type: 'string', title: '应用名称', maxLength: 100,
        ui: {
          // width:100,
          placeHolder: '请输入', widget: 'select',
          asyncData: () => {
            return this.http.get(`/base/api/agent/app/find-all`).pipe(
              map((item) => {
                const children = item.data.map((element: any) => {
                  return {label: element.name, value: element.id};
                });
                const type: SFSchemaEnumType = [
                  {
                    label: '应用列表',
                    group: true,
                    children
                  }
                ];
                return type;
              })
            );
          },
          hidden: this.appIdHide(),
        },
      },
      name: {type: 'string', title: '角色名称'},
      code: {type: 'string', title: '角色编码'},
      remark: {type: 'string', title: '描述', maxLength: 255},
    },
    required: ['name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
    },
    $remark: {
      widget: 'textarea',
      grid: {span: 24},
      autosize: {minRows: 4, maxRows: 6}
    },
  };
  subAdmin: any;
  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient,    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,) {
  }

  ngOnInit(): void {
    if (this.mode === 'add') {
      this.modalTitle = '添加角色';
    } else if (this.mode === 'edit') {
      this.formData = this.editNode;
      this.modalTitle = '编辑角色 [' + this.formData.name + ']';
    }
  }

  save(value: any) {
    let url = `/security/service/security/admin/authority/role/create`;
    if (this.mode === 'add') {
      value.parentId = this.editNode.key;
        // @ts-ignore
      let appIdIndex=this.tokenService.get()['appId'];
      // @ts-ignore
      if (appIdIndex == 0 && value.parentId == '1') {
        value.type = 'sub-admin';
      }
    } else if (this.mode === 'edit') {
      url = `/security/service/security/admin/authority/role/edit-name`;
    }

    this.http.post(url, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
  appIdHide(): any {
    // @ts-ignore
    let appId = this.tokenService.get()['appId'];
    // @ts-ignore
    if (appId == "0") {
      return false;
    } else {
      return true;
    }
  }
}
