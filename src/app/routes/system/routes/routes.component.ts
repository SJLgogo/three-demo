import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STColumnBadge, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { omit } from 'lodash';

import { SystemRoutesEditComponent } from './edit/edit.component';

const BADGE: STColumnBadge = {
  true: { text: '启用', color: 'success' },
  false: { text: '禁用', color: 'error' }
};

@Component({
  selector: 'app-system-routes',
  templateUrl: './routes.component.html'
})
export class SystemRoutesComponent implements OnInit {
  url = `/route-config/page-all`;

  searchSchema: SFSchema = {
    properties: {
      param: {
        type: 'string',
        title: '查询参数',
        ui: {
          width: 300,
          placeholder: '请输入serviceId或者备注'
        }
      },
      dict: {
        type: 'string',
        title: '字典数据',
        ui: {
          placeholder: '请选择请假类型',
          widget: 'dict',
          typeValue: 'system_education',
          loadingTip: 'loading...'
        }
      }
    }
  };
  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '序号', type: 'no' },
    { title: '服务id', index: 'serviceId' },
    { title: '状态', index: 'enable', type: 'badge', badge: BADGE },
    { title: 'openApi', index: 'openApi', type: 'badge', badge: BADGE },
    { title: 'uri', index: 'uri' },
    { title: '排序', index: 'sort' },
    { title: '备注', type: '', index: 'comment' },
    {
      title: '操作',
      buttons: [
        {
          text: '复制',
          type: 'modal',
          click: record => {
            const value = omit(record, ['_rowClassName', '_values', 'id']);
            console.log(value);
            this.modal.createStatic(SystemRoutesEditComponent, { i: value }).subscribe(() => this.st.reload());
          }
        },
        {
          text: '编辑',
          type: 'modal',
          modal: {
            component: SystemRoutesEditComponent
          },
          click: 'reload'
        }
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) {}

  ngOnInit(): void {
    console.log('routes');
  }

  add(): void {
    this.modal.createStatic(SystemRoutesEditComponent, { i: { id: '' } }).subscribe(() => this.st.reload());
  }

  refresh(): void {
    this.st.reload();
  }
}
