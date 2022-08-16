import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-emergency-dispatch-emergency-level-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmergencyLevelEditComponent implements OnInit {
  record: any = {};
  i: any;
  modalTitle = '';
  schema: SFSchema = {
    properties: {
      label: { type: 'string', title: '等级名称', maxLength: 15 },
    },
    required: ['label'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.i.id == '') {
      this.modalTitle = '添加事件等级';
    } else {
      this.modalTitle = '编辑事件等级 [' + this.i.label + ']';
      // this.i=this.record;
    }
  }

  save(value: any) {
    if (this.i.id != '') {
      delete value._values;
    }
    value.category = 'emergencyLevel';
    this.http.post(`/service/emergency-base-config/admin/dictionary/addLevel`, value).subscribe((res) => {
      this.msgSrv.success('保存等级成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
