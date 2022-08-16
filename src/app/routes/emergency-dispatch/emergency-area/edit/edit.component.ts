import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFSelectWidgetSchema, SFTransferWidgetSchema, SFTreeSelectWidgetSchema, SFUISchema } from '@delon/form';
import { LineNetworkService } from '../../service/line-network.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-emergency-dispatch-emergency-area-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmergencyAreaEditComponent implements OnInit {
  record: any = {};
  i: any;
  mode: any;
  modalTitle = '';
  stationData: any[] = []; // 选中的线路对应的站点数据
  lineData = [];
  selectLineData = []; // 线路选择数据
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '区域名称', maxLength: 15 },
      lineIds: {
        type: 'string',
        title: '线路选择',
        enum: this.lineData,
        ui: {
          widget: 'tree-select',
          multiple: true,
          change: (ngModel:any) => {
            Object.assign(this.i, this.sf.value);
            this.i.lineIds = ngModel;
            ngModel.map((lineId:any) => {
              // 去除已经选择整条线路的数据
              this.selectLineData = this.selectLineData.filter(({ value }) => value !== lineId);
            });
            // @ts-ignore
            this.schema.properties.lineId.enum = this.selectLineData;
            this.sf.refreshSchema();
          },
        } as SFTreeSelectWidgetSchema,
      },
      lineId: {
        type: 'string',
        title: '站点线路',
        enum: this.selectLineData,
        ui: {
          widget: 'tree-select',
          multiple: true,
          change: (ngModel) => {
            Object.assign(this.i, this.sf.value);
            /**
             * 需要刷新表单时设置当前的属性值
             */
            this.i.lineId = ngModel;
            this.loadStationData(ngModel);
          },
        } as SFSelectWidgetSchema,
      },
      stationIds: {
        type: 'string',
        title: '站点',
        enum: this.stationData,
        ui: {
          widget: 'transfer',
          titles: ['未关联', '已关联'],
          change: (options) => {
            console.log(options);
          },
        } as SFTransferWidgetSchema,
      },
    },
    required: ['name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $stationIds: {
      grid: { span: 24 },
      showSearch: true,
      searchPlaceholder: '搜索',
      listStyle: { 'width.px': 300, 'height.px': 300 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private lineNetworkService: LineNetworkService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadLineData();
    this.selectLoadLineData();
    if (this.mode == 'add') {
      this.modalTitle = '添加区域';
    } else if (this.mode == 'edit') {
      this.modalTitle = '编辑区域 [' + this.i.name + ']';
      this.loadAreaInfo(this.i.id);
    }
  }

  /**
   * 加载某个区域
   * @param areaId
   */
  loadAreaInfo(areaId:any) {
    this.http.get(`/service/emergency-base-config/admin/adminAreaApi/getDtoArea/` + areaId).subscribe((res) => {
      console.log(res.data);
      this.i = res.data;
      this.loadStationData(this.i.lineId.toString());
      // this.schema.properties.stationIds.enum=this.stationData;
      // @ts-ignore
      this.schema.properties.stationIds.default = this.i.stationIds;
      this.sf.refreshSchema();
    });
  }

  save(value: any):any {
    if (this.mode == 'add') {
      this.http.post(`/service/emergency-base-config/admin/adminAreaApi/add`, value).subscribe((res) => {
        this.msgSrv.success('保存区域成功');
        this.modal.close(true);
      });
    } else if (this.mode == 'edit') {
    }
  }

  /**
   * 加载所有线路信息
   */
  loadLineData() {
    this.lineNetworkService.findAllLine().subscribe((res) => {
      this.lineData = res.data.map((element:any) => {
        return { title: element.name, key: element.id };
      });
      // @ts-ignore
      this.schema.properties.lineIds.enum = this.lineData;
      this.sf.refreshSchema();
    });
  }

  /**
   * 获取站点信息
   */
  loadStationData(lineIds: any) {
    this.lineNetworkService.getAllStationsByLineIds({ lineIds: lineIds }).subscribe((res) => {
      this.stationData = res.data.map((element:any) => {
        return { title: element.metroLineName + '_' + element.name, value: element.id };
      });
      // @ts-ignore
      this.schema.properties.stationIds.enum = this.stationData;
      this.sf.refreshSchema();
    });
  }

  /**
   * 加载站点线路数据
   */
  selectLoadLineData() {
    this.lineNetworkService.findAllLine().subscribe((res) => {
      this.selectLineData = res.data.map((element:any) => {
        return { title: element.name, key: element.id };
      });
      // @ts-ignore
      this.schema.properties.lineId.enum = this.selectLineData;
      this.sf.refreshSchema();
    });
  }

  close() {
    this.modal.destroy();
  }
}
