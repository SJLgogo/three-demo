import { AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import {
  SFComponent,
  SFSchema,
  SFSelectWidgetSchema,
  SFTransferWidgetSchema,
  SFTreeSelectWidgetSchema,
  SFUISchema,
} from '@delon/form';
import { LineNetworkService } from '../../../service/line-network.service';
import { DictionaryService } from '../../../service/dictionary.service';

import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {SelectProjectPersonComponent} from "../../../../../shared/select-person/select-project-person/select-project-person.component";


@Component({
  selector: 'app-emergency-dispatch-emergency-tag-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchComponentsEditComponent implements AfterViewInit {
  record: any = {};
  i: any;
  mode: any;
  lineData = []; //线路集合数据
  selectLineData = []; //线路选择数据
  stationData: any[] = []; //选中的线路对应的站点数据
  eventCategoryData = []; //事件类别
  eventLevelData = []; //事件等级
  areaData = []; //区域数据
  areaSchemaJson: any; //区域json
  notAreaSchemaJson: any; //非区域json
  area: boolean | undefined; //是否区域
  selectUserDataNotArea: any;
  selectUserDataIsArea: any;
  isSingleSelect: any;

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {},
    ui: {},
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 24 },
    },
    $selectLinesAndStation: {
      widget: 'textarea',
      grid: { span: 24 },
    },
    $stationIds: {
      grid: { span: 24 },
      showSearch: true,
      searchPlaceholder: '搜索',
      listStyle: { 'width.px': 300, 'height.px': 300 },
    },
  };

  ngAfterViewInit(): void {
    //没有区域
    this.notAreaSchemaJson = {
      properties: {
        name: { type: 'string', title: '标签名称' },
        area: {
          type: 'number',
          title: '区域选择',
          enum: [
            { label: '是', value: true },
            { label: '否', value: false },
          ],
          // default: false,
          ui: {
            widget: 'select',
            change: (ngModel: boolean) => {
              if (ngModel == true) {
                Object.assign(this.i, this.sf.value);
                this.i.area = true;
                this.area = true;
                this.sf.refreshSchema(this.areaSchemaJson);
                this.selectLoadAreaData(true);

                //加载所有事件类别
                this.loadEventCategoryData(true);
                //加载所有事件等级
                this.loadEventLevelData(true);
              }
            },
          },
        },

        lineIds: {
          type: 'string',
          title: '线路选择',
          enum: this.lineData,
          ui: {
            widget: 'tree-select',
            multiple: true,
            change: (ngModel: any[]) => {
              Object.assign(this.i, this.sf.value);
              this.i.lineIds = ngModel;
              let selectName = '';
              ngModel.map((lineId: any) => {
                // @ts-ignore
                const line = this.lineData.find((item) => item.key === lineId);
                // @ts-ignore
                selectName = selectName + line.title + '、';
                //去除已经选择整条线路的数据
                this.selectLineData = this.selectLineData.filter(({ value }) => value !== lineId);
              });
              this.notAreaSchemaJson.properties.stationLineIds.enum = this.selectLineData;
              this.sf.refreshSchema();

              // if (selectName) {
              //   this.i.selectLinesAndStation = selectName.substr(0, selectName.length - 1);
              //   this.sf.refreshSchema();
              // }
            },
          } as SFTreeSelectWidgetSchema,
        },
        stationDataType: {
          type: 'string',
          title: '按站点或区域',
          enum: ['按线路所辖选择', '按区域所辖选择'],
          default: '按线路所辖选择',
          // ui: {
          //   change: ngModel => {
          //     this.i.stationDataType = ngModel;
          //   },
          // },
        },
        stationLineIds: {
          type: 'string',
          title: '站点选择',
          enum: this.selectLineData,
          ui: {
            widget: 'tree-select',
            multiple: true,
            change: (ngModel) => {
              /**
               * 需要刷新表单时设置当前的属性值
               */
              // this.i.lineId = ngModel;
              // this.loadStationData(ngModel);
              // Object.assign(this.i, this.sf.value);

              // console.log("按站点或区域:",this.sf.value.stationDataType)

              this.i.stationDataType = this.sf.value['stationDataType'];
              this.i.stationLineIds = ngModel;
              this.loadStationData(ngModel);
            },
          } as SFSelectWidgetSchema,
        },
        areaIds: {
          type: 'string',
          title: '区域选择',
          ui: {
            widget: 'tree-select',
            multiple: true,
            dropdownStyle: { 'max-height': '200px' },
            enum: this.areaData,
            change: (ngModel: any) => {
              Object.assign(this.i, this.sf.value);
              this.i.areaIds = ngModel;
              this.loadStationDataByArea(ngModel);
            },
          } as SFTreeSelectWidgetSchema,
        },
        stationIds: {
          type: 'string',
          title: '站点',
          enum: this.stationData,
          ui: {
            widget: 'transfer',
            titles: ['未关联', '已关联'],
            dropdownStyle: { 'max-height': '200px' },
            change: (options) => {
              // if(options.from=='left'){
              //   let title= options.list.map(a=>a.title);
              //    this.selectStationData.push(title)
              // }else {
              //
              // }
              // this.i.selectLinesAndStation
              // console.log(options);
            },
          } as SFTransferWidgetSchema,
        },
        // selectLinesAndStation: { type: 'string', title: '已选区域/站点' },
        eventCategoryIds: {
          type: 'string',
          title: '事件类别',
          enum: this.eventCategoryData,
          ui: {
            widget: 'tree-select',
            multiple: true,
            dropdownStyle: { 'max-height': '200px' },
            change: (ngModel: any) => {
              Object.assign(this.i, this.sf.value);
              this.i.eventCategoryIds = ngModel;
            },
          } as SFTreeSelectWidgetSchema,
        },
        eventLevelIds: {
          type: 'string',
          title: '事件等级',
          enum: this.eventLevelData,
          ui: {
            widget: 'tree-select',
            multiple: true,
            dropdownStyle: { 'max-height': '200px' },
            change: (ngModel: any) => {
              Object.assign(this.i, this.sf.value);
              this.i.eventLevelIds = ngModel;
            },
          } as SFTreeSelectWidgetSchema,
        },
        selectEmployeeIds: {
          type: 'string',
          title: '标签对应人员',
          enum: this.selectUserDataNotArea,
          ui: {
            widget: 'tree-select',
            multiple: true,
            grid: { span: 23 },
          } as SFTreeSelectWidgetSchema,
        },
        range: {
          type: 'string',
          title: '',
          ui: {
            spanLabelFixed: 10,
            grid: { span: 1 },
            widget: 'range-input', // 自定义小部件的KEY
            change: () => {
              //调用选人控件
              this.i = this.sf.value;
              this.selectUser();
            },
          },
        },
      },
      required: ['stationDataType'],
      if: {
        properties: { stationDataType: { enum: ['按线路所辖选择'] } },
      },
      then: {
        required: ['stationLineIds'],
      },
      else: {
        required: ['areaIds'],
      },
    };

    //区域的json数据格式
    this.areaSchemaJson = {
      properties: {
        /* name: { type: 'string', title: '标签名称' },
        area: {
          type: 'number',
          title: '区域选择',
          enum: [
            { label: '是', value: true },
            { label: '否', value: false },
          ],
          default: true,
          ui: {
            widget: 'select',
            change: (ngModel) => {
              if (ngModel == false) {
                Object.assign(this.i, this.sf.value);
                this.area = false;
                this.i.area = false;
                this.sf.refreshSchema(this.notAreaSchemaJson);
                //加载所有事件类别
                this.loadEventCategoryData(false);
                //加载所有事件等级
                this.loadEventLevelData(false);
                //加载所有线路信息
                this.loadLineData();
                this.selectLoadLineData();
                //加载区域信息
                this.selectLoadAreaData(false);
                //加载区域对应的站点
                this.loadStationDataByArea(this.i.areaIds);
              }
            },
          },
        },
        areaIds: {
          type: 'string',
          title: '区域选择',
          ui: {
            widget: 'tree-select',
            multiple: true,
            dropdownStyle: { 'max-height': '200px' },
            enum: this.areaData,
            // asyncData: () => {
            //   return  this.http.get(`/service/emergency-base-config/admin/adminAreaApi/findAllArea`).pipe(map(item=>{
            //     return  item.data.map(element => {
            //       return { title: element.name, key: element.id };
            //     });
            //   }));
            // },
            change: (ngModel) => {
              Object.assign(this.i, this.sf.value);
              this.i.areaIds = ngModel;
            },
          } as SFTreeSelectWidgetSchema,
        },
        // selectLinesAndStation: { type: 'string', title: '已选区域/站点' },
        eventCategoryIds: {
          type: 'string',
          title: '事件类别',
          enum: this.eventCategoryData,
          ui: {
            widget: 'tree-select',
            multiple: true,
            dropdownStyle: { 'max-height': '200px' },
            change: (ngModel) => {
              Object.assign(this.i, this.sf.value);
              this.i.eventCategoryIds = ngModel;
            },
          } as SFTreeSelectWidgetSchema,
        },
        eventLevelIds: {
          type: 'string',
          title: '事件等级',
          dropdownStyle: { 'max-height': '200px' },
          enum: this.eventLevelData,
          ui: {
            widget: 'tree-select',
            multiple: true,
            change: (ngModel) => {
              Object.assign(this.i, this.sf.value);
              this.i.eventLevelIds = ngModel;
            },
          } as SFTreeSelectWidgetSchema,
        }, */
        selectEmployeeIds: {
          type: 'string',
          title: '添加人员',
          enum: this.selectUserDataIsArea,
          ui: {
            widget: 'tree-select',
            multiple: true,
            grid: { span: 23 },
          } as SFTreeSelectWidgetSchema,
        },
        range: {
          type: 'string',
          title: '',
          ui: {
            spanLabelFixed: 10,
            grid: { span: 1 },
            widget: 'range-input', // 自定义小部件的KEY
            change: () => {
              //调用选人控件
              this.selectUser();
            },
          },
        },
      },
    };

    //特殊字段赋值。不管是不是区域标签都先加载区域数据
    this.selectLoadAreaData(false);

    //判断是否编辑
    if (this.mode == 'edit') {
      // console.log('data:', this.i);
      this.http.get(`/service/emergency-base-config/admin/adminTagApi/getDtoTag/` + this.i.id).subscribe((res) => {
        if (res.success) {
          this.i = res.data;
          console.log('edit-tag-res:', this.i);
          if (this.i.area == true) {
            this.selectUserDataIsArea = this.i.selectEmployeeVos;
            this.sf.refreshSchema(this.areaSchemaJson);
            this.selectLoadAreaData(true);
            // this.selectUserDataIsArea = [{title: "成都地铁运营", key: "40289f4a6f892492016f892bd26a04ad", category: "organization"}];
            ////加载关联人信息
            this.areaSchemaJson.properties.selectEmployeeIds.enum = this.selectUserDataIsArea;
            this.areaSchemaJson.properties.selectEmployeeIds.default = this.i.selectEmployeeIds;
          } else {
            this.selectUserDataNotArea = this.i.selectEmployeeVos;
            this.sf.refreshSchema(this.notAreaSchemaJson);
            //加载所有线路信息
            this.loadLineData();
            this.selectLoadLineData();
            this.loadStationData(this.i.stationLineIds);
            this.notAreaSchemaJson.properties.stationIds.default = this.i.stationIds;
            //加载关联人信息
            this.notAreaSchemaJson.properties.selectEmployeeIds.enum = this.selectUserDataNotArea;
            this.notAreaSchemaJson.properties.selectEmployeeIds.default = this.i.selectEmployeeIds;
            this.sf.refreshSchema();
          }
          //加载所有事件类别
          this.loadEventCategoryData(this.i.area);
          //加载所有事件等级
          this.loadEventLevelData(this.i.area);
        }
      });
    } else {
      this.area = true;
      //默认加载区域的
      this.sf.refreshSchema(this.areaSchemaJson);
      this.selectLoadAreaData(true);
      //加载所有事件类别
      this.loadEventCategoryData(true);
      //加载所有事件等级
      this.loadEventLevelData(true);
    }
  }

  constructor(
    private modalRef: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private lineNetworkService: LineNetworkService,
    private dictionaryService: DictionaryService,
    private modal: ModalHelper,
  ) {}

  ngOnInit(): void {}

  /**
   * 加载所有事件类别
   */
  loadEventCategoryData(area: boolean) {
    this.area = area;
    this.dictionaryService.getAllDictionaryByCategory('emergencyCategory').subscribe((res) => {
      this.eventCategoryData = res.data.map((element: { label: any; id: any; }) => {
        return { title: element.label, key: element.id };
      });

      let allKey = [{ title: '全部事件类别', key: 'allCategoryId' }];
      let allEventCategoryData = [...allKey, ...this.eventCategoryData];

      // console.log('全部事件类别:',allEventCategoryData,area);

      /*  if (area) {
        this.areaSchemaJson.properties.eventCategoryIds.enum = allEventCategoryData;
      } else {
        this.notAreaSchemaJson.properties.eventCategoryIds.enum = allEventCategoryData;
      } */
      this.sf.refreshSchema();
    });
  }

  /**
   * 加载所有事件等级
   */
  loadEventLevelData(area: boolean) {
    this.area = area;
    this.dictionaryService.getAllDictionaryByCategory('emergencyLevel').subscribe((res) => {
      this.eventLevelData = res.data.map((element: { label: any; id: any; }) => {
        return { title: element.label, key: element.id };
      });
      let allKey = [{ title: '全部事件等级', key: 'allLevelId' }];
      let allEventLevelData = [...allKey, ...this.eventLevelData];

      /*   if (area) {
        this.areaSchemaJson.properties.eventLevelIds.enum = allEventLevelData;
      } else {
        this.notAreaSchemaJson.properties.eventLevelIds.enum = allEventLevelData;
      } */
      this.sf.refreshSchema();
    });
  }

  /**
   * 加载所有线路信息
   */
  loadLineData() {
    this.lineNetworkService.findAllLine().subscribe((res) => {
      this.lineData = res.data.map((element: { name: any; id: any; }) => {
        return { title: element.name, key: element.id };
      });
      this.notAreaSchemaJson.properties.lineIds.enum = this.lineData;
      this.sf.refreshSchema();
    });
  }

  /**
   * 加载站点线路数据
   */
  selectLoadLineData() {
    this.lineNetworkService.findAllLine().subscribe((res) => {
      this.selectLineData = res.data.map((element: { name: any; id: any; }) => {
        return { title: element.name, key: element.id };
      });
      this.notAreaSchemaJson.properties.stationLineIds.enum = this.selectLineData;
      this.sf.refreshSchema();
    });
  }

  /**
   * 获取站点信息
   */
  loadStationData(lineIds: any) {
    this.lineNetworkService.getAllStationsByLineIds({ lineIds: lineIds }).subscribe((res) => {
      this.stationData = res.data.map((element: { metroLineName: string; name: string; id: any; }) => {
        return { title: element.metroLineName + '_' + element.name, value: element.id };
      });
      this.notAreaSchemaJson.properties.stationIds.enum = this.stationData;
      this.notAreaSchemaJson.properties.stationIds.default = lineIds;
      this.sf.refreshSchema();
    });
  }

  /**
   * 获取某个区域对应的站点
   * @param lineIds
   */
  loadStationDataByArea(areaIds: any) {
    console.log('areaIds:', areaIds);
    if (areaIds) {
      this.http.post(`/service/emergency-base-config/admin/adminAreaApi/findStationByAreaIds`, areaIds).subscribe((res) => {
        this.stationData = res.data.map((element: { metroLineName: string; name: string; id: any; }) => {
          return { title: element.metroLineName + '_' + element.name, value: element.id };
        });
        this.notAreaSchemaJson.properties.stationIds.enum = this.stationData;
        this.sf.refreshSchema();
      });
    }
  }

  /**
   * 加载应急区域数据
   */
  selectLoadAreaData(area: boolean) {
    this.area = area;
    this.http.get(`/service/emergency-base-config/admin/adminAreaApi/findAllArea`).subscribe((res) => {
      this.areaData = res.data.map((element: { name: any; id: any; }) => {
        return { title: element.name, key: element.id };
      });
      let allKey = [{ title: '全部区域', key: 'allAreaId' }];
      let allAreaData = [...allKey, ...this.areaData];

      /*  if (area) {
        this.areaSchemaJson.properties.areaIds.enum = allAreaData;
      } else {
        this.notAreaSchemaJson.properties.areaIds.enum = allAreaData;
      } */
      this.sf.refreshSchema();
    });
  }
  selectedItems = [];
  // selectUserNameData;//选中的用户名称
  //{category: "employee", id: "40289f4a6f892492016f8932bcda09bc", name: "刘海涛"}
  selectUser() {
    //如果编辑窗口、就把区域或非区域对应的人信息赋值到控件中

    const mode = ['employee'];
    let multiple = '';
    this.modal
      // .createStatic(SetupContactSelectComponent, { selectedItems: this.selectedItems, mode: mode, isSingleSelect: this.isSingleSelect })
      .createStatic(SelectProjectPersonComponent, {
        chooseMode: 'employee', // department organization employee
        functionName: 'not-clock',
        selectList: this.selectedItems
      })
      .subscribe((res) => {
        let tagEmployees: { title: any; key: any; category: any; icon: any; }[] = []; //选中的用户数据
        let tagEmployeeIds: any[] = []; //选中的用户id
        let tagOrganizationIds = []; //选中的部门id
        console.log('res：', res);
        res.selectList.forEach(function (value: { name: any; thirdPartyAccountUserId: any; category: any; icon: any; }, index: any, array: any) {
          tagEmployees.push({ title: value.name, key: value.thirdPartyAccountUserId, category: value.category, icon: value.icon });
          tagEmployeeIds.push(value.thirdPartyAccountUserId);
        });

        console.log('tagEmployees:', tagEmployees);
        this.i.selectEmployeeIds = tagEmployeeIds;
        this.areaSchemaJson.properties.selectEmployeeIds.enum = tagEmployees;
        this.sf.refreshSchema();
        Object.assign(this.i, this.sf.value);
        // this.sf.refreshSchema();
      });
  }

  save(value: any) {
    this.modalRef.close(this.selectedItems);
    console.log(this.selectedItems);
  }

  close() {
    this.modalRef.destroy();
  }
}
