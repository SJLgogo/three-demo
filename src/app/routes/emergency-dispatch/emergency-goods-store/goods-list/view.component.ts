import { AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SFComponent, SFSchema, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { STColumn, STComponent } from '@delon/abc/st';
import {Base} from "../../../../common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-goods-list-view',
  templateUrl: './view.component.html',
})
export class EmergencyDispatchGoodsListComponent extends Base implements OnInit, AfterViewInit {
  i: any;
  id: any;
  constructor(private modal: NzModalRef, private http: _HttpClient, private messageService: NzMessageService) {
    super();
  }
  // @ts-ignore
  url = `/service/supplies-system/admin/suppliesWarehouseAdminApi/getSuppliesListByWarehouseId/` + this.i;
  tagList = [];
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      matName: {
        type: 'string',
        title: '物资名称',
      },
      sceneTagName: {
        type: 'string',
        title: '物资使用场景标签',
        enum: this.tagList,
        ui: {
          widget: 'select',
          placeholder: '请输入',
          width: 270,
          // dropdownStyle: { 'max-height': '200px' },
        } as SFSelectWidgetSchema,
      },
    },
  };

  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '物资名称', width: 135, index: 'matName' },
    {
      title: '物资使用场景标签',
      width: 150,
      index: 'suppliesSceneTagVOS',
      // @ts-ignore
      format: (item: any, col: any) => {
        const arr = [];
        if (item.suppliesSceneTagVOS && item.suppliesSceneTagVOS.length > 0) {
          for (const suppliesSceneTagVO of item.suppliesSceneTagVOS) {
            arr.push(suppliesSceneTagVO.tagName);
          }
          return arr.toString();
        }
      },
    },
    { title: '规格型号', width: 150, index: 'matSpec' },
    { title: '数量', width: 135, index: 'matCount' },
    { title: '单位', width: 120, index: 'matUnit' },
  ];
  ngOnInit(): void {
    this.getAllGoodCategory();
    this.url = `/service/supplies-system/admin/suppliesWarehouseAdminApi/getSuppliesListByWarehouseId/` + this.i;
  }

  ngAfterViewInit(): void {}

  getAllGoodCategory() {
    this.http.get(`/service/supplies-system/admin/SuppliesSceneTagAdminApi/getSuppliesSceneTagList`).subscribe((res) => {
      if (res.success) {
        console.log(res.data);
        const data:any = [];
        res.data.forEach((item:any) => {
          data.push({ label: item.tagName, value: item.tagName });
        });
        this.tagList = data;
        // @ts-ignore
        this.searchSchema.properties.sceneTagName.enum = this.tagList;
        this.sf.refreshSchema();
      }
    });
  }

  cancel() {
    this.modal.close(true);
  }
}
