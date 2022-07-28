import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema, SFUploadWidgetSchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-schedule-machineSchedule-edit',
  templateUrl: './edit.component.html'
})
export class ScheduleMachineScheduleEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      file: {
        type: 'string',
        title: '上传文件',
        // tslint:disable-next-line:no-object-literal-type-assertion
        ui: {
          widget: 'upload',
          action: `/api/admin/machineClassSchedule/import`,
          type: 'drag',
          accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
          limit: 1,
          hint: '请选择导出后编辑完成的排班文件上传',
          change: (args: any) => {
            if (args.type === 'success') {
              if (args.file.response.success) {
                this.msgSrv.success('导入成功');
              } else {
                this.msgSrv.error(`导入失败${args.file.response.message}`);
              }
            }
          }
        } as SFUploadWidgetSchema
      }
    },
    required: ['file']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 }
    }
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {}

  close() {
    this.modal.destroy();
  }
}
