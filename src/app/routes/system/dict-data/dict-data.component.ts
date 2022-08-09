import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SystemDictDataService } from '../../../api/system/system-dict-data.service';
import { ActivatedRoute } from '@angular/router';
import { SystemDictDataEditComponent } from './edit/edit.component';
import { Constant } from '../../../common/constant';

@Component({
  selector: 'app-system-dict-data',
  templateUrl: './dict-data.component.html'
})
export class SystemDictDataComponent implements OnInit {
  params = { typeId: '' };
  url = '/service/dictionary/dict-data/page-all';
  searchSchema: SFSchema = {
    properties: {
      param: {
        type: 'string',
        title: '查询参数',
        ui: {
          width: 300,
          placeholder: '请输入名称、键值、备注'
        }
      }
    }
  };
  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '序号', type: 'no' },
    { title: '名称', index: 'label' },
    { title: '键值', index: 'value' },
    { title: '排序', type: 'number', index: 'sort' },
    { title: '状态', index: 'status', type: 'tag', tag: Constant.valueDisableOrEnableTag },
    { title: '描述', index: 'comment' },
    {
      title: '',
      buttons: [
        {
          text: '启用',
          iif: (item: STData): boolean => {
            return 0 == item['status'];
          },
          click: (item: STData) => {
            item['status'] = 1;
            this.systemDictDataService.update(item).subscribe(res => {
              if (res.success) {
                this.st.reload();
              }
            });
          }
        },
        {
          text: '禁用',
          iif: (item: STData): boolean => {
            return 1 == item['status'];
          },
          click: (item: STData) => {
            item['status'] = 0;
            this.systemDictDataService.update(item).subscribe(res => {
              if (res.success) {
                this.st.reload();
              }
            });
          }
        },
        { text: '编辑', type: 'modal', modal: { component: SystemDictDataEditComponent }, click: 'reload' }
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private systemDictDataService: SystemDictDataService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.params.typeId = params['id'];
    });
  }

  ngOnInit(): void {}

  add(): void {
    this.modal
      .createStatic(SystemDictDataEditComponent, {
        i: {
          id: '',
          typeId: this.params.typeId
        }
      })
      .subscribe(() => this.st.reload());
  }

  refresh(): void {
    this.st.reload();
  }
}
