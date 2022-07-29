import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFComponent, SFSchema, SFTreeSelectWidgetSchema, SFSelectWidgetSchema, SFDateWidgetSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmergencyDispatchEmergencyWatchOverManagementEditComponent } from './edit/edit.component';
import { dateTimePickerUtil } from '@delon/util';
import { STColumn, STComponent } from '@delon/abc/st';
import {Base} from "../../../api/common/base";

interface UploadFile {
  url: string;
  thumbUrl: string;
}

@Component({
  selector: 'app-emergency-dispatch-emergency-watch-over-management',
  templateUrl: './emergency-watch-over-management.html',
  styleUrls: [],
})

export class EmergencyDispatchEmergencyWatchOverManagement extends Base implements OnInit {
  private thirdId: any;
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {
    super();
  }
  url = `/service/emergency-hsLine/admin/OnDutyApi/findOnDutyByPage`;
  listData = []; // 列表数据
  watchVisible = false; // 值守详情抽屉
  sponsorVisible = false; // 发起值守抽屉
  startAndEndTime:any; // 开始时间和结束时间
  //打开发起值守抽屉
  isAdd: boolean | undefined;
  // 查询数据
   customRequests: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize',
    },
    params: {
      endTime: '',
      rule: null,
      startTime: '',
      stationId: '',
      type: '',
    },
  };
  selectLineData:any = []; //线路数据
  selectSiteData:any = []; //站点数据
  sfLineIds = [];
  // 值守类型
  watchType = [
    { label: '应急值守', value: 'emergency' },
    { label: '工班值守', value: 'work' },
    { label: '日常值守', value: 'daily' },
    { label: '线路值守', value: 'lines' },
  ];
  // 值守规则
  watchRule = [
    { label: '每半小时签到', value: 0.5 },
    { label: '每1小时签到', value: 1 },
    { label: '每2小时签到', value: 2 },
  ];
  // 地点
  watchPlace:any = [];
  // 线路数据
  lineData :any= [];
  // 明细列表

  detailList:any = [
    {
      people: [],
      stationId: '',
      stationName: '',
      allLine: false,
    },
  ];
  // 发起值守数据
  onDutyVO = {
    content: '',
    endDate: '',
    id: '',
    info: this.detailList,
    lineId: '',
    lineName: '',
    rule: 0,
    startDate: '',
    type: '',
  };

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      startAndEndTime: {
        type: 'string',
        title: '起止时间',
        format: 'date-time',
        ui: {
          // widget: 'date',
          mode: 'range',
          change: (ngModel:any) => {
            // @ts-ignore
            if (ngModel.length != 0) {
              let beginTime = dateTimePickerUtil.format(ngModel[0], 'yyyy-MM-dd HH:mm:ss');
              let endTime = dateTimePickerUtil.format(ngModel[1], 'yyyy-MM-dd HH:mm:ss');
              this.customRequest.params.startTime = beginTime;
              this.customRequest.params.endTime = endTime;
            } else {
              this.customRequest.params.startTime = '';
              this.customRequest.params.endTime = '';
            }
          },
        } as SFDateWidgetSchema,
      },
      // watchType: {
      //   type: 'string',
      //   title: '值守类型',
      //   enum: this.watchType,
      //   ui: {
      //     widget: 'select',
      //     multiple: true,
      //     placeholder: '请选择',
      //     width: 270,
      //     allowClear: true,
      //     dropdownStyle: { 'max-height': '500px' },
      //     change: (ngModel) => {
      //       this.customRequest.params.type = ngModel;
      //     },
      //   } as SFTreeSelectWidgetSchema,
      // },
      watchPlace: {
        type: 'string',
        title: '值守地点',
        ui: {
          widget: 'tree-select',
          placeholder: '请选择',
          width: 300,
          multiple: true,
          allowClear: true,
          hideUnMatched: true,
          nzShowSearch: true,
          dropdownStyle: { 'max-height': '500px' },
          change: (ngModel:any) => {
            console.log(ngModel);
            this.customRequest.params.stationId = ngModel.toString();
          },
        } as SFTreeSelectWidgetSchema,
      },
      watchRule: {
        type: 'string',
        title: '值守规则',
        enum: this.watchRule,
        ui: {
          widget: 'select',
          placeholder: '请选择',
          width: 300,
          multiple: true,
          allowClear: true,
          dropdownStyle: { 'max-height': '500px' },
          change: (ngModel:any) => {
            this.customRequest.params.rule = ngModel;
          },
        } as SFTreeSelectWidgetSchema,
      },
    },
  };

  @ViewChild('st', { static: false }) st!: STComponent;
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  columns: STColumn[] = [
    {
      title: '开始时间',
      index: 'startDate',
      format: function (content) {
        if (content.startDate != null) {
          return content.startDate.substr(0, 16);
        }
      },
    },
    {
      title: '结束时间',
      index: 'endDate',
      format: function (content) {
        if (content.endDate != null) {
          return content.endDate.substr(0, 16);
        }
      },
    },
    // {
    //   title: '值守类型',
    //   width: 220,
    //   index: 'type',
    //   format: function (content) {
    //     if (content.type == 'emergency') {
    //       return '应急值守';
    //     } else if (content.type == 'work') {
    //       return '工班值守';
    //     } else if (content.type == 'daily') {
    //       return '日常值守';
    //     } else if (content.type == 'lines') {
    //       return '线路值守';
    //     }
    //   },
    // },
    { title: '值守内容', width: 220, index: 'content' },
    { title: '值守地点', width: 120, index: 'stationNames' },
    {
      title: '值守人员',
      width: 116,
      index: 'allSelect',
      buttons: [
        {
          text: '待设置',
          iif: (item) => item.allSelect == false,
          type: 'link',
          click: (record) => {
            this.openSponsorDrawer(2, record);
          },
        },
        {
          text: '已选择',
          type: 'none',
          iif: (item) => item.allSelect == true,
        },
      ],
    },
    {
      title: '值守规则',
      index: 'rule',
      // @ts-ignore
      format: function (content) {
        if (content.rule == '0.5') {
          return '每半小时签到';
        } else if (content.rule == '1') {
          return '每1小时签到';
        } else if (content.rule == '2') {
          return '每2小时签到';
        }
      },
    },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '详情',
          type: 'link',
          click: (record) => {
            this.openWatchDrawer(record);
          },
        },
        {
          text: '发起',
          type: 'link',
          pop: {
            title: '确认发起吗',
          },
          iif: (item) => item.allSelect == true,
          click: (record) => {
            console.log(record);
            this.http.post(`/service/emergency-hsLine/admin/OnDutyApi/onDutyPush/` + record.id + '/' + this.thirdId).subscribe((res) => {
              if (res.success) {
                this.st.reset();
                this.messageService.success('提示：发起成功');
              }
            });
          },
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.loadLineData();
    // this.findOnDutyByPage();//获取列表数据
    this.getByMetroLine(); //获取线路信息
    this.getLocalStorage();
    // this.getMetroStationByLineId();//获取站点信息
  }

  /* 加载所有线路数据 */
  loadLineData() {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/findAllLine`).subscribe((res) => {
      if (res.success) {
        this.selectLineData = res.data.map((element: { name: any; id: any; }) => {
          return { title: element.name, key: element.id };
        });
        // @ts-ignore
        this.searchSchema.properties.watchPlace.enum = this.selectLineData;
        for (let i = 0; i < this.selectLineData.length; i++) {
          this.loadSiteData(this.selectLineData[i].key, i);
        }
        this.sf.refreshSchema();
      }
    });
  }
  /* 根据线路ID获取相应的站点信息 */
  loadSiteData(lineId: any, index: number) {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/getAllStationsByLineIds/${lineId}`).subscribe((res) => {
      if (res.success) {
        this.selectSiteData = res.data.map((element:any) => {
          return { title: element.name, key: element.id, isLeaf: true };
        });
        this.selectLineData[index].children = this.selectSiteData;
        this.sf.refreshSchema();
      }
    });
  }

  /* 获取列表数据 */
  // findOnDutyByPage() {
  //   this.http.post(`/service/emergency-hsLine/admin/OnDutyApi/findOnDutyByPage`, this.onDutyQuery).subscribe((res) => {
  //     if (res.success) {
  //       this.listData = res.data.content;
  //     }
  //   });
  // }

  lineId = null;
  // 获取线路信息
  getByMetroLine() {
    this.http.get(`/service/emergency-base-config/metroLineApi/getByMetroLine`).subscribe((res) => {
      if (res.success) {
        this.lineData = res.data.map((element:any) => {
          return { label: element.name, value: element.id };
        });
        this.lineId = res.data[0].id;
        this.getMetroStationByLineId();
      }
    });
  }
  // 获取对应线路站点
  getMetroStationByLineId() {
    this.http.get(`/service/emergency-base-config/metroLineApi/getMetroStationByLineId/` + this.lineId).subscribe((res) => {
      if (res.success) {
        this.watchPlace = res.data.map((element:any) => {
          return { label: element.name, value: element.id };
        });
        this.watchPlace.push({ label: '全线', value: '' });
      }
    });
  }

  /* 表单重置 */
  resetSearch(e:any) {
    this.sf.reset(true);
    this.customRequest.params = {
      endTime: '',
      rule: null,
      startTime: '',
      stationId: '',
      type: '',
    };
    this.st.load(1, this.customRequest.params);
  }

  /* 表单搜索 */
  fromSearch() {
    /* 判断搜索条件是否为空 */
    this.st.load(1, this.customRequest.params);
  }

  /* 添加人员 */
  addUser(j:any) {
    this.modal
      .createStatic(EmergencyDispatchEmergencyWatchOverManagementEditComponent, { i: {}, mode: 'add', isSingleSelect: false })
      .subscribe((value) => {
        this.detailList[j].people = value.map((element:any) => {
          return {
            icon: element.icon,
            name: element.name,
            thirdPartyId: element.thirdPartyAccountUserId,
          };
        });
      });
  }
  /* 删除人员 */
  userDelete(i:any, j:any) {
    this.detailList[j].people.splice(i, 1);
  }

  //时间选择
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  onOk(result:any): void {
    console.log('onOk', result);
    this.onDutyVO.startDate = dateTimePickerUtil.format(result[0], 'yyyy-MM-dd HH:mm:ss');
    this.onDutyVO.endDate = dateTimePickerUtil.format(result[1], 'yyyy-MM-dd HH:mm:ss');
  }

  //打开详情
  wachDetailsList :any[] = [];
  wachDetails:any = {
    content: '',
    endDate: '',
    id: '',
    info: this.wachDetailsList,
    lineId: '',
    lineName: '',
    rule: '',
    startDate: '',
    type: '',
  };
  openWatchDrawer(data:any): void {
    this.findOnDutyInfo(data.id);
    this.wachDetails.lineName = data.lineName;
    this.wachDetails.startDate = data.startDate;
    this.wachDetails.endDate = data.endDate;
    this.wachDetails.content = data.content;
    if (data.type == 'emergency') {
      this.wachDetails.type = '应急值守';
    } else if (data.type == 'work') {
      this.wachDetails.type = '工班值守';
    } else if (data.type == 'daily') {
      this.wachDetails.type = '日常值守';
    } else if (data.type == 'lines') {
      this.wachDetails.type = '线路值守';
    }
    if (data.rule == 0.5) {
      this.wachDetails.rule = '每半小时签到';
    } else if (data.rule == 1) {
      this.wachDetails.rule = '每1小时签到';
    } else if (data.rule == 2) {
      this.wachDetails.rule = '每2小时签到';
    }

    this.watchVisible = true;
  }

  //关闭值守详情抽屉
  closeWatchDrawer(): void {
    this.watchVisible = false;
  }


  openSponsorDrawer(num:any, data:any): void {
    console.log(data);
    if (num == 0) {
      //新增发起
      this.isAdd = true;
    } else if (num == 1) {
      //详情
      this.findOnDutyByPageDetails(data.id);
    } else if (num == 2) {
      //设置修改
      this.isAdd = false;
      this.onDutyVO.id = data.id;
      this.onDutyVO.lineId = data.lineId;
      this.onDutyVO.lineName = data.lineName;
      this.onDutyVO.type = data.type;
      this.onDutyVO.content = data.content;
      this.onDutyVO.rule = data.rule;
      this.onDutyVO.startDate = data.startDate;
      this.onDutyVO.endDate = data.endDate;
      this.startAndEndTime = [data.startDate, data.endDate];
    }
    this.sponsorVisible = true;
  }

  //关闭发起值守抽屉
  closeSponsorDrawer(): void {
    this.sponsorVisible = false;
    this.resetData();
  }

  // 保存值守
  sponsorWatchOver() {
    if (this.isAdd == true) {
      this.http.post(`/service/emergency-hsLine/admin/OnDutyApi/add`, this.onDutyVO).subscribe((res) => {
        if (res.success) {
          this.messageService.success('保存成功');
          this.sponsorVisible = false;
          // this.findOnDutyByPage();//获取列表数据
          this.sf.reset(true);
          this.st.load(1, this.customRequest.params);
          this.resetData();
        } else {
          this.messageService.error('提交失败，请检查数据');
        }
      });
    } else {
      this.http.post(`/service/emergency-hsLine/admin/OnDutyApi/update`, this.onDutyVO).subscribe((res) => {
        if (res.success) {
          this.messageService.success('更新成功');
          this.sponsorVisible = false;
          // this.findOnDutyByPage();//获取列表数据
          this.sf.reset(true);
          this.st.load(1, this.customRequest.params);
          this.resetData();
        } else {
          this.messageService.error('提交失败，请检查数据');
        }
      });
    }
  }

  // 更新设置
  updateWatchOver() {}

  // 获取详情
  findOnDutyByPageDetails(onDutyId:any) {
    this.http.get(`/service/emergency-hsLine/admin/OnDutyApi/onDuty/findById/` + onDutyId).subscribe((res) => {
      if (res.success) {
      }
    });
  }

  // 获取明细
  findOnDutyInfo(onDutyId:any) {
    this.http.get(`/service/emergency-hsLine/admin/OnDutyApi/onDutyInfo/` + onDutyId).subscribe((res) => {
      if (res.success) {
        this.wachDetailsList = res.data;
        console.log(this.wachDetailsList);
        for (let i = 0; i < this.wachDetailsList.length; i++) {
          this.findOnDutyInfoPeople(this.wachDetailsList[i]['id'], i);
        }
      }
    });
  }

  // 获取明细人员
  findOnDutyInfoPeople(onDutyId:any, i:any) {
    this.http.get(`/service/emergency-hsLine/admin/OnDutyApi/onDutyInfoPeople/` + onDutyId).subscribe((res) => {
      if (res.success) {
        this.wachDetailsList[i].people = res.data;
      }
    });
  }

  //新增明细
  addDeploy() {
    this.detailList.push({
      people: [],
      stationId: '',
      stationName: '',
      allLine: false,
    });
  }
  //删除明细
  removeDeploy(item:any) {
    let i = this.detailList.indexOf(item);
    this.detailList.splice(i, 1);
  }
  // 线路选择回调
  geiLineId($event:any) {
    this.lineId = $event;
    this.getMetroStationByLineId();
    this.onDutyVO.lineId = $event;
    for (var i = 0; i < this.lineData.length; i++) {
      if ($event == this.lineData[i].value) {
        this.onDutyVO.lineName = this.lineData[i].label;
      }
    }
  }
  // 值守类型选择回调
  watchTypeChange($event: any) {
    this.onDutyVO.type = $event.value;
  }

  // 值守规则选择回调
  watchRuleChange($event: any) {
    this.onDutyVO.rule = $event.value;
  }

  // 值守地点选择回调
  watchPlaceChange($event: any, j:any) {
    this.detailList[j].stationId = $event.value;
    this.detailList[j].stationName = $event.label;
    if ($event.label == '全线') {
      this.detailList[j].allLine = true;
    }
  }

  getLocalStorage() {
    let value = JSON.parse(<string>window.localStorage.getItem('employee'));
    this.thirdId = value.thirdPartyAccountUserId;
  }

  // 重置
  resetData() {
    this.detailList = [
      {
        people: [],
        stationId: '',
        stationName: '',
        allLine: false,
      },
    ];
    this.startAndEndTime = null;
    this.onDutyVO = {
      content: '',
      endDate: '',
      id: '',
      info: this.detailList,
      lineId: '',
      lineName: '',
      rule: 0,
      startDate: '',
      type: '',
    };
    this.watchPlace = [];
    // 值守类型数据
    this.watchType = [
      { label: '应急值守', value: 'emergency' },
      { label: '工班值守', value: 'work' },
      { label: '日常值守', value: 'daily' },
      { label: '线路值守', value: 'lines' },
    ];
    // 值守规则
    this.watchRule = [
      { label: '每半小时签到', value: 0.5 },
      { label: '每1小时签到', value: 1 },
      { label: '每2小时签到', value: 2 },
    ];
    this.getByMetroLine();
  }
}
