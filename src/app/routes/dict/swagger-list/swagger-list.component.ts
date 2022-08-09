import { Component, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

import { DictSwaggerEditComponent } from '../swagger-edit/swagger-edit.component';
import { SFSchema } from '@delon/form';

@Component({
  selector: 'app-dict-type-swagger-list',
  templateUrl: './swagger-list.component.html'
})
export class DictSwaggerListComponent {
  url = '/service/dictionary/dict-type-data/page-all';
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };
  columns: STColumn[] = [
    {
      title: '编号',
      index: 'id'
    },
    {
      title: 'systemDictType',
      index: 'systemDictType'
    },
    {
      title: 'label',
      index: 'label'
    },
    {
      title: 'value',
      index: 'value'
    },
    {
      title: 'dictSort',
      index: 'dictSort',
      type: 'number'
    },
    {
      title: '状态',
      index: 'status',
      type: 'number'
    }
  ];
  @ViewChild('st') private readonly st!: STComponent;

  constructor(private http: _HttpClient, private msg: NzMessageService, private modal: ModalHelper) {}

  refresh(): void {
    this.st.reload();
  }

  add(): void {
    this.modal.createStatic(DictSwaggerEditComponent, { i: { id: '' } }, { size: 600 }).subscribe(() => this.st.reload());
  }
}
