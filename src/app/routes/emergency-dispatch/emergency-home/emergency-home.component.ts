import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import * as echarts from 'echarts';
import { NzMessageService } from 'ng-zorro-antd/message';
import { dateTimePickerUtil } from '@delon/util';
import { environment } from '@env/environment';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { STColumn, STComponent, STColumnButton, STChange, STData } from '@delon/abc/st';
import { element } from 'protractor';
import {Base} from "../../../common/base";
import {SelectProjectPersonComponent} from "../../../shared/select-person/select-project-person/select-project-person.component";
// import {SetupContactSelectComponent} from "../../../shared/components/contact-select/contact-select.component";

@Component({
  selector: 'app-emergency-dispatch-emergency-home',
  templateUrl: './emergency-home.component.html',
  styleUrls: ['./emergency-home.css'],
})
export class EmergencyDispatchEmergencyHome extends Base implements OnInit {
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public settingsService: SettingsService,
    private messageService: NzMessageService,
  ) {
    super();
  }
  url = `/service/emergency-base-config/admin/adminEmergencyPlanFileApi/findForPage
  `; //应急规章制度表格数据

  /* 应急规章制度表格请求 */
  fileCustomRequest: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize',
    },
    params: { isUsed: true },
  };
  tagUrl = `/service/emergency-base-config/admin/adminTagGroupApi/findAllPage`;
  telephoneUrl = `/service/emergency-base-config/admin/adminTelephoneApi/findForPage`;
  pageChoose = 0;
  isShow: boolean = true;
  visible: boolean = false; //抽屉页面
  value: String | any;
  siteValue: String| undefined;
  sectionValue: String| undefined;
  areaValue: String| undefined;
  count: Number| undefined;
  isVisible: boolean = false; //弹窗页面
  childrenVisible: boolean = false;
  isHidden: boolean = true;
  selectedValue: any;
  chartMajorValue: any; //折线图专业下拉框选择数据
  chartLevelValue: any; //折线图等级下拉框选择数据
  submitEventVO: any = {}; //发起应急事件数据
  selectLineData:any = []; //线路数据
  selectSiteData :any= []; //站点数据
  selectLineSectionData:any = []; //线路-区间数据
  selectSectionData:any = []; //区间数据
  allAreaData :any= []; //所有区域数据
  eventCategoryData: any = []; //事件大类数据
  eventLevelData:any = []; //事件等级
  eventData :any= []; //事件类型数据
  phonePeople = []; //电话人员数据
  commandPeople :any= []; //指挥人员数据
  majorData :any= []; //相关专业数据
  tagAndPeopleQuery: any = {
    areaIds: [],
    dictionaryIds: [], //大类数据
    employeeId: '',
    eventLevelIds: [],
    eventTypeIds: [],
    lineIds: [],
    specialtyIds: [],
    stationIds: [],
    sectionIds: [],
  }; //查询标签人员数据
  eventPlan: any = []; //应急预案文件
  emergencyPointList: any = []; //应急要点列表数据
  pointStatus: any = []; //应急要点选择状态
  pointName: any = []; //选中的应急要点数据
  emergencyPlanFile:any = []; //选中的应急规章制度数据
  allChecked: any = {}; //选择的所有应急规章制度数据
  emergencyPointQuery: any = {
    //应急要点查询数据
    status: 1,
  };
  searchCategoryList:any = []; //查询预案类别列表
  searchTypeList:any = []; //查询预案类型列表
  planFileType: any; //应急规章制度类型
  planFileCategory: any; //应急规章制度类型
  emergencyPlanFileQuery: any = {}; //查询应急预案
  locationUpdateTime :any= [];
  tagGroupQuery: any = {}; //应急标签组查询
  telePhoneQuery: any = {}; // 通知固话查询
  /* 首页图表数据 */
  myChart: any;
  myChart2: any;
  myChartLine: any;
  myChartLine2: any;

  uploadFileList: NzUploadFile[] = [];
  fileList: NzUploadFile[] = []; //上传文件列表
  eventAttachmentFiles: any = []; //上传的文件数据
  uploading = false;
  tagGroupVO :any= []; //选中的应急标签组数据
  telephoneList :any= []; //选中的应急标签组数据
  showTagVOS:any = []; //是否显示预设应急人员列表
  showTagGroupVOS:any = []; //是否显示应急标签组人员列表
  showMajorData = false; //是否显示相关专业数据
  showEventData = false; //是否显示事件类型数据
  originData: any = {
    lineIds: [],
    areaIds: [],
    stationIds: [],
    sectionIds: [],
    areaName: '',
    siteName: '',
  }; //选择的线路站点区域数据
  thirdId: any; //操作人ID
  isShowTips = false; // 分辨率大小提示
  isChangeCategory = false; //更换图表事件类别
  categoryIcon: String = 'assets/img/icon-electricity.png'; //图标类型统计icon
  categoryIcon2: String = 'assets/img/icon-repair.png'; //图标类型统计icon
  pieData:any = []; //饼状图数据
  eventCount:any = []; //饼状图事件数量
  allEventData :any= [];
  allLevelData:any = [];
  monthNumber:any = 1;
  chooseTime :any= []; //首页图表选择的时间
  /* 饼状图数据 */
  optionPie: any = {
    tooltip: {
      show: true,
      formatter: '{b0}：{c0}',
    },
    grid: {
      bottom: '10%',
      left: '8%',
      right: '5%',
    },
    series: [
      {
        name: '事件类别统计',
        type: 'pie',
        radius: '85%',
        hoverAnimation: false,
        animation: true,
      },
    ],
  };
  date: any; //选择的时间
  /* 环形图数据*/
  optionRound: any = {
    tooltip: {
      show: true,
      formatter: '{b0}：{c0}',
    },
    grid: {
      bottom: '10%',
      left: '8%',
      right: '5%',
    },
    series: [
      {
        name: '事件基本统计',
        type: 'pie',
        radius: ['55%', '85%'],
        avoidLabelOverlap: true,
        hoverAnimation: false,
        animation: true,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c}',
        },
        labelLine: {
          show: true,
        },
      },
    ],
  };

  /* 折线图1数据 */
  chartLine: any = {
    tooltip: {
      show: true,
    },
    grid: {
      bottom: '18%',
      left: '8%',
      right: '5%',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        align: 'center',
        formatter: function (value:any) {
          if (value.length > 12) {
            return `${value.slice(0, 10)}...`;
          }
          return value;
        },
      },
    },
    dataZoom: [
      {
        show: true,
        height: 10,
        bottom: 20,
        showDetail: false,
        showDetailShadow: false,
        borderColor: 'transparent',
        endValue: 6,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 0,
      },
    ],
    yAxis: {
      type: 'value',
      name: '单位：min',
    },
    series: [
      {
        type: 'line',
        animation: true,
        label: {
          show: true,
          distance: 10,
        },
        lineStyle: {
          color: '#1890FF ',
        },
        areaStyle: {
          color: '#e7eefe',
        },
      },
    ],
  };

  /* 折线图2数据 */
  chartLine2: any = {
    tooltip: {
      // trigger: 'axis',
      show: true,
    },
    grid: {
      bottom: '18%',
      left: '8%',
      right: '5%',
    },
    dataZoom: [
      {
        show: true,
        height: 10,
        bottom: 20,
        showDetail: false,
        showDetailShadow: false,
        borderColor: 'transparent',
        endValue: 6,
        backgroundColor: 'rgba(0,0,0,0)',
        borderWidth: 0,
      },
    ],
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        align: 'center',
        formatter: function (value:any) {
          if (value.length > 12) {
            return `${value.slice(0, 10)}...`;
          }
          return value;
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '单位：min',
    },
    series: [
      {
        type: 'line',
        animation: true,
        label: {
          show: true,
          distance: 10,
        },
        lineStyle: {
          color: '#E02020',
        },
        areaStyle: {
          color: '#fbdede',
        },
      },
    ],
  };

  pieColor = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#eb7e65',
    '#83d0ef',
    '#a285d2',
    '#ffab67',
    '#46a9a8',
    '#ffa8cc',
    '#73a0fa',
    '#c7d9fd',
    '#73deb3',
    '#c7f1e0',
    '#7585a2',
  ];
  roundColor = ['#73a0fa', '#73deb3', '#7585a2', '#73deb3', '#eb7e65', '#83d0ef', '#a285d2', '#ffab67', '#46a9a8', '#ffa8cc'];
  pieLegends:any = [];
  roundLegends:any  = [];
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    {
      title: '操作',
      type: 'checkbox',
    },
    {
      title: '应急规章制度名称',
      index: 'name',
    },
    { title: '上传人员', index: 'uploaderName' },
    { title: '上传时间', index: 'createdDate' },
  ];

  @ViewChild('st2', { static: false }) st2!: STComponent;
  tagColumns: STColumn[] = [
    {
      title: '操作',
      type: 'checkbox',
    },
    {
      title: '应急通知标签组名称',
      index: 'name',
    },
    {
      title: '人员',
      index: 'content',
      format: (content) => {
        let names = [];
        names = content.people.map((element:any) => element.name);
        return '【' + names.join('、') + '】';
      },
    },
  ];

  @ViewChild('st3', { static: false }) st3!: STComponent;
  telephoneColumns: STColumn[] = [
    {
      title: '操作',
      type: 'checkbox',
    },
    {
      title: '固话名称',
      index: 'name',
    },
    {
      title: '固话号码',
      index: 'telephoneNum',
    },
  ];

  /* 加载所有线路数据 */
  loadLineData() {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/findAllLine`).subscribe((res) => {
      if (res.success) {
        this.selectLineData = res.data.map((element:any) => {
          return { title: element.name, key: element.id };
        });
        this.selectLineSectionData = res.data.map((element:any) => {
          return { title: element.name, key: element.id };
        });
        for (let i = 0; i < this.selectLineData.length; i++) {
          this.loadSiteData(this.selectLineData[i].key, i);
          this.loadSectionDate(this.selectLineData[i].key, i);
        }
      }
    });
  }

  /* 根据线路ID获取相应的站点信息 */
  loadSiteData(lineId:any, index:any) {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/getAllStationsByLineIds/${lineId}`).subscribe((res) => {
      if (res.success) {
        this.selectSiteData = res.data.map((element:any) => {
          return { title: element.name, key: element.id, isLeaf: true };
        });
        this.selectLineData[index].children = this.selectSiteData;
      }
    });
  }
  /* 根据线路ID获取相应的区间信息 */
  loadSectionDate(lineId:any, index:any) {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/getAllSectionsByLineIds/${lineId}`).subscribe((res) => {
      if (res.success) {
        this.selectSectionData = [];
        for (const item of res.data) {
          const upObj = { title: item.name + '上行', key: item.id + '-up', isLeaf: true, type: 'up' };
          const downObj = { title: item.name + '下行', key: item.id + '-down', isLeaf: true, type: 'down' };
          this.selectSectionData.push(upObj, downObj);
        }
        this.selectLineSectionData[index].children = this.selectSectionData;
      }
    });
  }

  /* 加载应急区域数据 */
  loadAllArea() {
    this.http.get(`/service/emergency-base-config/admin/adminAreaApi/findAllArea`).subscribe((res) => {
      if (res.success) {
        this.allAreaData = res.data.map((element:any) => {
          return { title: element.name, key: element.id, isLeaf: true };
        });
      }
    });
  }

  /**
   * 加载事件大类
   */
  loadEventCategoryData(category: any) {
    let eventTypeId: any;
    let majorId: any;
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/` + category).subscribe((res) => {
      if (res.success) {
        this.eventCategoryData = res.data.map((element:any) => {
          return { label: element.label, value: element.id };
        });
        this.eventCategoryData.forEach((element:any) => {
          if (element.label == '综合类应急处置') {
            eventTypeId = element.value;
          } else if (element.label == '专业类故障处理') {
            majorId = element.value;
          }
        });
        this.loadEventlData(eventTypeId);
        this.loadMajorData(majorId);
      }
    });
  }

  /**
   * 加载所有事件等级
   */
  loadEventLevelData(category: any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/` + category).subscribe((res) => {
      if (res.success) {
        this.eventLevelData = res.data.map((element:any) => {
          return { label: element.label, value: element.id };
        });

        this.roundLegends = res.data.map((element:any, index:any) => {
          return { id: element.id, title: element.label, color: this.roundColor[index % this.roundColor.length] };
        });
        this.getLevelRoundByMonth(1);
      }
    });
  }

  /* 加载事件类型数据 */
  loadEventlData(value: any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByParentId/${value}`).subscribe((res) => {
      if (res.success) {
        this.eventData = res.data.map((element:any) => {
          return { label: element.label, value: element.id };
        });
      }
    });
  }

  /* 加载相关专业数据 */
  loadMajorData(value: any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByParentId/${value}`).subscribe((res) => {
      if (res.success) {
        this.majorData = res.data.map((element:any) => {
          return { label: element.label, value: element.id };
        });
      }
      this.setProfessionPieLegends();
      this.getEventCategoryByMonth(1);
    });
  }

  /* 事件大类变化回调 */
  categoryChange(eventCategoryData:any) {
    let value = eventCategoryData.filter((item:any) => item.checked).map((item:any) => item.value);
    this.submitEventVO.categoryId = value.toString();
    this.showMajorData = eventCategoryData.filter((element:any) => element.label == '专业类故障处理')[0].checked;
    this.showEventData = eventCategoryData.filter((element:any) => element.label == '综合类应急处置')[0].checked;

    if (!this.showEventData) {
      this.submitEventVO.emergencyCategoryId = '';
      this.tagAndPeopleQuery.eventTypeIds = [];
    } else {
      this.eventChange(this.eventData);
    }

    if (!this.showMajorData) {
      this.submitEventVO.emergencyProfessionId = '';
      this.tagAndPeopleQuery.specialtyIds = [];
    } else {
      this.majorChange(this.majorData);
    }
    this.tagAndPeopleQuery.dictionaryIds = value;
  }

  /* 事件等级变化回调 */
  levelChange(eventLevelData:any) {
    let value = eventLevelData.filter((item:any) => item.checked).map((item:any) => item.value);
    this.tagAndPeopleQuery.eventLevelIds = value;
    this.submitEventVO.eventLevelId = value.toString();
  }

  /* 事件类型变化回调 */
  eventChange(eventData:any) {
    let value = eventData.filter((item:any) => item.checked).map((item:any) => item.value);
    this.tagAndPeopleQuery.eventTypeIds = value;
    this.submitEventVO.emergencyCategoryId = value.toString();
  }

  /* 相关专业选择回调 */
  majorChange(event:any) {
    let value = event.filter((item:any) => item.checked).map((item:any) => item.value);
    this.tagAndPeopleQuery.specialtyIds = value;
    this.submitEventVO.emergencyProfessionId = value.toString();
  }

  /* 查询应急预案预设应急人员 */
  tagSearch() {
    let url: string;
    this.tagAndPeopleQuery.employeeId = this.thirdId;
    if (this.submitEventVO.areaEmergency) {
      /* 根据区域模糊查询 */
      url = `/service/emergency-base-config/wxcp/tagApi/findByTagIdInIsAreaLike`;
      this.tagAndPeopleQuery.areaIds = this.originData.areaIds;
      this.tagAndPeopleQuery.lineIds = [];
      this.tagAndPeopleQuery.stationIds = [];
    } else {
      /* 根据线路站点模糊查询 */
      url = `/service/emergency-base-config/wxcp/tagApi/findByTagIdInNotAreaLike`;
      this.tagAndPeopleQuery.areaIds = [];
      this.tagAndPeopleQuery.lineIds = this.originData.lineIds;
      this.tagAndPeopleQuery.stationIds = this.originData.stationIds;
      this.tagAndPeopleQuery.sectionIds = this.originData.sectionIds;
    }
    console.log(this.tagAndPeopleQuery);
    console.log(this.originData);
    this.http.post(url, this.tagAndPeopleQuery).subscribe((res) => {
      if (res.code == 200) {
        if (res.data) {
          if (res.data.length > 0) {
            let tagVOS = res.data.map((element:any) => {
              return {
                id: element.tagDTO.id,
                tagName: element.tagDTO.name,
                tagUsers: element.tagAndPeopleDTOS.map((item:any) => {
                  return {
                    avatar: item.wxAvatar,
                    corpId: item.orgId,
                    eventId: '',
                    name: item.employeeName,
                    thirdPartyAccountUserId: item.employeeId,
                  };
                }),
              };
            });
            this.submitEventVO.tagVOS = tagVOS;
            this.showTagVOS = res.data.map((element:any) => {
              return { isShow: false };
            });
            this.messageService.success('查询成功');
          } else {
            this.submitEventVO.tagVOS = [];
            this.messageService.warning('未找到标签，请检查管理后台配置');
          }
        } else {
          this.submitEventVO.tagVOS = [];
          this.messageService.warning('未找到标签，请检查管理后台配置');
        }
      } else {
        this.submitEventVO.tagVOS = [];
        // this.messageService.error('查询失败，服务器错误');
        this.messageService.error(res.message);
      }
    });
  }

  /* 是否显示预设应急人员列表 */
  showTag(i:any) {
    this.showTagVOS[i].isShow = !this.showTagVOS[i].isShow;
  }

  /* 是否显示应急标签组人员列表 */
  showTagGroup(i:any) {
    this.showTagGroupVOS[i].isShow = !this.showTagGroupVOS[i].isShow;
  }
  /* 添加电话通知人员 */
  selectedItems = [];
  addUser() {
    // mode:["employee"]
    // this.modal
    //   .createStatic(SetupContactSelectComponent, { selectedItems: this.selectedItems, mode: mode, isSingleSelect: false })
    //   .subscribe((res) => {
    this.modal
      .createStatic(SelectProjectPersonComponent, {
        chooseMode: 'employee', // department organization employee
        functionName: 'not-clock',
        selectList: this.selectedItems
      }).subscribe((res) => {
        this.selectedItems = res.selectList;
        this.submitEventVO.temCallThirdUsers = res.selectList.map((element:any) => {
          return {
            avatar: element.icon,
            corpId: element.corpId,
            eventId: '',
            name: element.name,
            thirdPartyAccountUserId: element.id,
          };
        });
        console.log(this.submitEventVO.temCallThirdUsers);
      });
  }
  /* 添加现场指挥 */
  addCommand() {
    if (this.commandPeople.length == 0) {
      const mode = ['employee'];
      // this.modal.createStatic(SetupContactSelectComponent, { selectedItems: [], mode: mode, isSingleSelect: true }).subscribe((res) => {
      this.modal.createStatic(SelectProjectPersonComponent, {
          chooseMode: 'employee', // department organization employee
          functionName: 'not-clock',
          selectList: []
        }).subscribe((res) => {
        this.commandPeople = res.selectList;
        let commandUser = res.selectList.map((element:any) => {
          return {
            avatar: element.icon,
            corpId: element.corpId,
            eventId: '',
            name: element.name,
            thirdPartyAccountUserId: element.id,
          };
        });
        this.submitEventVO.commandUser = commandUser[0];
      });
    }
  }

  radioChoose(e:any) {
    if (e == 'month') {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  /* 打开发起应急页面 */
  open() {
    this.visible = true;
    this.submitEventVO.areaEmergency = false;
    this.submitEventVO.fullPushStatus = false;
    this.submitEventVO.openTheTrajectory = false;
    this.submitEventVO.onlyPushMessage = false;
    this.count = this.submitEventVO.overviewAndRequirements ? this.submitEventVO.overviewAndRequirements.length : 0;
    this.getLocalStorage();
    this.getPushTime();
  }

  /* 获取位置更新时间 */
  getPushTime() {
    this.http.get(`/service/emergency-base-config/admin/adminPushTimeApi/pushTime`).subscribe((res) => {
      if (res.success) {
        this.locationUpdateTime = res.data.map((element:any) => {
          return {
            value: element.id,
            label: element.time,
          };
        });
      }
    });
  }

  /* 人员轨迹回调 */
  isOpenTheTrajectory(value:any) {
    if (!value) {
      this.submitEventVO.pushTime = null;
    }
  }

  close() {
    this.visible = false;
  }

  /* 线路站点/线路区间选择回调 */
  onLineChange() {
    const stationValue:any = this.siteValue;
    const sectionValue:any = this.sectionValue;
    const lineIds = new Set();
    const stationIds = new Set();
    const names = new Set();
    const sectionIds = new Set();
    console.log(this.selectLineData, 'selectLineData');
    console.log(this.selectLineSectionData, 'lineSectionData');
    if (this.siteValue) {
      for (const stationValueElement of stationValue) {
        this.selectLineData
          .filter((item:any) => item.key == stationValueElement)
          .map((item:any) => {
            names.add(item.title);
            lineIds.add(item.key);
          });
        this.selectLineData.forEach((value:any, index:any) => {
          value.children
            .filter((item:any) => {
              return item.key == stationValueElement;
            })
            .map((item:any) => {
              stationIds.add(item.key);
              names.add(item.title);
            });
        });
      }
    }
    if (this.sectionValue) {
      for (const sectionValueElement of sectionValue) {
        this.selectLineData
          .filter((item:any) => item.key == sectionValueElement)
          .map((item:any) => {
            names.add(item.title);
            lineIds.add(item.key);
          });
        this.selectLineSectionData.filter((item:any) => item.key == sectionValueElement).map((item:any) => lineIds.add(item.key));
        this.selectLineSectionData.forEach((value:any, index:any) => {
          value.children
            .filter((item:any) => {
              return item.key == sectionValueElement;
            })
            .map((item:any) => {
              console.log(item);
              sectionIds.add(item.key);
              names.add(item.title);
            });
        });
      }
    }
    console.log(lineIds);
    console.log(stationIds);
    console.log(sectionIds);
    this.originData.lineIds = [...lineIds];
    this.originData.stationIds = [...stationIds];
    this.originData.sectionIds = [...sectionIds];
    this.tagAndPeopleQuery.lineIds = [...lineIds];
    this.tagAndPeopleQuery.stationIds = [...stationIds];
    this.tagAndPeopleQuery.sectionIds = [...sectionIds];
    this.originData.siteName = [...names].toString();
    console.log(this.originData.siteName);
  }

  /* 区域选择回调 */
  onAreaChange(ngModel:any) {
    this.originData.areaIds = ngModel;
    let areaName = [];
    for (let i = 0; i < ngModel.length; i++) {
      let value = this.allAreaData.filter((item:any) => item.key == ngModel[i]).map((item:any) => item.title);
      areaName.push(value.toString());
    }
    this.originData.areaName = areaName.toString();
  }

  getLocalStorage() {
    let value = JSON.parse(<string>window.localStorage.getItem('_token'));
    this.submitEventVO.submitAvatar = value.avatar;
    this.submitEventVO.submitCorpId = value.cropId;
    this.submitEventVO.submitMobilePhone = value.mobilePhone;
    this.submitEventVO.submitThirdId = value.loginUserId;
    this.thirdId = value.loginUserId;
    this.submitEventVO.submitName = value.loginUserName;
  }

  /* 选择发生时间回调 */
  getTime(value:any) {
    if (value) {
      let time = dateTimePickerUtil.format(value, 'yyyy-MM-dd HH:mm:ss');
      this.submitEventVO.eventTime = time;
    } else {
      this.submitEventVO.eventTime = '';
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    this.uploadFileList = this.uploadFileList.concat(file);
    this.handleUpload();
    return false;
  };

  handleUpload() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    let fileData: any = {};
    this.uploading = true;
    this.http.post(`/api/upload`, formData).subscribe((res) => {
      if (res.success) {
        fileData.fileName = res.data.fileName + '.' + res.data.suffix;
        fileData.url = res.data.url;
        this.eventAttachmentFiles.push(fileData);
        this.submitEventVO.eventAttachmentFiles = this.eventAttachmentFiles;
      }
    });
  }

  fileRemove = (file: NzUploadFile) => {
    this.uploadFileList.forEach((item, index) => {
      if (item.status == 'removed') {
        this.submitEventVO.eventAttachmentFiles.splice(index, 1);
      }
    });
    return true;
  };

  /* 获取应急要点列表 */
  getEmergencyPointDetailList(data:any) {
    this.http.post(`/service/emergency-base-config/admin/emergencyPointApi/getAllEmergencyPointAndDetail`, data).subscribe((res) => {
      if (res.success) {
        this.emergencyPointList = res.data.content;
        this.refreshPointList();
      }
    });
  }
  searchPoint() {
    if (this.emergencyPointQuery.name != undefined && this.emergencyPointQuery.name != null) {
      this.getEmergencyPointDetailList(this.emergencyPointQuery);
    }
  }

  onValueChange() {
    this.count = this.value.length;
  }
  showModal() {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
  }
  handleOk() {
    this.isVisible = false;
  }

  cancel() {
    this.visible = false;
  }
  closeChildren() {
    this.childrenVisible = false;
  }
  /* 打开应急处置要点设置页面 */
  openPointList() {
    this.pageChoose = 0;
    this.refreshPointList();
    this.childrenVisible = true;
  }

  /* 刷新应急处置要点列表 */
  refreshPointList() {
    this.emergencyPointList.forEach((element:any) => {
      element.status = false;
    });
    let ids = this.pointName.map((element:any) => element.id);
    ids.forEach((element:any) => {
      this.emergencyPointList.forEach((item:any) => {
        if (element == item.id) {
          item.status = true;
        }
      });
    });
  }

  childrenCancel() {
    this.childrenVisible = false;
  }
  childrenConfirm() {
    if (this.pageChoose == 0) {
      this.pointName = this.emergencyPointList
        .filter((item:any) => item.status)
        .map((item:any) => {
          return { name: item.name, id: item.id };
        });
      let emergencyPointIds = this.pointName.map((item:any) => item.id);
      this.submitEventVO.emergencyPointIds = emergencyPointIds;
      this.childrenVisible = false;
    } else if (this.pageChoose == 2) {
      this.submitEventVO.eventPlanVOS = this.emergencyPlanFile;
      this.childrenVisible = false;
    } else if (this.pageChoose == 1) {
      this.submitEventVO.tagGroupVO = this.tagGroupVO;
      this.showTagGroupVOS = this.tagGroupVO.map(() => {
        return { isShow: false };
      });
      this.childrenVisible = false;
    }else if (this.pageChoose== 3) {
      // 电话通知
      this.submitEventVO.telephoneList = this.telephoneList;
      this.childrenVisible = false;
    }
  }

  /* 删除电话人员 */
  phoneDelete(i:any) {
    this.submitEventVO.temCallThirdUsers.splice(i, 1);
  }

  /* 删除指挥人员 */
  commandDelete() {
    this.commandPeople.splice(0, 1);
  }

  /* 删除应急预案预设应急人员标签组 */
  tagClose(i:any) {
    this.submitEventVO.tagVOS.splice(i, 1);
  }

  /* 删除应急预案预设应急人员标签组中人员 */
  tagUserDelete(i:any, a:any) {
    this.submitEventVO.tagVOS[i].tagUsers.splice(a, 1);
  }

  /* 应急处置要点标签删除 */
  pointTagClose(i:any) {
    let id = this.pointName[i].id;
    this.pointName.splice(i, 1);
    this.submitEventVO.emergencyPointIds.splice(i, 1);
    this.emergencyPointList.forEach((element:any) => {
      if (element.id == id) {
        element.status = false;
      }
    });
  }
  /* 打开选择应急通知固话 */
  chooseTelephone(){
    this.pageChoose = 3;
    this.childrenVisible = true;
    if (this.st3) {
      this.st3.load();
    }
  }

  /* 打开应急通知标签组 */
  chooseTag() {
    this.pageChoose = 1;
    this.childrenVisible = true;
    if (this.st2) {
      this.st2.load();
    }
  }

  /* 选中的应急标签组回调 */
  tagStChange(ret:any) {
    if (ret.checkbox != undefined) {
      this.tagGroupVO = ret.checkbox.map((element:any) => {
        return {
          id: element.id,
          tagName: element.name,
          tagUsers: element.people.map((item:any) => {
            return {
              avatar: item.avatar,
              corpId: item.id,
              name: item.name,
              thirdPartyAccountUserId: item.thirdPartyAccountId,
            };
          }),
        };
      });
    }

    if (ret.loaded != undefined) {
      let ids = [];
      if (this.submitEventVO.tagGroupVO != undefined) {
        ids = this.submitEventVO.tagGroupVO.map((element:any) => element.id);
      }
      ids.forEach((element:any) => {
        ret.loaded.forEach((item:any) => {
          if (element == item.id) {
            item.checked = true;
          }
        });
      });
    }
  }

  /* 选中的通知固话回调 */
  telephoneStChange(ret:any) {
    if (ret.checkbox != undefined) {
      this.telephoneList = ret.checkbox.map((element:any) => {
        return {
          telephoneId: element.id,
          telephoneName: element.name,
          telephoneNum: element.telephoneNum,
        };
      });
    }

    if (ret.loaded != undefined) {
      let ids = [];
      if (this.submitEventVO.telephoneList != undefined) {
        ids = this.submitEventVO.telephoneList.map((element:any) => element.telephoneId);
      }
      ids.forEach((element:any) => {
        ret.loaded.forEach((item:any) => {
          if (element == item.id) {
            item.checked = true;
          }
        });
      });
    }
  }

  /* 删除应急标签组 */
  tagGroupClose(i:any) {
    this.submitEventVO.tagGroupVO.splice(i, 1);
  }

  /* 删除固话通知 */
  telephoneDelete(i:any) {
    this.submitEventVO.telephoneList.splice(i, 1);
  }

  /* 删除应急标签组人员 */
  tagUserClose(i:any, a:any) {
    this.submitEventVO.tagGroupVO[i].tagUsers.splice(a, 1);
  }

  /* 搜索应急标签组 */
  searchTagGroup() {
    if (this.tagGroupQuery.name != undefined) {
      this.st2.load(1, this.tagGroupQuery);
    }
  }

  /* 搜索应急标签组 */
  searchTelephoneGroup() {
    if (this.telePhoneQuery.name != undefined) {
      this.st3.load(1, this.telePhoneQuery);
    }
  }

  /* 打开 应急规章制度关联选择*/
  openEmergencyPlanFile() {
    this.pageChoose = 2;
    this.childrenVisible = true;
    this.emergencyPlanFileQuery.isUsed = true;
    if (this.st) {
      this.st.load();
    }
    if (this.submitEventVO.eventPlanVOS) {
      this.emergencyPlanFile = this.submitEventVO.eventPlanVOS;
    } else {
      this.emergencyPlanFile = [];
    }

    this.getEmergencyPlanFileType();
  }

  /* 选中的应急规章制度关联回调 */
  stChange(ret:any) {
    if (ret.checkbox != undefined) {
      this.emergencyPlanFile = [];
      this.allChecked[ret.pi] = ret.checkbox.map((element:any) => {
        return {
          fileUrl: element.url,
          title: element.name,
          value: element.id,
        };
      });
      for (let key in this.allChecked) {
        this.emergencyPlanFile.push(...this.allChecked[key]);
      }
    }
    let ids = [];
    ids = this.emergencyPlanFile.map((element:any) => element.value);
    ids.forEach((element:any) => {
      this.st.list.forEach((item:any) => {
        if (element == item.id) {
          item.checked = true;
        }
      });
    });
  }

  /* 删除应急规章制度 */
  emergencyPlanFileDelete(i:any) {
    let value = this.submitEventVO.eventPlanVOS[i].value;
    for (let key in this.allChecked) {
      this.allChecked[key].forEach((element:any, index:any) => {
        if (element.value == value) {
          this.allChecked[key].splice(index, 1);
        }
      });
    }
    this.submitEventVO.eventPlanVOS.splice(i, 1);
  }

  /* 加载应急规章制度类型 */
  getEmergencyPlanFileType() {
    this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/findAllByLevel/${1}`).subscribe((res) => {
      if (res.success) {
        this.searchTypeList = res.data.map((element:any) => {
          return { label: element.name, value: element.id };
        });
      }
    });
  }

  /* 加载应急规章类别数据 */
  getEmergencyPlanFileCategory(id:any) {
    this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/findAllByParentId/${id}`).subscribe((res) => {
      if (res.success) {
        this.searchCategoryList = res.data.map((element:any) => {
          return { label: element.name, value: element.id };
        });
      }
    });
  }

  /* 应急规章制度类型选择回调 */
  emergencyPlanFileTypeChange(event:any) {
    if (event != null) {
      let id = event.value;
      this.planFileCategory = null;
      this.emergencyPlanFileQuery.categoryId = '';
      this.emergencyPlanFileQuery.typeId = id;
      this.getEmergencyPlanFileCategory(id);
    } else {
      this.planFileCategory = null;
      this.emergencyPlanFileQuery.typeId = '';
      this.emergencyPlanFileQuery.categoryId = '';
    }
  }

  /* 应急规章制度类别选择回调 */
  emergencyPlanFileCategoryChange(event:any) {
    if (event != null) {
      let id = event.value;
      this.emergencyPlanFileQuery.categoryId = id;
    } else {
      this.emergencyPlanFileQuery.categoryId = '';
    }
  }

  /* 查询应急规章制度 */
  searchEmergencyPlan() {
    /* 判断搜索条件是否为空 */
    if (Object.keys(this.emergencyPlanFileQuery).length != 0) {
      this.st.load(1, this.emergencyPlanFileQuery);
    }
  }

  /* 清除数据 */
  clearData() {
    this.eventData = [];
    this.majorData = [];
    this.pointName = [];
    this.commandPeople = [];
    this.uploadFileList = [];
    this.submitEventVO = {};
    this.date = '';
    this.siteValue = '';
    this.sectionValue = '';
    this.areaValue = '';
    this.emergencyPointList.forEach((element:any) => {
      element.status = false;
    });
    this.loadEventCategoryData('emergencyBigCategory');
    this.loadEventLevelData('emergencyLevel');
  }

  textareaChange() {
    this.count = this.submitEventVO.overviewAndRequirements.length;
  }

  /* 检验字符串是否为空 */
  resultChange(data:any) {
    if (data != undefined && data.replace(/[ ]/g, '').length != 0) {
      return true;
    } else {
      return false;
    }
  }

  /* 取消发起应急 */
  cancelSubmitEmergency() {
    this.isVisible = false;
  }
  isLoading = false;
  /* 打开确认发起应急弹窗 */
  initiate() {
    console.log(this.submitEventVO);
    let status = this.resultChange(this.submitEventVO.customizeEventName);
    if (this.submitEventVO.areaEmergency) {
      this.submitEventVO.lineIds = [];
      this.submitEventVO.stationIds = [];
      this.submitEventVO.sectionIds = [];
      this.submitEventVO.siteName = '';
      this.submitEventVO.areaIds = this.originData.areaIds;
      this.submitEventVO.areaName = this.originData.areaName;
    } else {
      this.submitEventVO.areaIds = [];
      this.submitEventVO.areaName = '';
      this.submitEventVO.lineIds = this.originData.lineIds;
      this.submitEventVO.stationIds = this.originData.stationIds;
      this.submitEventVO.siteName = this.originData.siteName;
      this.submitEventVO.sectionIds = this.originData.sectionIds;
    }
    if (!this.submitEventVO.eventTime) {
      this.messageService.warning('请完成带"*"项必填内容');
    } else if (!this.submitEventVO.siteName && !this.submitEventVO.areaEmergency) {
      this.messageService.warning('请完成带"*"项必填内容');
    } else if (!this.submitEventVO.areaName && this.submitEventVO.areaEmergency) {
      this.messageService.warning('请完成带"*"项必填内容');
    } else if (!this.submitEventVO.overviewAndRequirements) {
      this.messageService.warning('请完成带"*"项必填内容');
    } else if (this.submitEventVO.isCustomizeEventName && !status) {
      this.messageService.warning('请完成带"*"项必填内容');
    } else {
      this.isVisible = true;
    }
  }
  /* 确认发起应急 */
  submitEmergency() {
    this.isLoading = true;
    this.http.post(`/service/emergency-event/admin/AdminEventApi/submitEvent`, this.submitEventVO).subscribe((res) => {
      if (res.success) {
        this.isLoading = false;
        this.isVisible = false;
        this.visible = false;
        this.clearData();
        this.messageService.success('提示：发起成功');
      } else {
        this.isLoading = false;
        this.messageService.warning('提示：发起失败');
      }
    });
  }

  /* 判断附件格式 */
  judgeFile(url:any):any {
    if (RegExp(/(.jpg)|(.png)|(.webp)|(.jpeg)/).test(url)) {
      return 'assets/img/icon-img.png';
    } else if (RegExp(/(.docx)|(.doc)/).test(url)) {
      return 'assets/img/icon-word.png';
    } else if (RegExp(/(.xlsx)|(.xls)/).test(url)) {
      return 'assets/img/icon-excl.png';
    } else if (RegExp(/(.pdf)/).test(url)) {
      return 'assets/img/icon-pdf.png';
    } else if (RegExp(/(.pptx)|(.ppt)/).test(url)) {
      return 'assets/img/icon-ppt.png';
    }
  }

  /* 获取当前浏览器窗口大小 */
  getWindowSize() {
    let size = window.innerWidth;
    if (size < 1920) {
      this.isShowTips = true;
    } else {
      this.isShowTips = false;
    }
  }

  setCategoryPieLegends() {
    this.pieLegends = this.eventData.map((ele:any, index:any) => {
      return { id: ele.value, title: ele.label, color: this.pieColor[index % this.pieColor.length] };
    });
  }

  setProfessionPieLegends() {
    this.pieLegends = this.majorData.map((ele:any, index:any) => {
      return { id: ele.value, title: ele.label, color: this.pieColor[index % this.pieColor.length] };
    });
  }

  /* 综合类处置统计图数据 */
  changeCategory() {
    this.isChangeCategory = true;
    const category = 'CATEGORY';
    this.categoryIcon = 'assets/img/icon-electricity-blue.png';
    this.categoryIcon2 = 'assets/img/icon-repair-grey.png';
    this.setCategoryPieLegends();
    this.setPieChart(category);
  }

  /* 专业类饼状图统计图数据 */
  changeProfession() {
    this.isChangeCategory = false;
    const category = 'PROFESSION';
    this.categoryIcon = 'assets/img/icon-electricity.png';
    this.categoryIcon2 = 'assets/img/icon-repair.png';
    this.setProfessionPieLegends();
    this.setPieChart(category);
  }

  /* 根据类别加载不同饼状图的数据 */
  setPieChart(category:any) {
    const color:any = [];
    this.optionPie.series[0].data = this.pieData
      .filter((item:any) => item.category == category)
      // @ts-ignore
      .map((element:any) => {
        for (let i = 0; i < this.pieLegends.length; i++) {
          if (element.element_id === this.pieLegends[i].id) {
            color.push(this.pieLegends[i].color);
            return {
              value: element.count,
              name: element.element_name,
            };
          }
        }
      })
      .filter((item:any) => item != undefined);
    console.log(this.optionPie.series[0].data);
    this.optionPie.color = color;
    this.myChart.setOption(this.optionPie, true);
  }

  /* 选择月份 */
  monthChoose(e:any) {
    this.monthNumber = e;
    this.getEventCategoryByMonth(e);
    this.getLevelRoundByMonth(e);
    this.chartMajorValue = this.allEventData[0].value;
    this.isChangeCategory = false;
    this.categoryIcon = 'assets/img/icon-electricity.png';
    this.categoryIcon2 = 'assets/img/icon-repair.png';
  }

  /* 选择时间 */
  chooseDate(e:any) {
    let data = [];
    data[0] = dateTimePickerUtil.format(e[0], 'yyyy-MM-dd');
    data[1] = dateTimePickerUtil.format(e[1], 'yyyy-MM-dd');
    this.chooseTime = data;
    this.getEventPieDataByDate(data);
    this.getLevelRoundByDate(data);
    this.isChangeCategory = false;
    this.categoryIcon = 'assets/img/icon-electricity.png';
    this.categoryIcon2 = 'assets/img/icon-repair.png';
  }

  /* 根据月份查询事件类别统计 */
  getEventCategoryByMonth(data:any) {
    this.http.get(`/service/emergency-event/admin/AdminEventStatisticsApi/eventCategoryStatisticsByMonth/${data}`).subscribe((res) => {
      if (res.success && res.data.length > 0) {
        this.setPieOption(res.data);
      } else {
        this.myChart.hideLoading();
      }
    });
  }

  /* 根据日期来查询饼状图表数据 */
  getEventPieDataByDate(data:any) {
    this.http
      .get(`/service/emergency-event/admin/AdminEventStatisticsApi/eventCategoryStatisticsByTime/${data[0]}/${data[1]}`)
      .subscribe((res) => {
        if (res.success && res.data.length > 0) {
          this.setPieOption(res.data);
        } else {
          this.myChart.hideLoading();
        }
      });
  }

  /* 设置饼状图数据 */
  setPieOption(data:any) {
    const conutData = data;
    this.allEventData = [];
    const color:any = [];
    this.pieData = data;
    this.setProfessionPieLegends();
    this.optionPie.series[0].data = data
      .filter((item:any) => item.category == 'PROFESSION')
      // @ts-ignore
      .map((element:any) => {
        for (let i = 0; i < this.pieLegends.length; i++) {
          if (element.element_id === this.pieLegends[i].id) {
            color.push(this.pieLegends[i].color);
            return {
              value: element.count,
              name: element.element_name,
            };
          }
        }
      })
      .filter((item:any) => item != undefined);
    this.optionPie.color = color;
    data.forEach((element:any) => {
      if (element.category != 'BIG_CATEGORY') {
        for (const eventData of this.eventData) {
          if (element.element_id === eventData.value) {
            const item: any = {};
            item.label = element.element_name;
            item.value = element.element_id;
            this.allEventData.push(item);
          }
        }
        for (const majorData of this.majorData) {
          if (element.element_id === majorData.value) {
            const item: any = {};
            item.label = element.element_name;
            item.value = element.element_id;
            this.allEventData.push(item);
          }
        }
      }
    });
    this.getCategoryAndProfessionData(this.allEventData);
    if (conutData.filter((item:any) => item.element_name == '专业类故障处理')[0] == null){
      this.eventCount[0] = 0;
    }else{
      this.eventCount[0] = conutData.filter((item:any) => item.element_name == '专业类故障处理')[0].count;
    }
    if (conutData.filter((item:any) => item.element_name == '综合类应急处置')[0] == null){
      this.eventCount[1] = 0;
    }else{
      this.eventCount[1] = conutData.filter((item:any) => item.element_name == '综合类应急处置')[0].count;
    }

    this.myChart.hideLoading();
    this.myChart.setOption(this.optionPie, true);
  }

  /* 根据月份查询环形图数据 */
  getLevelRoundByMonth(data:any) {
    this.http.get(`/service/emergency-event/admin/AdminEventStatisticsApi/eventLevelStatisticsByMonth/${data}`).subscribe((res) => {
      if (res.success && res.data.length > 0) {
        this.setRoundOption(res.data);
      } else {
        this.myChart2.hideLoading();
      }
    });
  }

  /* 根据日期查询环形图数据 */
  getLevelRoundByDate(data:any) {
    this.http
      .get(`/service/emergency-event/admin/AdminEventStatisticsApi/eventLevelStatisticsByTime/${data[0]}/${data[1]}`)
      .subscribe((res) => {
        if (res.success && res.data.length > 0) {
          this.setRoundOption(res.data);
        } else {
          this.myChart2.hideLoading();
        }
      });
  }

  /* 设置环形图数据 */
  setRoundOption(data:any) {
    const color:any = [];
    // @ts-ignore
    this.optionRound.series[0].data = data.map((element:any) => {
        for (let i = 0; i < this.roundLegends.length; i++) {
          if (element.element_id === this.roundLegends[i].id) {
            color.push(this.roundLegends[i].color);
            return {
              name: element.element_name,
              value: element.count,
            };
          }
        }
      })
      .filter((item:any) => item != undefined);
    this.optionRound.color = color;
    // @ts-ignore
    this.allLevelData = data.map((element:any) => {
      for (let i = 0; i < this.roundLegends.length; i++) {
        if (element.element_id === this.roundLegends[i].id) {
          return {
            label: element.element_name,
            value: element.element_id,
          };
        }
      }
    });
    this.getLevelLineDataBymonthAndDate(this.allLevelData);
    this.myChart2.hideLoading();
    this.optionRound && this.myChart2.setOption(this.optionRound, true);
  }

  /* 选择月份和日期时初始化级别折线图数据*/
  getLevelLineDataBymonthAndDate(data:any ) {
    this.chartLevelValue = data[0].value;
    if (this.isShow) {
      this.getLevelLineData(data[0].value);
    } else {
      this.getLevelLineData(data[0].value);
    }
  }

  /* 选择月份和日期时初始化专业折线数据 */
  getCategoryAndProfessionData(data:any) {
    this.chartMajorValue = data[0].value;
    if (this.isShow) {
      this.getEventLineData(data[0].value);
    } else {
      this.getEventLineByDate(data[0].value);
    }
  }

  /* 选择专业 */
  selectEvent(id:any) {
    if (this.isShow) {
      this.getEventLineData(id);
    } else {
      this.getEventLineByDate(id);
    }
  }

  /* 选择级别 */
  selectLevel(id:any) {
    if (this.isShow) {
      this.getLevelLineData(id);
    } else {
      this.getLevelLineBydate(id);
    }
  }

  /* 设置专业折线图数据 */
  setEventLineOption(data:any) {
    this.chartLine.xAxis.data = data.map((element:any) => element.event_name);
    this.chartLine.series[0].data = data.map((element:any) => element.minutes);
    this.myChartLine.hideLoading();
    this.chartLine && this.myChartLine.setOption(this.chartLine, true);
  }

  /* 根据月份数和id查询专业折线图数据 */
  getEventLineData(id:any) {
    this.http
      .get(`/service/emergency-event/admin/AdminEventStatisticsApi/eventFinishTimeCategoryStatisticsByMonth/${id}/${this.monthNumber}`)
      .subscribe((res) => {
        if (res.success && res.data.length > 0) {
          this.setEventLineOption(res.data);
        } else {
          this.myChartLine.hideLoading();
        }
      });
  }

  /* 根据时间查询专业折线图数据 */
  getEventLineByDate(id:any) {
    this.http
      .get(
        `/service/emergency-event/admin/AdminEventStatisticsApi/eventFinishTimeCategoryStatisticsByTime/${id}/${this.chooseTime[0]}/${this.chooseTime[1]}`,
      )
      .subscribe((res) => {
        if (res.success && res.data.length > 0) {
          this.setEventLineOption(res.data);
        } else {
          this.myChartLine.hideLoading();
        }
      });
  }

  /* 根据月份查询级别折线图数据*/
  getLevelLineData(id:any) {
    this.http
      .get(`/service/emergency-event/admin/AdminEventStatisticsApi/eventFinishTimeLevelStatisticsByMonth/${id}/${this.monthNumber}`)
      .subscribe((res) => {
        if (res.success && res.data.length > 0) {
          this.setLevelLineOption(res.data);
        } else {
          this.myChartLine2.hideLoading();
        }
      });
  }

  /* 根据日期查询级别折线图数据 */
  getLevelLineBydate(id:any) {
    this.http
      .get(
        `/service/emergency-event/admin/AdminEventStatisticsApi/eventFinishTimeLevelStatisticsByTime/${id}/${this.chooseTime[0]}/${this.chooseTime[1]}`,
      )
      .subscribe((res) => {
        if (res.success && res.data.length > 0) {
          this.setLevelLineOption(res.data);
        } else {
          this.myChartLine2.hideLoading();
        }
      });
  }

  /* 设置级别折线图数据 */
  setLevelLineOption(data:any) {
    this.chartLine2.xAxis.data = data.map((element:any) => element.event_name);
    this.chartLine2.series[0].data = data.map((element:any) => element.minutes);
    this.myChartLine2.hideLoading();
    this.chartLine2 && this.myChartLine2.setOption(this.chartLine2, true);
  }

  ngAfterViewInit() {
    let chartPie:any = document.getElementById('chart-pie');
    let chartRound:any = document.getElementById('chart-round');
    let chartLine:any = document.getElementById('chart-line');
    let chartLine2:any = document.getElementById('chart-line2');
    this.myChart = echarts.init(chartPie);
    this.myChart2 = echarts.init(chartRound);
    this.myChartLine = echarts.init(chartLine);
    this.myChartLine2 = echarts.init(chartLine2);
    this.myChart.showLoading();
    this.myChart2.showLoading();
    this.myChartLine.showLoading();
    this.myChartLine2.showLoading();
  }

  ngOnInit() {
    this.loadLineData();
    this.loadAllArea();
    this.loadEventCategoryData('emergencyBigCategory');
    this.loadEventLevelData('emergencyLevel');
    this.getLocalStorage();
    this.getEmergencyPointDetailList(this.emergencyPointQuery);
    this.getWindowSize();
    this.count = this.submitEventVO.overviewAndRequirements ? this.submitEventVO.overviewAndRequirements.length : 0;
  }
}
