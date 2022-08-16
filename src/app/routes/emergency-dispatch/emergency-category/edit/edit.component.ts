import {Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {SFSchema, SFSchemaEnumType, SFSelectWidgetSchema, SFUISchema} from '@delon/form';
import {DictionaryService} from '../../service/dictionary.service';
import {map} from 'rxjs/operators';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-emergency-dispatch-emergency-category-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmergencyCategoryEditComponent implements OnInit {
  record: any = {};
  i: any;
  mode: any;
  selectedValue: any;
  optionList:any = [];
  modalTitle = '';
  schema: SFSchema = {
    properties: {
      label: {type: 'string', title: '类型名称', maxLength: 15},
      // parentId: {
      //   type: 'string',
      //   title: '大类名称',
      //   // tslint:disable-next-line:no-object-literal-type-assertion
      //   ui: {
      //     widget: 'select',
      //     size: "100px",
      //     placeholder: "请选择对应的大类名称",
      //     dropdownMatchSelectWidth: true,
      //     asyncData: () => {
      //       return this.dictionaryService.getAllDictionaryByCategory('emergencyBigCategory').pipe(
      //         map((item) => {
      //           const children = item.data.map((element: any) => {
      //             return {label: element.label, value: element.id};
      //           });
      //           const type: SFSchemaEnumType = [
      //             {
      //               label: '大类列表',
      //               group: true,
      //               children,
      //             },
      //           ];
      //           return type;
      //         }),
      //       );
      //     },
      //     change: (ngModel: any) => {
      //       /**
      //        * 需要刷新表单时设置当前的属性值
      //        */
      //       this.i.parentId = ngModel;
      //     },
      //   } as unknown as SFSelectWidgetSchema,
      // },
    },
    required: ['label', 'parentId'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: {span: 12},
    },
    $parentId: {
      spanLabelFixed: 100,
      grid: {span: 40},
      listStyle: {'width.px': 300, 'height.px': 300},
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private dictionaryService: DictionaryService,
  ) {
  }


  ngOnInit(): void {
    if (this.mode == 'add') {
      this.modalTitle = '添加事件类型';
    } else if (this.mode == 'edit') {
      this.modalTitle = '编辑事件类型 [' + this.record.label + ']';
      this.i = this.record;
    }
    this.getBigCategoryList();
  }

  save(value: any): any {
    console.log('value:', value);
    if (value.id != '') {
      delete value._values;
    }
    value.category = 'emergencyCategory';
    this.http.post(`/service/emergency-base-config/admin/dictionary/add`, value).subscribe((res) => {
      this.msgSrv.success('保存事件成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }

  getBigCategoryList(): void {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/emergencyBigCategory`).subscribe((res) => {
      var list = res.data;
      console.log(list);
      for (var j = 0; j < list.length; j++) {
        var data = {
          label: list[j].label,
          value: list[j].id,
        };
        this.optionList.push(data);
      }
    });
  }

  log(value: { label: string; value: number;}): void {
    console.log(value);
    this.i.parentId = value.value;
  }
}
