import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-fix-phone-info-management-edit',
  templateUrl: './edit.component.html',
})
export class FixPhoneInfoManagementEditComponent implements OnInit {
  record: any = {};
  mode: any;
  i: any;
  modalTitle = '';
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '固话名称', maxLength: 15 },
      telephoneNum: { type: 'string', title: '固话号码', maxLength: 15 },
    },
    required: ['name', 'telephoneNum'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.mode == 'add') {
      this.modalTitle = '添加固话信息';
    } else if (this.mode == 'edit') {
      this.modalTitle = '编辑固话信息 [' + this.i.name + ']';
      // this.i=this.record;
    }
  }

  save(value: any):any {
    if (this.i.id != '') {
      delete value._values;
    }
    value.employeeId = JSON.parse(<string>localStorage.getItem('employee')).employeeId;
    value.employeeName = JSON.parse(<string>localStorage.getItem('employee')).employeeName;;
    // value.category = 'emergencyLevel';
    this.http.post(`/service/emergency-base-config/admin/adminTelephoneApi/save`, value).subscribe((res) => {
      this.msgSrv.success('保存固话信息成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
