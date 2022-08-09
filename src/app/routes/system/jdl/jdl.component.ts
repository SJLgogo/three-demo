import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SystemJdlEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-system-jdl',
  templateUrl: './jdl.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class SystemJdlComponent {
  url = `/service/system/jdl-metadata/page-all`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '应用名称'
      }
    }
  };
  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '序号', type: 'no' },
    { title: '应用名称', index: 'name' },
    { title: '应用描述', index: 'description' },
    { title: '更新时间', type: 'date', index: 'updateTime' },
    {
      title: '',
      buttons: [
        {
          text: '编辑jdl',
          type: 'static',
          click: record => {
            window.open(`/api/service/system/jdl-studio/#/view/${record.id}`);
          }
        },
        { text: '编辑', type: 'modal', modal: { component: SystemJdlEditComponent }, click: 'reload' }
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) {}

  add(): void {
    this.modal.createStatic(SystemJdlEditComponent, { i: { id: '' } }, { size: 600 }).subscribe(() => this.st.reload());
  }

  refresh(): void {
    this.st.reload();
  }
}
