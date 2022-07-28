import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFDateWidgetSchema, SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { dateTimePickerUtil } from '@delon/util';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Base } from '../../../api/common/base';

@Component({
  selector: 'app-emergency-dispatch-system-log',
  templateUrl: './system-log.component.html'
})
export class EmergencyDispatchSystemLogComponent extends Base implements OnInit {
  url = `/service/emergency-event/admin/system-log/query`;
  logCustomRequest: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize'
    },
    params: { startDateTime: Date, endDateTime: Date }
  };
  searchSchema: SFSchema = {
    properties: {
      name: { type: 'string', title: '描述' },
      employeeName: { type: 'string', title: '操作人名' },
      startDateTime: {
        type: 'string',
        title: '开始时间',
        format: 'date-time',
        ui: {
          inputReadOnly: true,
          widget: 'date'
        } as SFDateWidgetSchema
      },
      endDateTime: {
        type: 'string',
        title: '结束时间',
        format: 'date-time',

        ui: {
          widget: 'date',
          inputReadOnly: true
        } as SFDateWidgetSchema
      }
    }
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '描述', index: 'description', width: 200 },
    { title: '操作方法', index: 'methodName' },
    {
      title: '操作时间',
      index: 'operationTime',
      format: (item: any, col: any) => {
        return dateTimePickerUtil.format(item.operationTime, 'yyyy-MM-dd HH:mm:ss');
      }
    },
    {
      title: '操作人员',
      index: 'employeeName'
    },
    {
      title: '是否成功',
      index: 'status',
      format: (item: any, col: any) => {
        if (item.status) {
          return '是';
        } else {
          return '否';
        }
      }
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, public settingsService: SettingsService) {
    super();
  }

  ngOnInit() {}
}
