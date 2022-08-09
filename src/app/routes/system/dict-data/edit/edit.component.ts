import { Component, OnInit } from '@angular/core';
import { SFSchema, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Constant } from '../../../../common/constant';
import { SystemDictDataService } from '../../../../api/system/system-dict-data.service';

@Component({
  selector: 'app-system-dict-data-edit',
  templateUrl: './edit.component.html'
})
export class SystemDictDataEditComponent implements OnInit {
  record: any = {};
  i: any;
  typeId = '';
  schema: SFSchema = {
    properties: {
      label: { type: 'string', title: '名称', maxLength: 255 },
      value: { type: 'string', title: '键值', maxLength: 255, pattern: '^[a-z]+(?:_[a-z]+)*$' },
      sort: { type: 'number', title: '排序', minimum: 0, maximum: 999, default: 999 },
      status: {
        type: 'boolean',
        title: '是否启用',
        enum: Constant.valueDisableOrEnable,
        default: 1,
        ui: {
          width: 300
        }
      },
      comment: { type: 'string', title: '描述', maxLength: 500 }
    },
    required: ['label', 'value', 'sort']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 }
    },
    $status: {
      widget: 'select'
    } as SFSelectWidgetSchema,
    $comment: {
      widget: 'textarea',
      placeholder: '请输入备注信息',
      autosize: { minRows: 2, maxRows: 4 },
      grid: { span: 24 }
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private systemDictDataService: SystemDictDataService
  ) {}

  ngOnInit(): void {
    if (this.i) {
      this.typeId = this.i.typeId;
    }
    if (this.record.id) {
      this.systemDictDataService.findById(this.record.id).subscribe(res => {
        if (res.success) {
          this.i = res.data;
        }
      });
    }
  }

  save(value: any): void {
    value.typeId = this.i.typeId;
    this.systemDictDataService.save(value).subscribe(res => {
      if (res.success) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.message || '保存失败');
      }
    });
  }

  close(): void {
    this.modal.destroy();
  }
}
