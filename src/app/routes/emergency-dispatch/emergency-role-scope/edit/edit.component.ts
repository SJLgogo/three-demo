import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFSchemaEnumType, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { DictionaryService } from '../../service/dictionary.service';
import { map } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-emergency-dispatch-emergency-role-scope-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmergencyRoleScopeEditComponent implements OnInit {
  record: any = {};
  i: any;
  mode: any;
  modalTitle = '';
  selectRoleList:any = [];
  schema: SFSchema = {
    properties: {
      nameList: {
        type: 'string',
        title: '岗位名称',
        ui: {
          widget: 'select',
          mode: 'multiple',
          asyncData: () => {
            return this.http.get(`/service/emergency-base-config/admin/emergencyRoleApi/getPointRoleList`).pipe(
              map((item) => {
                const children = item.data.map((element:any) => {
                  return { label: element.name, value: element.id };
                });
                const type: SFSchemaEnumType = [
                  {
                    label: '角色列表',
                    group: true,
                    children,
                  },
                ];
                return type;
              }),
            );
          },
        } as unknown as SFSelectWidgetSchema,
        change: (ngModel:any) => {
          console.log(ngModel);
        },
        default: null,
      },
      scope: {
        type: 'string',
        title: '可反馈岗位名称',
        ui: {
          widget: 'select',
          mode: 'multiple',
          asyncData: () => {
            return this.http.get(`/service/emergency-base-config/admin/emergencyRoleApi/getPointRoleList`).pipe(
              map((item) => {
                const children = item.data.map((element:any) => {
                  return { label: element.name, value: element.id };
                });
                const type: SFSchemaEnumType = [
                  {
                    label: '角色列表',
                    group: true,
                    children,
                  },
                ];
                return type;
              }),
            );
          },
        } as unknown as SFSelectWidgetSchema,
        change: (ngModel:any) => {
          console.log(ngModel);
        },
        default: null,
      },
    },
    required: ['label', 'parentId'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 200,
      grid: { span: 24 },
    },
  };
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private dictionaryService: DictionaryService,
  ) {}

  ngOnInit(): void {
    this.getAllRole();
    if (this.mode == 'add') {
      this.modalTitle = '新建应急处置要点反馈权限';
    } else if (this.mode == 'edit') {
      console.log(this.i);
      this.i.nameList = [];
      this.i.nameList.push(this.i.name);
      this.modalTitle = '编辑应急处置要点反馈权限，角色： [' + this.i.name + ']';
    }
  }

  save(value: any):any {
    console.log('value:', value);
    if (value.id != '') {
      delete value._values;
    }
    value.thirdPartyAccountId = JSON.parse(<string>localStorage.getItem('employee')).thirdPartyAccountUserId;
    value.settingUserName = JSON.parse(<string>localStorage.getItem('employee')).employeeName;
    this.http.post(`/service/emergency-base-config/admin/emergencyRoleApi/save`, value).subscribe((res) => {
      this.msgSrv.success('保存事件成功');
      this.modal.close(true);
    });
  }

  getAllRole() {
    this.http.get(`/service/emergency-base-config/admin/emergencyRoleApi/getPointRoleList`).subscribe((res) => {
      console.log(res.data);
      const selectRoleList = [];
      for (const item of res.data) {
        const obj = { label: item.name, value: item.id };
        selectRoleList.push(obj);
      }
      this.selectRoleList = selectRoleList;
      console.log(this.selectRoleList);
    });
  }

  close() {
    this.modal.destroy();
  }
}
