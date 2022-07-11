/* eslint-disable */
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFComponent, SFSchema, SFSchemaEnumType, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { map } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SetupContactSelectComponent } from '../../../../shared/components/contact-select/contact-select.component';

@Component({
  selector: 'app-setup-synchronize',
  templateUrl: './synchronize.component.html'
})
export class SetupSynchronizeComponent implements OnInit {
  record: any = {};
  i: any;
  mode: any;
  attendanceGroupEmployeeData: any[] = []; // 考勤组人员信息

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      // attendanceGroupEmployeeIds: {
      //   type: 'string',
      //   title: '考勤组',
      //   enum: this.attendanceGroupEmployeeData,
      //   ui: {
      //     widget: 'tree-select',
      //     multiple: true,
      //     grid: { span: 11 },
      //   } as SFTreeSelectWidgetSchema,
      // },

      // applicationId: { type: 'string', title: '应用id',
      //   default: '',
      //   ui: {
      //     widget: 'select',
      //     asyncData: () => this.http.get(`/service/dispatch/network/stations?lineId=9`).pipe(map(
      //       (value: any) => {
      //         return this.addStationSelectOption(value.data);
      //       }
      //     )),
      //   } as SFSelectWidgetSchema
      // },

      applicationId: {
        type: 'string',
        title: '需要同步企业应用id',
        ui: {
          widget: 'select',
          asyncData: () => {
            return this.http.get(`/service/security/admin/application/list`).pipe(
              map((item) => {
                const children = item.data.map((element: any) => {
                  return { label: element.name, value: element.id };
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
          }
        } as SFSelectWidgetSchema
      }

      // attendanceGroupEmployeeSelect: {
      //   type: 'string',
      //   title: '',
      //   ui: {
      //     spanLabelFixed: 10,
      //     grid: { span: 1 },
      //     widget: 'range-input', // 自定义小部件的KEY
      //     change: () => {
      //       //调用选人控件
      //       this.selectUser();
      //     },
      //   },
      // },
    },
    required: ['owner', 'callNo', 'href', 'description']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150,
      grid: { span: 12 }
    },
    $no: {
      widget: 'text'
    },
    $href: {
      widget: 'string'
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 }
    }
  };

  constructor(private modal: ModalHelper, private modalRef: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {
  }

  ngOnInit(): void {
    if (this.record.id > 0) this.http.get(`/user/${this.record.id}`).subscribe((res) => (this.i = res));
  }

  save(value: any) {
    this.http
      .get(`/service/security/admin/userThirdPartyApi/synchronizeThirdPartyAccountWeb/` + value.applicationId, value)
      .subscribe((res) => {
        this.msgSrv.success('同步成功');
        this.modalRef.close(true);
      });
  }

  selectUser() {
    console.log(this.mode);
    // 如果编辑窗口、就把区域或非区域对应的人信息赋值到控件中
    let selectedItems: any = [];
    // if (this.mode == 'edit') {
    //   let objArea = {};
    //   this.attendanceGroupEmployeeData.map(item => {
    //     objArea = item;
    //     objArea['id'] = item['key'];
    //     objArea['name'] = item['title'];
    //     delete objArea['key'];
    //     delete objArea['title'];
    //     selectedItems.push(objArea);
    //   });
    // }
    let mode = ['employee'];
    this.modal.createStatic(SetupContactSelectComponent, {
      selectedItems: selectedItems,
      mode: mode
    }).subscribe((res) => {
      let tagEmployees:any = []; // 选中的用户数据
      let tagEmployeeIds:any = []; // 选中的用户id

      console.log('res：', res);
      res.selectedItems.forEach(function(value:any) {
        tagEmployees.push({ title: value.name, key: value.id, category: value.category });
        tagEmployeeIds.push(value.id);
      });

      console.log('tagEmployees:', tagEmployees);

      // this.schema.properties.attendanceGroupEmployeeIds.enum = tagEmployees;
      // this.schema.properties.attendanceGroupEmployeeIds.default = tagEmployeeIds;
      this.attendanceGroupEmployeeData = tagEmployees;
      this.i.attendanceGroupEmployeeIds = tagEmployeeIds;
      this.sf.refreshSchema();
      Object.assign(this.i, this.sf.value);
    });
  }

  close() {
    this.modalRef.destroy();
  }
}