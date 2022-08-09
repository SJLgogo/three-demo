import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Constant } from '../../../../common/constant';
import { SystemDictTypeService } from '../../../../api/system/system-dict-type.service';

@Component({
  selector: 'app-system-type-edit',
  templateUrl: './edit.component.html'
})
export class SystemTypeEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '分类名称', maxLength: 255 },
      type: { type: 'string', title: '分类编码', maxLength: 255, pattern: '^[a-z]+(?:_[a-z]+)*$' },
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
    required: ['name', 'type', 'status']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 }
    },
    $status: {
      width: 300,
      widget: 'select'
    },
    $name: {
      widget: 'string'
    },
    $type: {
      widget: 'string'
    },
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
    private systemDictTypeService: SystemDictTypeService
  ) {}

  ngOnInit(): void {
    if (this.record.id) {
      this.systemDictTypeService.findById(this.record.id).subscribe(res => {
        if (res.success) {
          this.i = res.data;
        }
      });
    }
  }

  save(value: any): void {
    if (value.id) {
      this.systemDictTypeService.update(value).subscribe(res => {
        if (res.success) {
          this.msgSrv.success(res.message || '操作成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.message || '操作失败');
        }
      });
    } else {
      this.systemDictTypeService.save(value).subscribe(res => {
        if (res.success) {
          this.msgSrv.success(res.message || '操作成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.message || '操作失败');
        }
      });
    }
  }

  close(): void {
    this.modal.destroy();
  }
}
