import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-emergency-dispatch-emergency-big-category-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmergencyBigCategoryEditComponent implements OnInit {
  record: any = {};
  i: any;
  modalTitle = '';
  schema: SFSchema = {
    properties: {
      label: { type: 'string', title: '大类型名称', maxLength: 15 },
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
    if (this.i.id != '') {
      this.modalTitle = '编辑事件大类';
    } else {
      this.modalTitle = '添加事件大类';
    }
  }

  save(value: any):any {
    if (this.i.id != '') {
      delete value._values;
    }
    console.log('value', value);
    value.category = 'emergencyBigCategory';
    this.http.post(`/service/emergency-base-config/admin/dictionary/addBig`, value).subscribe((res) => {
      this.msgSrv.success('保存事件成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
