import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SystemConfigService } from '../../../../api/system/system-config.service';

@Component({
  selector: 'app-system-config-edit',
  templateUrl: './edit.component.html'
})
export class SystemConfigEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 30 },
      value: { type: 'string', title: '键值', maxLength: 30, pattern: '^[a-z]+(?:_[a-z]+)*$' },
      content: { type: 'string', title: '内容', maxLength: 999 },
      description: { type: 'string', title: '描述', maxLength: 999 }
    },
    required: ['name', 'value', 'content']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 }
    },
    $content: {
      widget: 'textarea',
      placeholder: '请输入内容',
      autosize: { minRows: 2, maxRows: 4 },
      grid: { span: 24 }
    },
    $description: {
      placeholder: '请输入备注信息',
      autosize: { minRows: 2, maxRows: 4 },
      widget: 'textarea',
      grid: { span: 24 }
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private systemConfigService: SystemConfigService,
    public http: _HttpClient
  ) {}

  ngOnInit(): void {
    if (this.record.id) {
      this.i = this.record;
    } else {
      this.i = {};
    }
  }

  save(value: any): void {
    this.systemConfigService.saveSystemConfig(value).subscribe(res => {
      if (res.success) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error('保存失败');
      }
    });
  }

  close(): void {
    this.modal.destroy();
  }
}
