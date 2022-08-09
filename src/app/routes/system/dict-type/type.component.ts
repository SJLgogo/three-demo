import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SystemTypeEditComponent } from './edit/edit.component';
import { SystemDictTypeService } from '../../../api/system/system-dict-type.service';
import { Router } from '@angular/router';
import { Constant } from '../../../common/constant';

@Component({
  selector: 'app-system-dict-type',
  templateUrl: './type.component.html'
})
export class SystemDictTypeComponent implements OnInit {
  url = '/service/dictionary/dict-type/page-all';
  searchSchema: SFSchema = {
    properties: {
      param: {
        type: 'string',
        title: '查询参数',
        ui: {
          width: 300,
          placeholder: '请输入名称、编码、备注'
        }
      }
    }
  };
  @ViewChild('st') private readonly st!: STComponent;

  columns: STColumn[] = [
    { title: '序号', type: 'no' },
    { title: '名称', index: 'name' },
    {
      title: '编码',
      index: 'type',
      type: 'link',
      click: (item: STData) => {
        this.router.navigate([`/system/dict-data/${item['id']}`]).then(res => {});
      }
    },
    { title: '状态', index: 'status', type: 'tag', tag: Constant.valueDisableOrEnableTag },
    { title: '备注', index: 'comment' },
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
            this.systemDictTypeService.update(item).subscribe(res => {
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
            this.systemDictTypeService.update(item).subscribe(res => {
              if (res.success) {
                this.st.reload();
              }
            });
          }
        },
        { text: '编辑', type: 'modal', modal: { component: SystemTypeEditComponent }, click: 'reload' }
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private systemDictTypeService: SystemDictTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  add(): void {
    this.modal.createStatic(SystemTypeEditComponent, { i: { id: '' } }).subscribe(() => this.st.reload());
  }

  refresh(): void {
    this.st.reload();
  }
}
