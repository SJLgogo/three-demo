import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { EmergencyDispatchEmployeeShiftCategoryEditComponent } from './edit/edit.component';
import { environment } from '@env/environment';
import { STColumn, STComponent } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import {Base} from "../../../api/common/base";

@Component({
  selector: 'app-emergency-dispatch-employee-shift-category',
  templateUrl: './employee-shift-category.component.html',
})
export class EmergencyDispatchEmployeeShiftCategoryComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/adminShiftCategoryApi/findAll`;
  searchSchema: SFSchema = {
    properties: {
      category: {
        type: 'string',
        title: '班次类型名称',
      },
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '班次类型名称', index: 'category', sort: true },
    { title: '时间段', index: 'workTimes' },
    // { title: '结束时间1',  index: 'endTime1',sort:true  },
    // { title: '是否跨天1',  index: 'across1',sort:true,format: function(item, col){
    //     if( item.across == false){
    //       return '否';
    //     }else{
    //       return '是';
    //     }
    //   }},
    {
      title: '',
      buttons: [
        {
          text: '删除',
          icon: 'delete',
          type: 'del',
          click: (item: any) => {
            if (this.isPermission('emergency-shift-category:button:delete', this.settingsService.app['identifiers'])) {
              this.remove(item);
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          },
        },
      ],
    },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public settingsService: SettingsService,
    private messageService: NzMessageService,
  ) {
    super();
  }

  remove(record:any) {
    this.http
      .delete(`/service/emergency-base-config/admin/adminShiftCategoryApi/delete/` + record.id)
      .subscribe((res) => {
        if (res.success) {
          this.messageService.success(res.message);
          this.st.reload();
        }
      });
  }

  ngOnInit() {}
  add() {
    this.modal
      .createStatic(EmergencyDispatchEmployeeShiftCategoryEditComponent, { i: { id: 0 }, mode: 'add' })
      .subscribe(() => this.st.reload());

    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }
}
