import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-dict-swagger-edit',
  templateUrl: './swagger-edit.component.html'
})
export class DictSwaggerEditComponent implements OnInit {
  // @ts-ignore
  id = this.route.snapshot.params.id;
  i: any;
  record: any;
  schema: SFSchema = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        title: '编号'
      },
      label: {
        type: 'string'
      },
      value: {
        type: 'string'
      },
      dictSort: {
        type: 'integer'
      },
      status: {
        type: 'integer',
        title: '状态'
      }
    }
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 }
    }
  };

  constructor(
    private route: ActivatedRoute,
    public location: Location,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: NzModalRef
  ) {}

  ngOnInit(): void {
    if (this.id > 0) this.http.get(`/dict-data/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    this.http.post(`/dict-data/${this.record.id}`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }
}
