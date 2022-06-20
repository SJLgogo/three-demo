import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { JdlMetadataService } from '../../../../api/system/jdl-metadata.service';

@Component({
  selector: 'app-system-jdl-edit',
  templateUrl: './edit.component.html'
})
export class SystemJdlEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '应用名称', maxLength: 100 },
      description: { type: 'string', title: '应用描述', maxLength: 140 }
    },
    required: ['name']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 }
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
      autosize: { minRows: 4, maxRows: 6 }
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private jdlMetadataService: JdlMetadataService
  ) {}

  ngOnInit(): void {
    if (this.record.id) {
      this.jdlMetadataService.findById(this.record.id).subscribe(res => {
        console.log(res);
        // @ts-ignore
        if (res.success) {
          // @ts-ignore
          this.i = res.data;
        }
      });
    }
  }

  save(value: any): void {
    if (value.id) {
      this.jdlMetadataService.update(value).subscribe(res => {
        console.log(res);
        this.msgSrv.success('修改成功');
        this.modal.close(true);
      });
    } else {
      this.jdlMetadataService.save(value).subscribe(res => {
        console.log(res);
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    }
  }

  close(): void {
    this.modal.destroy();
  }
}
