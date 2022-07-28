import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema, SFUploadWidgetSchema } from '@delon/form';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {SetupContactSelectComponent} from "../../../../shared/components/contact-select/contact-select.component";

@Component({
  selector: 'app-emergency-dispatch-employee-shift-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmployeeShiftEditComponent implements OnInit {
  record: any = {};
  i: any;
  fileResponse: any; //上传文件返回的数据

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '排班名称' },
      departmentName: { type: 'string', title: '部门' },
      range: {
        type: 'string',
        title: '',
        ui: {
          spanLabelFixed: 10,
          grid: { span: 1 },
          widget: 'range-input', // 自定义小部件的KEY
          change: () => {
            //调用选人控件
            this.selectUser();
          },
        },
      },
      // workMonth: {
      //   type: 'string', title: '月份选择', enum: [
      //     { label: '1月份', value: 1 },
      //     { label: '2月份', value: 2 },
      //     { label: '3月份', value: 3 },
      //     { label: '4月份', value: 4 },
      //     { label: '5月份', value: 5 },
      //     { label: '6月份', value: 6 },
      //     { label: '7月份', value: 7 },
      //     { label: '8月份', value: 8 },
      //     { label: '9月份', value: 9 },
      //     { label: '10月份', value: 10 },
      //     { label: '11月份', value: 11 },
      //     { label: '12月份', value: 12 },
      //   ],
      //   ui: {
      //     widget: 'select',
      //   },
      // },
      workMonth: {
        type: 'string',
        title: '月份',
        format: 'month',
      },
      file: {
        type: 'string',
        title: '上传文件',
        // tslint:disable-next-line:no-object-literal-type-assertion
        ui: {
          widget: 'upload',
          action: `/service/emergency-base-config/admin/adminShiftCategoryApi/planFileUpload`,
          type: 'drag',
          // accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
          limit: 1,
          // hint: '请选择导出后编辑完成的排班文件上传',
          change: (args: any) => {
            console.log('args:', args);
            if (args.type === 'success') {
              if (args.file.response.success) {
                this.fileResponse = args.file.response.data;
                this.msgSrv.success('上传文件成功');
              } else {
                this.msgSrv.error(`上传文件失败${args.file.response.message}`);
              }
            }
          },
        } as SFUploadWidgetSchema,
      },
    },
    required: ['name', 'departmentName', 'workMonth', 'file'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 24 },
    },
    $departmentName: {
      grid: { span: 23 },
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  constructor(
    private modalRef: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private modalSrv: NzModalService,
  ) {}

  ngOnInit(): void {}

  save(value: any):any {
    const workMonth = this.sf.value['workMonth'].split('-');
    console.log('value:', value);
    console.log('year:', workMonth[0]);
    console.log('workMonth:', workMonth[1]);
    value.workMonth = workMonth[1];
    value.year = workMonth[0];
    value.thirdId = JSON.parse(<string>localStorage.getItem('employee')).thirdPartyAccountUserId;
    value.uploaderName = JSON.parse(<string>localStorage.getItem('employee')).employeeName;
    // console.log("value:",value);
    if (!value.departmentId) {
      return this.msgSrv.error('请点击+按钮选择部门,不要手填!');
    }

    this.http.post(`/service/emergency-base-config/admin/AdminShiftClassApi/add`, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success(res.message);
      } else {
        this.modalSrv.confirm({
          nzTitle: '注意！！',
          nzContent: '上传的班表excel错误!' + res.message,
          nzOnOk: () => {},
        });
      }
      this.modalRef.close(true);
    });
  }

  selectUser() {
    let mode = ['organization'];
    this.modal.createStatic(SetupContactSelectComponent, { selectedItems: [], mode: mode }).subscribe((res) => {
      let tagDepartmentId:any= []; //选中的部门数据
      let tagDepartmentNames:any = []; //选中的部门名称
      res.selectedItems.forEach(function (value:any, index:any, array:any) {
        // tagDepartment.push({ title: value.name, key: value.id });
        tagDepartmentNames.push(value.name);
        tagDepartmentId.push(value.id);
        // switch (value.category) {
        //   case 'employee': tagDepartmentNames.push(value.id); break;
        // }
      });

      console.log('tagDepartmentNames:', tagDepartmentNames);

      Object.assign(this.i, this.sf.value);
      if (tagDepartmentNames.length > 1) {
        this.msgSrv.error('不能同时选多个部门!');
      } else if (tagDepartmentNames.length == 1) {
        this.i.departmentName = tagDepartmentNames[0];
        this.i.departmentId = tagDepartmentId[0];
      }

      this.sf.refreshSchema();
    });
  }

  close() {
    this.modalRef.destroy();
  }
}
