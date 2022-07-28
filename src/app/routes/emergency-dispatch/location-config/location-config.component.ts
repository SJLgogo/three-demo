import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Base } from '../../../api/common/base';
import { EmergencyDispatchLocationConfigEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-emergency-dispatch-location-config',
  templateUrl: './location-config.component.html'
})
export class EmergencyDispatchLocationConfigComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/adminLocationConfigApi/findAll`;

  searchSchema: SFSchema = {
    properties: {
      // no: {
      //   type: 'string',
      //   title: '编号'
      // }
    }
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '范围(米)', index: 'scope' },
    {
      title: '是否应急',
      index: 'emergency',
      format: function (item, col) {
        if (item.emergency == 1) {
          return '应急情况';
        } else {
          return '非应急情况';
        }
      }
    },
    {
      title: '',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService) {
    super();
  }

  ngOnInit() {}

  add() {
    this.modal.createStatic(EmergencyDispatchLocationConfigEditComponent, { i: { id: 0 } }).subscribe(() => this.st.reload());
  }
}
