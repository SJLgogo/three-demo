import {Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STComponent} from '@delon/abc/st';
import {SFComponent, SFDateWidgetSchema, SFSchema, SFTreeSelectWidgetSchema} from '@delon/form';
import {DictionaryService} from '../service/dictionary.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ActivatedRoute, Router} from '@angular/router';
import {dateTimePickerUtil} from '@delon/util';
import {NzUploadFile} from 'ng-zorro-antd/upload';
// import {ModalTable} from '../components/modal-table/modal-table.component';
import {EmergencyDispatchChooseRoleComponent} from './chooseRole/choose-role.component';
import {Base} from "../../../common/base";
import {SetupContactSelectComponent} from "../../../shared/components/contact-select/contact-select.component";

// import {FileSaverService} from "ngx-filesaver";

@Component({
  selector: 'app-emergency-dispatch-emergency-ongoing-event',
  templateUrl: './emergency-ongoing-event.component.html',
  styleUrls: ['./emergency-ongoing-event.css'],
})
export class EmergencyDispatchEmergencyOngoingEvent extends Base implements OnInit {
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private dictionaryService: DictionaryService,
    // private fileSaverService: FileSaverService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private messageService: NzMessageService,
  ) {
    super();
  }

  private employee: any;
  visible: boolean = false; // 控制抽屉页面显示
  showClassify: boolean = true;
  showClassify2: boolean = true;
  childrenVisible: boolean = false; // 控制事件相关人员重新通知页面显示
  isShowModal: boolean = false; // 控制物资反馈情况弹窗显示
  isShowEventModal: boolean = false; // 控制关闭事件弹窗显示
  isChange: boolean = false; // 事件变更
  checkbox: boolean = false; // 多选框是否无法选中
  fullPushStatus = 'false'; // 事件相关人员重新通知页面事件大类单选按钮默认选项
  checked = true; // 是否需要与初次通知人员去重默认选中
  drawerWidth = 660; // 子抽屉页面宽度
  pageChoose = 0;
  listIndex = 0;
  emergencyListIndex = 0;
  navchoose = 0;
  isShow = 0; // 控制应急要点审核页面动态class
  colorList: any = ['#fff', '#68d6a4', '#32c5ff', '#d69d00'];
  colorList2: any = ['#fff', '#68d6a4', '#32c5ff', '#d69d00'];
  url = `/service/emergency-event/admin/AdminEventApi/getEventListQuery`;
  planUrl = `/service/emergency-base-config/admin/adminEmergencyPlanFileApi/findForPage`;
  tagUrl = `/service/emergency-base-config/admin/adminTagGroupApi/findAllPage`; // 应急通知标签组表格Url
  uploadApi = `/api/upload`; // 上传upload url
  commandUrl = {
    getCommandUrl: `/service/emergency-event/wxcp/EventApi/getEventCommand/`,
    changeCommandUrl: `/service/emergency-event/wxcp/EventApi/change/onSiteCommand`, // 变更指挥url
    detailUrl: `/service/emergency-event/wxcp/EventApi/add/command/measure`, // 变更详情url
  };
  downloadUrl = "";
  fileDownloadUrl: any;
  basicInfo: any = {};
  emergencyTitle: any;
  isChangeEmergency = false;
  eventListQuery: any = {
    elementIds: [],
  };
  selectLineData:any = []; // 线路数据
  selectLineSectionData:any = []; // 线路区间数据
  selectSiteData :any= []; // 站点数据
  selectSectionData :any= []; // 区间数据
  allAreaData:any = []; // 所有区域数据
  eventCategoryData: any = []; // 事件大类数据
  eventLevelData:any = []; // 事件等级
  eventData:any = []; // 事件类型数据
  majorData:any = []; // 相关专业数据
  emergencyPlanFile :any= []; // 选中的应急规章制度数据
  eventId: any;
  editEventCategoryData: any; // 查看状态下的事件大类数据
  editMajorData: any; // 查看状态下的的相关专业数据
  editLevelData: any; // 查看状态下的事件等级数据
  editEventData: any; // 查看状态下的事件类型数据
  bigCategoryName = '';
  submitEventVO: any = {
    checkUsers: [],
  };

  siteValue:any = []; // 线路选中回调数据
  sectionValue:any = []; // 区间选中回调数据
  areaValue:any = []; // 区域选择回调数据
  siteNameTag:any = []; // 地点标签数据
  fullViewQuery: any = {}; // 查询应急全貌
  tagNum: any; // 应急物资的tag明细
  showModelItem: any; // 物资反馈情况
  responseList: any = {
    notCall: [],
  }; // 响应情况列表
  emergencyResponseList: any = {}; // 应急全貌中的响应情况列表
  thirdId: any;
  getPartyList: any = {};
  fileList: NzUploadFile[] = []; // 上传文件列表
  uploading = false;
   customRequests: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize',
    },
    params: { status: 'ongoing' },
  };

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

  responseData :any= []; // 应急响应情况饼状图数据
  responseData2 :any= []; // 查看应急全貌饼状图数据
  itemDetail:any = []; // 最新处置措施列表组件数据
  emergencyItemList :any= []; // 应急全貌列表数据
  personnelInfoData: any = {}; // 设备抢修负责人/现场指挥组件人员信息
  emergencyReleaseVO: any = {}; // 应急发布
  emergencyHistoryList:any = []; // 应急发布历史
  editCommand = false;

  changeElementsVO: any = {}; // 修改事件描述
  changeEventPlanVO: any = {}; // 修改应急预案
  changeEventAttachmentFileVO: any = {}; // 修改应急附件
  changeTemCallVO: any = {}; // 修改电话人员
  changeEventCommandVO: any = {}; // 修改指挥人员
  changeLine: any = {}; // 修改事件发生线路
  changeStation: any = {}; // 修改事件发生站点
  changeSection: any = {}; // 修改事件发生区间
  changeArea: any = {}; // 修改事件发生区域
  changeBigCategory: any = {}; // 修改事件大类
  changeCategory: any = {}; // 修改事件类型
  changeProfession: any = {}; // 修改专业
  changeLevel: any = {}; // 修改事件等级
  changeApproval: any = {}; // 修改审批人

  pointList:any = []; // 应急要点列表
  roleList:any = []; // 要点角色列表
  selectPoint = {};
  selectRole = {};
  result: String | any; // 处理结果
  closeEventVO: any = {}; // 关闭事件
  resultStatus = 'error';
  sfEventData = []; // 表单事件类型数据
  sfEventLevelData = []; // 表单事件等级数据
  sfLineIds:any = [];
  sfCategoryIds:any = [];
  sfLevelIds:any = [];
  refreshSf = true;
  postCfg:any = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };
  searchCategoryList:any = []; // 查询预案类别列表
  searchTypeList:any = []; // 查询预案类型列表
  planFileType: any; // 应急规章制度类型
  planFileCategory: any; // 应急规章制度类型
  emergencyPlanFileQuery: any = {}; // 查询应急预案
  eventChangeLog :any= []; // 事件变更日志数据
  emergengcyReleaseLog:any = []; // 应急发布历史数据
  allChecked: any = {}; // 选择的所有应急规章制度数据
  goodsTransportList: any; // 物资运输情况列表
  // 应急要点审核要点数据
  allEmergencyPointData:any = [];
  doneEmergencyPointData :any= [];
  undoneEmergencyPointData:any = [];
  isShowReNotice = false; // 事件变更权限
  reNotice: any = {}; // 事件相关人员重新通知数据
  tagGroupVO :any= []; // 选择的应急标签组数据
  tagAndPeopleQuery: any = {
    areaIds: [],
    dictionaryIds: [], // 大类数据
    employeeId: '',
    eventLevelIds: [],
    eventTypeIds: [],
    lineIds: [],
    specialtyIds: [],
    stationIds: [],
  };
  tagGroupQuery: any = {}; // 应急标签组查询
  isLoadingNotice = false; // 确认重新通知加载状态
  showTagGroupVOS:any = []; // 是否显示应急标签组人员列表
  showTagVOS :any= []; // 是否显示预设应急人员列表
  showResponseDetail = false; // 是否显示应急响应情况详情
  submitApprovalEmployeeVO: any = {}; // 新增审批人员数据
  isShowPointBtn = false; // 是否显示应急要点审核按钮
  commandLog:any = []; // 应急指挥记录
  isAreaEmergency = false;
  releaseEmergencyItemVO: any = {}; // 发布应急要点
  showMajorData = false; // 是否显示相关专业数据
  showEventData = false; // 是否显示事件类型数据
  pointRate = 0; // 要点进度
  roleRate = 0; // 角色进度
  pointImageList: NzUploadFile[] = []; // 上传文件列表
  feedbackData:any= {
    resources: '',
    status: '',// $scope.emergencyPointData[index].status,
    content: '',// $scope.emergencyPointData[index].jobContent,
    pointItemId: '',// 应急要点id
    employeeId: '', // 上报人员id
    employeeName: '', // 上报人姓名
    eventId: '',// 应急预案处置要点Id
    employeePost: '',// 上报人岗位
    employeeDeptId: '',// 上报人部门Id
  };
  previewImage: any;
  previewVisible: boolean | undefined ;
  // 应急要点角色
  myRole={
    roleId: undefined,
  };
  canFeedbackRoleList = []
  myRoleName = "";

  readData: any = {
    dom: 'readList',
    scrollDom: 'read',
    method: 'read',
    page: 0,
  };
  notReadData: any = {
    dom: 'notReadList',
    scrollDom: 'notRead',
    method: 'notRead',
    page: 0,
  };
  signData: any = {
    dom: 'signList',
    scrollDom: 'sign',
    method: 'sign',
    page: 0,
  };
  notSignData: any = {
    dom: 'notSignList',
    scrollDom: 'notSign',
    method: 'notSign',
    page: 0,
  };
  callData: any = {
    dom: 'callList',
    scrollDom: 'call',
    method: 'call',
    page: 0,
  };
  notCallData: any = {
    dom: 'notCallList',
    scrollDom: 'notCall',
    method: 'notCall',
    page: 0,
  };
  virtualId: any;
  childReadData: any = {
    dom: 'childReadList',
    scrollDom: 'childRead',
    method: 'read',
    page: 0,
  };
  childNotReadData: any = {
    dom: 'childNotReadList',
    scrollDom: 'childNotRead',
    method: 'notRead',
    page: 0,
  };
  childSignData: any = {
    dom: 'childSignList',
    scrollDom: 'childSign',
    method: 'sign',
    page: 0,
  };
  childNotSignData: any = {
    dom: 'childNotSignList',
    scrollDom: 'childNotSign',
    method: 'notSign',
    page: 0,
  };
  childCallData: any = {
    dom: 'childCallList',
    scrollDom: 'childCall',
    method: 'call',
    page: 0,
  };
  childNotCallData: any = {
    dom: 'childNotCallList',
    scrollDom: 'childNotCall',
    method: 'notCall',
    page: 0,
  };
  isShowDownload = false;
  fileName: any;
  isOnlyMessagePush = false;
  cilckNumber: any;
  childCilckNumber: any;
  modalTableParams = {};

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      eventNameNo: {
        type: 'string',
        title: '事件名称',
        ui: {
          placeholder: '请输入',
          width: 270,
          change: (ngModel:any) => {
            this.eventListQuery.eventName = ngModel;
          },
        },
      },
      '': {
        type: 'string',
        ui: {
          widget: 'date',
          mode: 'range',
          change: (ngModel:any) => {
            // @ts-ignore
            if (ngModel.length != 0) {
              const beginTime = dateTimePickerUtil.format(ngModel[0], 'yyyy-MM-dd');
              const endTime = dateTimePickerUtil.format(ngModel[1], 'yyyy-MM-dd');
              this.eventListQuery.submitStartTime = beginTime;
              this.eventListQuery.submitEndTime = endTime;
            } else {
              this.eventListQuery.submitStartTime = '';
              this.eventListQuery.submitEndTime = '';
            }
          },
        } as SFDateWidgetSchema,
      },
      emergencySite: {
        type: 'string',
        title: '应急地点',
        ui: {
          widget: 'tree-select',
          multiple: true,
          placeholder: '请选择',
          width: 270,
          allowClear: true,
          dropdownStyle: { 'max-height': '500px' },
          change: (ngModel:any) => {
            this.sfLineIds = [];
            ngModel.forEach((element:any) => {
              this.sfLineIds.push(element);
            });
          },
        } as SFTreeSelectWidgetSchema,
      },
      emergencyEventType: {
        type: 'string',
        title: '事件类型',
        ui: {
          widget: 'select',
          placeholder: '请选择',
          mode: 'tags',
          width: 300,
          allowClear: true,
          dropdownStyle: { 'max-height': '500px' },
          change: (ngModel:any) => {
            this.sfCategoryIds = [];
            ngModel.forEach((element:any) => {
              this.sfCategoryIds.push(element);
            });
          },
        } as SFTreeSelectWidgetSchema,
      },
      emergencyEventLevel: {
        type: 'string',
        title: '事件等级',
        ui: {
          widget: 'select',
          mode: 'tags',
          placeholder: '请选择',
          width: 300,
          allowClear: true,
          dropdownStyle: { 'max-height': '500px' },
          change: (ngModel:any) => {
            this.sfLevelIds = [];
            ngModel.forEach((element:any) => {
              this.sfLevelIds.push(element);
            });
          },
        } as SFTreeSelectWidgetSchema,
      },
      emergencyEventOverview: {
        type: 'string',
        title: '事件概况',
        ui: {
          placeholder: '请输入事件概况',
          width: 350,
          change: (ngModel:any) => {
            this.eventListQuery.content = ngModel;
          },
        },
      },
      status: {
        type: 'boolean',
        title: '区域应急',
        ui: {
          change: (ngModel:any) => {
          },
        },
      },
    },
  };

  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '编号', index: 'planName', type: 'checkbox' },
    { title: '事件名称', width: 220, index: 'eventName' },
    { title: '发起时间', width: 220, type: 'date', index: 'eventTime' },
    { title: '发起人', width: 120, index: 'submitEmployeeName' },
    {
      title: '应急地点',
      width: 116,
      format(content) {
        if (content.siteName) {
          if (RegExp(/【/).test(content.siteName)) {
            return content.siteName;
          } else {
            return '【' + content.siteName + '】';
          }
        } else if (content.areaName) {
          if (RegExp(/【/).test(content.areaName)) {
            return content.areaName;
          } else {
            return '【' + content.areaName + '】';
          }
        } else {
          return '-';
        }
      },
    },
    {
      title: '事件类型',
      format: (content) => {
        if (content.categoryName) {
          return content.categoryName;
        } else {
          return '-';
        }
      },
    },
    {
      title: '专业类型',
      format: (content) => {
        if (content.professionName) {
          return content.professionName;
        } else {
          return '-';
        }
      },
    },
    {
      title: '事件等级',
      format: (content) => {
        if (content.levelName) {
          return content.levelName;
        } else {
          return '-';
        }
      },
    },
    { title: '事件描述以及概况', width: 220, index: 'overviewAndRequirements' },

    {
      title: '操作',
      width: 87,

      buttons: [
        {
          text: '详情',
          type: 'link',
          click: (record) => {
            this.isAreaEmergency = record.isAreaEmergency;
            if (this.thirdId == record.submitEmployeeId) {
              this.isShowReNotice = true;
              this.personnelInfoData.noEdit = false;
            } else {
              this.isShowReNotice = false;
              this.personnelInfoData.noEdit = true;
            }
            this.eventId = record.id;
            this.feedbackData.eventId = record.id;
            this.fullViewQuery.eventId = record.id;
            this.getPartyList.eventId = record.id;
            this.emergencyReleaseVO.eventId = record.id;
            this.emergencyReleaseVO.submitThirdId = this.thirdId;
            this.getPartyList.employeeId = this.thirdId;
            this.visible = true;
            this.refreshSf = false;
            this.personnelInfoData.isEdit = false; // 初始化指挥人员编辑状态
            this.personnelInfoData.delete = false; // 初始化指挥人员编辑状态
            this.isChange = false; // 初始化事件变更状态
            this.isOnlyMessagePush = record.onlyPushMessage;
            this.editInfo(record.id);
            this.getLocalStorage();
            record.onlyPushMessage ? this.clickChart(1) : this.clickChart(0);
          },
        },
      ],
    },
  ];

  @ViewChild('st2', { static: false }) st2!: STComponent;
  planColumns: STColumn[] = [
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

  @ViewChild('st3', { static: false }) st3!: STComponent;
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
  isEditEmergency = false;
  pointId: any;
  emergencyPointRoleId: any;

  /* 添加电话人员 */
  selectedItems = [];

  formChange(e:any) {
    const statusProperty:any = this.sf.getProperty('/emergencySite');
    if (e.status) {
      statusProperty.schema.title = '应急区域';
      this.eventListQuery.areaEmergency = true;
      statusProperty.schema.enum = this.allAreaData;
      statusProperty.widget.reset(this.allAreaData);
    } else {
      statusProperty.schema.title = '应急地点';
      this.eventListQuery.areaEmergency = false;
      statusProperty.schema.enum = this.selectLineData;
      statusProperty.widget.reset(this.selectLineData);
    }
  }

  /* 加载所有线路数据 */
  loadLineData() {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/findAllLine`).subscribe((res) => {
      if (res.success) {
        this.selectLineData = res.data.map((element:any) => {
          return { title: element.name, key: element.id };
        });
        // @ts-ignore
        this.searchSchema.properties.emergencySite.enum = this.selectLineData;
        this.selectLineSectionData = res.data.map((element:any) => {
          return { title: element.name, key: element.id };
        });
        for (let i = 0; i < this.selectLineData.length; i++) {
          this.loadSiteData(this.selectLineData[i].key, i);
          this.loadSectionDate(this.selectLineData[i].key, i);
        }
        if (this.refreshSf) {
          this.sf.refreshSchema();
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
        if (this.refreshSf) {
          this.sf.refreshSchema();
        }
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

  /* 加载事件大类 */
  loadEventCategoryData(category: any, check?:any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/` + category).subscribe((res) => {
      this.eventCategoryData = res.data.map((element:any) => {
        return { label: element.label, value: element.id };
      });
      if (typeof check == 'function') {
        check(this.eventCategoryData);
      }
      this.getBigCategoryName();
    });
  }

  /* 加载所有事件等级 */
  loadEventLevelData(category: any, check?:any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/` + category).subscribe((res) => {
      this.eventLevelData = res.data.map((element:any) => {
        return { label: element.label, value: element.id };
      });
      // @ts-ignore
      this.searchSchema.properties.emergencyEventLevel.enum = this.eventLevelData;
      if (this.refreshSf) {
        this.sf.refreshSchema();
      }
      if (typeof check == 'function') {
        check(this.eventLevelData);
        this.editLevelData = this.eventLevelData.filter((item:any) => item.checked).map((item:any) => item.label);
      }
    });
  }

  /* 加载事件类型数据 */
  loadEventlData(value: any, check?:any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByParentId/${value}`).subscribe((res) => {
      if (res.success) {
        this.eventData = res.data.map((element:any) => {
          return { label: element.label, value: element.id };
        });
      }
      if (typeof check == 'function') {
        check(this.eventData);
        this.editEventData = this.eventData.filter((item:any) => item.checked);
      }
    });
  }

  /* 加载相关专业数据 */
  loadMajorData(value: any, check?:any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByParentId/${value}`).subscribe((res) => {
      if (res.success) {
        this.majorData = res.data.map((element:any) => {
          return { label: element.label, value: element.id };
        });
      }
      if (typeof check == 'function') {
        check(this.majorData);
        this.editMajorData = this.majorData.filter((item:any) => item.checked);
      }
    });
  }

  /* 线路选择回调 */
  onLineChange() {
    const stationValue = this.siteValue;
    const sectionValue = this.sectionValue;
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
    this.submitEventVO.lineIds = [...lineIds];
    this.submitEventVO.stationIds = [...stationIds];
    this.submitEventVO.sectionIds = [...sectionIds];
    this.submitEventVO.siteName = [...names].toString();
    this.siteNameTag = [...names];
  }

  /* 区域选择回调 */
  onAreaChange(ngModel:any) {
    const areaName = [];
    const areaIds = [];
    for (let i = 0; i < ngModel.length; i++) {
      const value = this.allAreaData.filter((item:any) => item.key == ngModel[i]).map((item:any) => item.title);
      const id = this.allAreaData.filter((item:any) => item.key == ngModel[i]).map((item:any) => item.key);
      areaName.push(value.toString());
      areaIds.push(id.toString());
    }
    this.submitEventVO.areaIds = areaIds;
    this.submitEventVO.areaName = areaName.toString();
    this.siteNameTag = areaName;
  }

  /* 事件大类变化回调 */
  categoryChange(eventCategoryData:any) {
    const value = eventCategoryData.filter((item:any) => item.checked).map((item:any) => item.value);
    this.submitEventVO.categoryId = value;
    this.showMajorData = eventCategoryData.filter((element:any) => element.label == '专业类故障处理')[0].checked;
    this.showEventData = eventCategoryData.filter((element:any) => element.label == '综合类应急处置')[0].checked;
    if (!this.showEventData) {
      this.submitEventVO.emergencyCategoryId = [];
    } else {
      this.eventChange(this.eventData);
    }

    if (!this.showMajorData) {
      this.submitEventVO.professionId = [];
    } else {
      this.majorChange(this.majorData);
    }
  }

  /* 事件等级变化回调 */
  levelChange(eventLevelData:any) {
    const value = eventLevelData.filter((item:any) => item.checked).map((item:any) => item.value);
    this.editLevelData = eventLevelData.filter((item:any) => item.checked).map((item:any) => item.label);
    this.submitEventVO.eventLevelId = value;
  }

  /* 事件类型变化回调 */
  eventChange(eventData:any) {
    const value = eventData.filter((item:any) => item.checked).map((item:any) => item.value);
    this.editEventData = eventData.filter((item:any) => item.checked);
    this.submitEventVO.emergencyCategoryId = value;
  }

  /* 相关专业选择回调 */
  majorChange(event:any) {
    const value = event.filter((item:any) => item.checked).map((item:any) => item.value);
    this.editMajorData = event.filter((item:any) => item.checked);
    this.submitEventVO.professionId = value;
  }

  editInfo(id:any) {
    /* 加载基础信息*/
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEvent/${id}`).subscribe((res) => {
      if (res.success) {
        this.basicInfo.emergencyTitle = res.data.eventName;
        this.basicInfo.submitEmployeeName = res.data.submitEmployeeName;
        this.basicInfo.submitEmployeeId = res.data.submitEmployeeId;
        this.basicInfo.eventTime = res.data.eventTime;
        this.basicInfo.requirments = res.data.overviewAndRequirements;
        this.submitEventVO.overviewAndRequirements = res.data.overviewAndRequirements;
        if (res.data.siteName != null && !res.data.isAreaEmergency) {
          this.siteNameTag = res.data.siteName.split(/[,]/);
        } else if (res.data.areaName != null && res.data.isAreaEmergency) {
          this.siteNameTag = res.data.areaName.split(/[,]/);
        } else {
          this.siteNameTag = [];
        }
      }
    });

    /* 加载事件类型等级*/
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEventElementInfo/${id}`).subscribe((res) => {
      if (res.success) {
        const lineId :any= [];
        const siteId :any= [];
        const categoryId:any = [];
        const bigCategoryId:any = [];
        const professionId:any = [];
        const areaId :any= [];
        const levelId :any= [];
        const sectionId :any= [];
        res.data.forEach((element:any) => {
          if (element.elementCategory == 'LINE') {
            lineId.push(element.elementId);
          } else if (element.elementCategory == 'CATEGORY') {
            categoryId.push(element.elementId);
          } else if (element.elementCategory == 'BIG_CATEGORY') {
            bigCategoryId.push(element.elementId);
          } else if (element.elementCategory == 'PROFESSION') {
            professionId.push(element.elementId);
          } else if (element.elementCategory == 'STATION') {
            siteId.push(element.elementId);
          } else if (element.elementCategory == 'AREA') {
            areaId.push(element.elementId);
          } else if (element.elementCategory == 'LEVEL') {
            levelId.push(element.elementId);
          } else if (element.elementCategory == 'SECTION_UP') {
            sectionId.push(element.elementId + '-up');
          } else if (element.elementCategory == 'SECTION_DOWN') {
            sectionId.push(element.elementId + '-down');
          }
        });
        const allSiteId = [...lineId, ...siteId];
        this.siteValue = allSiteId;
        this.sectionValue = sectionId;
        this.areaValue = areaId;

        /* 等级回调函数 */
        function levelCheck(value:any) {
          if (levelId.length != 0) {
            levelId.forEach((element:any) => {
              value.forEach((item:any) => {
                if (item.value == element) {
                  item.checked = true;
                }
              });
            });
          }
        }

        /* 事件大类回调函数 */
        const categoryCheck = (value: any) => {
          let eventTypeId: any;
          let majorId: any;
          if (bigCategoryId.length != 0) {
            bigCategoryId.forEach((element:any) => {
              value.forEach((item:any) => {
                if (item.value == element) {
                  item.checked = true;
                }
              });
            });
          }
          this.showMajorData = value.filter((element:any) => element.label == '专业类故障处理')[0].checked;
          this.showEventData = value.filter((element:any) => element.label == '综合类应急处置')[0].checked;
          value.forEach((element:any) => {
            if (element.label == '综合类应急处置') {
              eventTypeId = element.value;
            } else if (element.label == '专业类故障处理') {
              majorId = element.value;
            }
          });
          this.loadEventlData(eventTypeId, eventCheck);
          this.loadMajorData(majorId, majorCheck);
        }

        /* 事件类型回调函数 */
        function eventCheck(value:any) {
          if (categoryId.length != 0) {
            categoryId.forEach((element:any) => {
              value.forEach((item:any) => {
                if (item.value == element) {
                  item.checked = true;
                }
              });
            });
          }
        }

        /* 相关专业回调函数 */
        function majorCheck(value:any) {
          if (professionId.length != 0) {
            professionId.forEach((element:any) => {
              value.forEach((item:any) => {
                if (item.value == element) {
                  item.checked = true;
                }
              });
            });
          }
        }

        const categoryCheck_this = categoryCheck.bind(this);
        this.loadEventCategoryData('emergencyBigCategory', categoryCheck_this);
        this.loadEventLevelData('emergencyLevel', levelCheck);

        this.tagAndPeopleQuery.areaIds = areaId;
        this.tagAndPeopleQuery.dictionaryIds = bigCategoryId;
        this.tagAndPeopleQuery.eventLevelIds = levelId;
        this.tagAndPeopleQuery.eventTypeIds = categoryId;
        this.tagAndPeopleQuery.lineIds = lineId;
        this.tagAndPeopleQuery.specialtyIds = professionId;
        this.tagAndPeopleQuery.stationIds = siteId;

        this.changeArea.elementIds = areaId;
        this.submitEventVO.areaIds = areaId;
        this.changeLine.elementIds = lineId;
        this.submitEventVO.lineIds = lineId;
        this.changeStation.elementIds = siteId;
        this.submitEventVO.stationIds = siteId;
        this.changeSection.elementIds = sectionId;
        this.submitEventVO.sectionIds = sectionId;

        this.changeBigCategory.elementIds = bigCategoryId;
        this.submitEventVO.categoryId = bigCategoryId;

        this.changeCategory.elementIds = categoryId;
        this.submitEventVO.emergencyCategoryId = categoryId;

        this.changeLevel.elementIds = levelId;
        this.submitEventVO.eventLevelId = levelId;

        this.changeProfession.elementIds = professionId;
        this.submitEventVO.professionId = professionId;
      }
    });

    /* 加载应急预案 */
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEmergencyPlanList/${id}`).subscribe((res) => {
      if (res.success) {
        this.changeEventPlanVO.planVOS = res.data.map((element:any) => {
          return {
            fileUrl: element.eventPlanUrl,
            title: element.eventPlanName,
            value: element.eventPlanId,
          };
        });
        this.submitEventVO.eventPlanVOS = res.data.map((element:any) => {
          return {
            fileUrl: element.eventPlanUrl,
            title: element.eventPlanName,
            value: element.eventPlanId,
          };
        });
        this.emergencyPlanFile = res.data.map((element:any) => {
          return {
            fileUrl: element.eventPlanUrl,
            title: element.eventPlanName,
            value: element.eventPlanId,
          };
        });
      }
    });

    /* 加载附件 */
    this.http.get(`/service/emergency-event/wxcp/EventApi/getAttachmentFiles/${id}`).subscribe((res) => {
      if (res.success) {
        this.changeEventAttachmentFileVO.eventAttachmentFileDTOS = res.data.map((element:any) => {
          return {
            url: element.url,
            fileName: element.fileName,
          };
        });
        this.submitEventVO.eventAttachmentFiles = res.data.map((element:any) => {
          return {
            url: element.url,
            fileName: element.fileName,
          };
        });
      }
    });

    /* 加载应急响应情况、应急全貌*/
    this.http.post(`/service/emergency-event/wxcp/EventApi/getEventFullView`, this.fullViewQuery).subscribe((res) => {
      if (res.success) {
        const call = [0, 0];
        const read = [0, 0];
        const sign = [0, 0];
        res.data.forEach((element:any) => {
          call[0] = call[0] + element.call;
          call[1] = call[1] + element.notCall;
          read[0] = read[0] + element.read;
          read[1] = read[1] + element.notRead;
          sign[0] = sign[0] + element.sign;
          sign[1] = sign[1] + element.notSign;
        });
        this.readData.number = read[0];
        this.notReadData.number = read[1] - read[0];
        this.callData.number = call[0];
        this.notCallData.number = call[1] - call[0];
        this.signData.number = sign[0];
        this.notSignData.number = sign[1] - sign[0];
        this.responseData = [
          { chartPieData: call, title: '电话通知情况' },
          { chartPieData: read, title: '消息阅读情况' },
          { chartPieData: sign, title: '人员签到情况' },
        ];
        this.getPreparationsTabNumber();
        this.navChoose(0);
        this.emergencyItemList = res.data.map((item:any) => {
          return {
            title: item.name,
            measureNumber: item.measure,
            call: item.call,
            notCall: item.notCall,
            read: item.read,
            notRead: item.notRead,
            sign: item.sign,
            notSign: item.notSign,
            id: item.id,
          };
        });
      }
    });

    /* 加载 响应列表*/
    this.http.post(`/service/emergency-event/wxcp/EventApi/getPartyList`, '', this.getPartyList, this.postCfg).subscribe((res:any) => {
      if (res.success) {
        this.responseList.callNumber = res.data.call.length;
        this.responseList.notCallNumber = res.data.notCall.length;
        this.responseList.readNumber = res.data.read.length;
        // this.responseList.notReadNumber = res.data.notRead.length;
        this.responseList.signNumber = res.data.sign.length;
        // this.responseList.notSignNumber = res.data.notSign.length;
        this.responseList.call = res.data.call.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            phoneTurnOnTime: element.phoneTurnOnTime,
            phoneOverTime: element.phoneOverTime,
            callTime: element.callDuration,
          };
        });
        this.responseList.notCall = res.data.notCall.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            phoneTurnOnTime: element.phoneOverTime,
          };
        });
        this.responseList.read = res.data.read.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.responseList.notRead = res.data.notRead.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.responseList.notSign = res.data.notSign.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.responseList.sign = res.data.sign.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            manualSignIn: element.manualSignIn,
            arrivedScene: element.arrivedScene,
            latestSignInSite: element.latestSignInSite,
            signTime: element.latestSignInTime,
          };
        });
      }
    });

    /* 加载现场指挥 */
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEventCommand/${id}`).subscribe((res) => {
      this.personnelInfoData.eventId = this.eventId;
      if (res.success && res.data != null) {
        this.personnelInfoData.name = res.data.commandName;
        this.personnelInfoData.img = res.data.commandAvatar;
        this.personnelInfoData.detail = res.data.value;
        this.personnelInfoData.thirdPartyAccountUserId = res.data.commandId;
        this.personnelInfoData.commandId = res.data.id;
      }
    });

    /* 加载最新处置措施 */
    this.http.get(`/service/emergency-measures/measure/find/measureByEventId/${id}`).subscribe((res) => {
      if (res.success) {
        const data = res.data;
        data.forEach((element:any) => {
          if (element.resources == null || !element.resources[0]) {
            element.resources = [];
          } else {
            element.resources = element.resources.split(',');
          }
          element.thirdId = this.thirdId;
        });
        this.itemDetail = data;
      }
    });

    /* 加载应急发布 */
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEmergencyRelease/${id}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.emergencyReleaseVO.emergencyReleaseValue = res.data.emergencyRelease;
      }
    });

    /* 获取审批人员列表 */
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/getEmployeeApprovalEmployeeList/${id}`).subscribe((res) => {
      if (res.success) {
        this.submitEventVO.checkUsers = res.data.map((element:any) => {
          return {
            avatar: element.avatar,
            corpId: element.corpId,
            employeeId: element.employeeId,
            employeeName: element.employeeName,
          };
        });
        this.judgeCheckUserId();
      }
    });
  }

  /* 下拉加载数据 */
  loadList(data:any) {
    if (!this.showResponseDetail) {
      setTimeout(
        ()=> {
          const scrollDom:any = document.getElementById(data.scrollDom);
          const listDom:any = document.getElementById(data.dom);
          const partyListItemQuery: any = {
            employeeId: this.thirdId,
            eventId: this.eventId,
            method: data.method,
            pageSize: 5,
          };
          let list = [];
          // @ts-ignore
          scrollDom.onscroll = () => {
            if (Math.floor(listDom.offsetHeight - scrollDom.scrollTop) == scrollDom.clientHeight && !data.isLoading) {
              data.page++;
              partyListItemQuery.page = data.page;
              this.http.post(`/service/emergency-event/wxcp/EventApi/getPartyListForItem`, partyListItemQuery).subscribe((res) => {
                if (res.success && data.page <= res.data.totalPages) {
                  list = res.data.content.map((element:any) => {
                    return {
                      avatar: element.employeeAvatar,
                      name: element.employeeName,
                      deptName: element.employeeDeptName,
                      manualSignIn: element.manualSignIn,
                      arrivedScene: element.arrivedScene,
                      latestSignInSite: element.latestSignInSite,
                      signTime: element.latestSignInTime,
                      phoneTurnOnTime: element.phoneOverTime,
                    };
                  });
                  if (data.method == 'notRead') {
                    if (this.responseList.notRead.length < 20) {
                      this.responseList.notRead.push(...list);
                    } else {
                      data.modalTableParams = partyListItemQuery;
                      data.isLoading = true;
                    }
                  } else if (data.method == 'notSign') {
                    if (this.responseList.notSign.length < 20) {
                      this.responseList.notSign.push(...list);
                    } else {
                      data.modalTableParams = partyListItemQuery;
                      data.isLoading = true;
                    }
                  } else if (data.method == 'notCall') {
                    if (this.responseList.notCall.length < 20) {
                      this.responseList.notCall.push(...list);
                    } else {
                      data.modalTableParams = partyListItemQuery;
                      data.isLoading = true;
                    }
                  } else if (data.method == 'call') {
                    if (this.responseList.call.length < 20) {
                      this.responseList.call.push(...list);
                    } else {
                      data.modalTableParams = partyListItemQuery;
                      data.isLoading = true;
                    }
                  } else if (data.method == 'read') {
                    if (this.responseList.read.length < 20) {
                      this.responseList.read.push(...list);
                    } else {
                      data.modalTableParams = partyListItemQuery;
                      data.isLoading = true;
                    }
                  } else if (data.method == 'sign') {
                    if (this.responseList.sign.length < 20) {
                      this.responseList.sign.push(...list);
                    } else {
                      data.modalTableParams = partyListItemQuery;
                      data.isLoading = true;
                    }
                  }
                } else {
                  data.isLoading = true;
                }
              });
            }
          }
        },
        100,
      );
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    this.handleUpload();
    return false;
  };

  crimeUpLoad = (e:any) => {
    console.log(this);
    const formData = new FormData();
    formData.append('file', e.file);
    return this.http.post(`/api/upload`, formData).subscribe((res) => {
      if (res.success) {
        const { url } = { url: `${res.data.url}` };
        this.pointImageList.pop();
        const tempArr = JSON.parse(JSON.stringify(this.pointImageList));
        tempArr.push({ url });
        this.pointImageList = tempArr;
      }
    });
  };

  editCrime = (e:NzUploadFile) => {
    const temp = JSON.parse(JSON.stringify(this.pointImageList));
    temp.forEach((item:any, index:any) => (e.url == item.url ? temp.splice(index, 1) : ''));
    this.pointImageList = temp;
    return true
  };

  /* 上传附件 */
  handleUpload() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    this.http.post(`/api/upload`, formData).subscribe((res) => {
      if (res.success) {
        const fileData: any = {};
        fileData.fileName = res.data.fileName + '.' + res.data.suffix;
        fileData.url = res.data.url;
        this.submitEventVO.eventAttachmentFiles.push(fileData);
      }
    });
  }

  getBigCategoryName() {
    let name = [];
    name = this.eventCategoryData.filter((item:any) => item.checked).map((item:any) => item.label);
    this.editEventCategoryData = name.toString();
  }

  /* 添加审核人员 */
  addCheckUser() {
    if (this.isShowReNotice) {
      const mode = ['employee'];
      this.modal.createStatic(SetupContactSelectComponent, {
        selectedItems: [],
        mode,
        isSingleSelect: true,
      }).subscribe((res) => {
        this.submitEventVO.checkUsers = res.selectedItems.map((element:any) => {
          return {
            avatar: element.icon,
            corpId: element.corpId,
            employeeId: element.thirdPartyAccountUserId,
            employeeName: element.name,
            key: '',
          };
        });
        this.saveCheckUserData();
      });
    }
  }

  /* 保存审核人员数据 */
  saveCheckUserData() {
    this.submitApprovalEmployeeVO.emergencyPointApprovalEmployeeVOS = this.submitEventVO.checkUsers;
    this.submitApprovalEmployeeVO.eventId = this.eventId;
    this.http
      .post(`/service/emergency-event/wxcp/EmergencyPointApi/addNewEmployeeApprovalEmployee`, this.submitApprovalEmployeeVO)
      .subscribe((res) => {
        if (res.success) {
          this.messageService.success('提示：更改审核人员成功');
        } else {
          this.messageService.warning('提示：更改审核人员失败');
        }
      });
  }

  /* 判断审核人员权限 */
  judgeCheckUserId() {
    const ids = this.submitEventVO.checkUsers.map((element:any) => element.employeeId);
    ids.forEach((element:any) => {
      if (element == this.thirdId) {
        this.isShowPointBtn = true;
      }
    });
  }

  getLocalStorage() {
    const value = JSON.parse(<string>window.localStorage.getItem('employee'));
    this.fullViewQuery.avatar = value.avatar;
    this.fullViewQuery.name = value.employeeName;
    this.fullViewQuery.thirdId = value.thirdPartyAccountUserId;
    this.thirdId = value.thirdPartyAccountUserId;
    this.employee = value;

    this.changeElementsVO.operationEmployeeId = value.thirdPartyAccountUserId;
    this.changeElementsVO.operationEmployeeName = value.employeeName;

    this.changeEventAttachmentFileVO.employeeId = value.thirdPartyAccountUserId;
    this.changeEventAttachmentFileVO.employeeIdName = value.employeeName;

    this.changeEventPlanVO.employeeId = value.thirdPartyAccountUserId;
    this.changeEventPlanVO.employeeIdName = value.employeeName;

    this.changeBigCategory.operationEmployeeId = value.thirdPartyAccountUserId;
    this.changeBigCategory.operationEmployeeName = value.employeeName;

    this.changeProfession.operationEmployeeId = value.thirdPartyAccountUserId;
    this.changeProfession.operationEmployeeName = value.employeeName;

    this.changeCategory.operationEmployeeId = value.thirdPartyAccountUserId;
    this.changeCategory.operationEmployeeName = value.employeeName;

    this.changeLevel.operationEmployeeId = value.thirdPartyAccountUserId;
    this.changeLevel.operationEmployeeName = value.employeeName;

    this.personnelInfoData.operationEmployeeId = value.thirdPartyAccountUserId;
    this.personnelInfoData.operationEmployeeName = value.employeeName;

    this.changeArea.employeeId = value.thirdPartyAccountUserId;
    this.changeArea.employeeIdName = value.employeeName;

    this.changeLine.employeeId = value.thirdPartyAccountUserId;
    this.changeLine.employeeIdName = value.employeeName;

    this.changeStation.employeeId = value.thirdPartyAccountUserId;
    this.changeStation.employeeIdName = value.employeeName;
    this.changeStation.operationEmployeeId = value.thirdPartyAccountUserId;
    this.changeStation.operationEmployeeName = value.employeeName;

    this.feedbackData.employeeId = value.thirdPartyAccountUserId;
    this.feedbackData.employeeName = value.employeeName;
  }

  /* 打开 应急规章制度关联选择*/
  openEmergencyPlanFile() {
    this.pageChoose = 5;
    this.childrenVisible = true;
    this.emergencyPlanFileQuery.isUsed = true;
    this.drawerWidth = 660;
    this.emergencyPlanFile = this.submitEventVO.eventPlanVOS;
    if (this.st2) {
      this.st2.load();
    }
    this.getEmergencyPlanFileType();
  }

  /* 应急发布 */
  sendEmergency() {
    if (this.emergencyReleaseVO.emergencyReleaseValue && this.isChangeEmergency) {
      this.http.post(`/service/emergency-event/wxcp/EventApi/saveEmergencyRelease`, this.emergencyReleaseVO).subscribe((res) => {
        if (res.success) {
          this.isChangeEmergency = false;
          this.isEditEmergency = false;
          this.messageService.success('提示：应急发布成功');
        } else {
          this.messageService.warning('提示：应急发布失败');
          this.isChangeEmergency = false;
          this.isEditEmergency = false;
        }
      });
    }
  }

  /* 取消应急发布 */
  cancelEmergency() {
    this.isEditEmergency = false;
    this.isChangeEmergency = false;
  }

  /* 编辑应急发布命令 */
  editEmergency() {
    this.isChangeEmergency = true;
    this.isEditEmergency = true;
  }

  /* 保存编辑后的信息 */
  saveEditInfo(url:any, data:any) {
    this.http.post(url, data).subscribe((res) => {
      if (res.success) {
        this.messageService.success('提示：保存变更成功');
        this.changeElementsVO = {};
        this.getLocalStorage();
        this.editInfo(this.eventId);
        this.st.reset();
      } else {
        this.messageService.warning('提示：保存变更失败');
      }
    });
  }

  /* 判断两个数组元素是否相等 */
  judgeResult(arr1:any, arr2:any) {
    let flag = true;
    if (arr1.length != arr1.length) {
      flag = false;
    } else {
      if (JSON.stringify(arr1) == JSON.stringify(arr2)) {
        flag = true;
      } else {
        flag = false;
      }
    }
    return flag;
  }

  childrenCancel() {
    if (this.pageChoose == 6) {
      this.pageChoose = 0;
    } else {
      this.childrenVisible = false;
    }
  }

  childrenConfirm() {
    if (this.pageChoose == 5) {
      this.submitEventVO.eventPlanVOS = this.emergencyPlanFile;
      this.childrenVisible = false;
    } else if (this.pageChoose == 6) {
      this.reNotice.tagGroupVO = this.tagGroupVO;
      this.showTagGroupVOS = this.tagGroupVO.map(() => {
        return { isShow: false };
      });
      this.childrenVisible = true;
      this.pageChoose = 0;
    }
  }

  /* 清除数据 */
  clearData() {
    this.basicInfo = {};
    this.siteNameTag = [];
    this.eventData = [];
    this.majorData = [];
    this.editMajorData = [];
    this.editEventData = [];
    this.editLevelData = [];
    this.emergencyPlanFile = [];
    this.editEventCategoryData = '';
    this.submitEventVO = {
      checkUsers: [],
    };
    this.emergencyReleaseVO = {}; // 应急发布
    this.isChangeEmergency = false;
    this.responseList = {
      notCall: [],
    }; // 响应情况列表
    this.emergencyResponseList = {}; // 应急全貌中的响应情况列表
    this.responseData = []; // 应急响应情况饼状图数据
    this.responseData2 = []; // 应急响应情况饼状图数据
    this.itemDetail = []; // 最新处置措施列表组件数据
    this.emergencyItemList = []; // 应急全貌列表数据
    this.personnelInfoData = {}; // 设备抢修负责人/现场指挥组件人员信息
    this.pointList = []; // 应急要点列表
    this.roleList = []; // 要点角色列表
    this.reNotice = {};
    this.allEmergencyPointData = [];
    this.doneEmergencyPointData = [];
    this.undoneEmergencyPointData = [];
    this.selectPoint = {};
    this.selectRole = {};
    this.refreshSf = false;
    this.isShowPointBtn = false;
    this.showEventData = false;
    this.showMajorData = false;
    this.isEditEmergency = false;
    this.pointRate = 0;
    this.roleRate = 0;
    this.loadEventCategoryData('emergencyBigCategory');
    this.loadEventLevelData('emergencyLevel');
    this.notReadData.page = 0;
    this.notSignData.page = 0;
    this.notCallData.page = 0;
    this.readData.page = 0;
    this.signData.page = 0;
    this.callData.page = 0;
    this.childNotReadData.page = 0;
    this.childNotSignData.page = 0;
    this.childNotCallData.page = 0;
    this.childReadData.page = 0;
    this.childSignData.page = 0;
    this.childCallData.page = 0;
    this.notReadData.isLoading = false;
    this.notSignData.isLoading = false;
    this.notCallData.isLoading = false;
    this.readData.isLoading = false;
    this.signData.isLoading = false;
    this.callData.isLoading = false;
    this.childNotReadData.isLoading = false;
    this.childNotSignData.isLoading = false;
    this.childNotCallData.isLoading = false;
    this.childReadData.isLoading = false;
    this.childSignData.isLoading = false;
    this.childCallData.isLoading = false;
  }

  close() {
    this.visible = false;
    this.clearData();
  }

  /* 打开关闭事件弹窗 */
  openModal(): void {
    if (this.thirdId === this.basicInfo.submitEmployeeId) {
      if (this.eventData) this.isShowEventModal = true;
      this.http.get(`/service/emergency-event/wxcp/EventApi/getEventCloseInfo/${this.eventId}`).subscribe((res) => {
        if (res.success) {
          this.closeEventVO.closeProcessingTime = res.data.time;
          this.closeEventVO.closePartyInEmployeeSize = res.data.employeeNumber;
          this.closeEventVO.closePartyInOrganizationSize = res.data.deptNumber;
        }
      });
    } else {
      this.messageService.warning('只有发起人可以关闭事件');
    }
  }

  /* 打开事件相关人员重新通知页面 */
  openChildren() {
    this.pageChoose = 0;
    this.childrenVisible = true;
    this.drawerWidth = 660;
    this.reNotice.thirdPartyAccountId = this.thirdId;
    this.reNotice.unrepeated = false;
    this.isLoadingNotice = false;
    this.reNotice.eventId = this.eventId;
  }

  /* 查询应急预案预设应急人员 */
  tagSearch() {
    this.tagAndPeopleQuery.employeeId = this.thirdId;
    let url: string;
    if (this.isAreaEmergency) {
      /* 根据区域模糊查询 */
      url = `/service/emergency-base-config/wxcp/tagApi/findByTagIdInIsAreaLike`;
    } else {
      /* 根据线路站点模糊查询 */
      url = `/service/emergency-base-config/wxcp/tagApi/findByTagIdInNotAreaLike`;
    }
    this.http.post(url, this.tagAndPeopleQuery).subscribe((res) => {
      if (res.code == 200) {
        if (res.data) {
          if (res.data.length > 0) {
            const tagVOS = res.data.map((element:any) => {
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
            this.reNotice.tagVOS = tagVOS;
            this.showTagVOS = res.data.map((element:any) => {
              return { isShow: false };
            });
            this.messageService.success('查询成功');
          } else {
            this.reNotice.tagVOS = [];
            this.messageService.warning('未找到标签，请检查管理后台配置');
          }
        } else {
          this.messageService.warning('未找到标签，请检查管理后台配置');
        }
      } else {
        this.messageService.error('查询失败，服务器错误');
      }
    });
  }

  /* 删除应急预案预设应急人员标签 */
  tagClose(i:any) {
    this.reNotice.tagVOS.splice(i, 1);
  }

  /* 删除应急预案预设应急人员标签内人员 */
  tagUserDelete(i:any, a:any) {
    this.reNotice.tagVOS[i].tagUsers.splice(a, 1);
  }

  /* 是否显示预设应急人员列表 */
  showTag(i:any ) {
    this.showTagVOS[i].isShow = !this.showTagVOS[i].isShow;
  }

  addUser() {
    const mode = ['employee'];
    this.modal
      .createStatic(SetupContactSelectComponent, {
        selectedItems: this.selectedItems,
        mode,
        isSingleSelect: false,
      })
      .subscribe((res) => {
        this.selectedItems = res.selectedItems;
        this.reNotice.temCallThirdUsers = res.selectedItems.map((element:any) => {
          return {
            avatar: element.icon,
            corpId: element.corpId,
            eventId: '',
            name: element.name,
            thirdPartyAccountUserId: element.thirdPartyAccountUserId,
          };
        });
      });
  }

  /* 删除电话人员 */
  temCallDelete(i:any) {
    this.reNotice.temCallThirdUsers.splice(i, 1);
  }

  /* 打开应急标签组 */
  chooseTag() {
    this.childrenVisible = false;
    this.drawerWidth = 660;
    this.pageChoose = 6;
    this.childrenVisible = true;
    if (this.st3) {
      this.st3.load();
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
      if (this.reNotice.tagGroupVO != undefined) {
        ids = this.reNotice.tagGroupVO.map((element:any) => element.id);
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
    this.reNotice.tagGroupVO.splice(i, 1);
  }

  /* 删除应急标签组人员 */
  tagUserClose(i:any, a:any) {
    this.reNotice.tagGroupVO[i].tagUsers.splice(a, 1);
  }

  /* 搜索应急标签组 */
  searchTagGroup() {
    if (this.tagGroupQuery.name != undefined) {
      this.st3.load(1, this.tagGroupQuery);
    }
  }

  /* 是否显示应急标签组人员列表 */
  showTagGroup(i:any) {
    this.showTagGroupVOS[i].isShow = !this.showTagGroupVOS[i].isShow;
  }

  /* 确认重新通知 */
  confirmNotice() {
    this.isLoadingNotice = true;
    this.fullPushStatus == 'false' ? (this.reNotice.fullPushStatus = false) : (this.reNotice.fullPushStatus = true);
    this.http.post(`/service/emergency-event/wxcp/EventApi/reNotice`, this.reNotice).subscribe((res) => {
      if (res.success) {
        this.isLoadingNotice = false;
        this.childrenVisible = false;
        this.messageService.success('提示：事件相关人员已重新通知成功');
      } else {
        this.isLoadingNotice = false;
        this.messageService.warning('提示：重新通知失败');
      }
    });
  }

  /* 是否显示应急响应情况详情 */
  changeResponseDetail() {
    this.showResponseDetail = !this.showResponseDetail;
    if (!this.showResponseDetail) {
      this.clickChart(this.listIndex);
    }
  }

  /* 关闭子抽屉页面 */
  closeChildren() {
    this.childNotReadData.page = 0;
    this.childNotSignData.page = 0;
    this.childNotCallData.page = 0;
    this.childReadData.page = 0;
    this.childSignData.page = 0;
    this.childCallData.page = 0;
    this.childNotReadData.isLoading = false;
    this.childNotSignData.isLoading = false;
    this.childNotCallData.isLoading = false;
    this.childReadData.isLoading = false;
    this.childSignData.isLoading = false;
    this.childCallData.isLoading = false;
    if (this.pageChoose == 6) {
      this.pageChoose = 0;
    } else {
      this.childrenVisible = false;
    }
  }

  categoryStatus(showClassify: boolean) {
    this.showClassify = showClassify;
  }

  emergencyCategoryStatus(showClassify: boolean) {
    this.showClassify2 = showClassify;
  }

  clickChart(i: number) {
    if (i != 0) {
      this.cilckNumber = i;
    }
    this.isOnlyMessagePush && i == 0 ? (this.listIndex = this.cilckNumber) : (this.listIndex = i);
    if (this.listIndex == 0) {
      this.loadList(this.notCallData);
      this.loadList(this.callData);
      this.colorList[this.listIndex] = '#fff';
    } else {
      this.colorList[0] = '#4c83e5';
    }
    if (this.listIndex == 1) {
      this.loadList(this.notReadData);
      this.loadList(this.readData);
      this.colorList[this.listIndex] = '#fff';
    } else {
      this.colorList[1] = '#68d6a4';
    }
    if (this.listIndex == 2) {
      this.loadList(this.notSignData);
      this.loadList(this.signData);
      this.colorList[this.listIndex] = '#fff';
    } else {
      this.colorList[2] = '#32c5ff';
    }
    if (this.listIndex == 3) {
      this.colorList[this.listIndex] = '#fff';
    } else {
      this.colorList[3] = '#d69d00';
    }
  }

  /* 应急全貌中图表点击 */
  emergencyClickChart(i: number) {
    if (i != 0) {
      this.childCilckNumber = i;
    }
    this.isOnlyMessagePush && i == 0 ? (this.emergencyListIndex = this.childCilckNumber) : (this.emergencyListIndex = i);
    if (this.emergencyListIndex == 0) {
      this.loadChildList(this.childNotCallData, this.virtualId);
      this.loadChildList(this.childCallData, this.virtualId);
      this.colorList2[this.emergencyListIndex] = '#fff';
    } else {
      this.colorList2[0] = '#4c83e5';
    }
    if (this.emergencyListIndex == 1) {
      this.loadChildList(this.childNotReadData, this.virtualId);
      this.loadChildList(this.childReadData, this.virtualId);
      this.colorList2[this.emergencyListIndex] = '#fff';
    } else {
      this.colorList2[1] = '#68d6a4';
    }
    if (this.emergencyListIndex == 2) {
      this.loadChildList(this.childNotSignData, this.virtualId);
      this.loadChildList(this.childSignData, this.virtualId);
      this.colorList2[this.emergencyListIndex] = '#fff';
    } else {
      this.colorList2[2] = '#32c5ff';
    }
    if (this.emergencyListIndex == 3) {
      this.colorList2[this.emergencyListIndex] = '#fff';
    } else {
      this.colorList2[3] = '#d69d00';
    }
  }

  // 物资运输中 0 物资筹备 1 物资使用中 2
  navChoose(item: number) {
    this.navchoose = item;
    const postData = {
      eventId : this.eventId,
      status : item+1
    }
    this.http.post(`/service/supplies-system/admin/SuppliesPreparationsWxcpApi/getSubmitSuppliesPreparationsList`, postData).subscribe(res=>{
      console.log(res.data);
      this.goodsTransportList = res.data;
      for (let i = 0; i < this.goodsTransportList.length; i++) {
        const item = this.goodsTransportList[i].suppliesOutOrders;
        this.goodsTransportList[i].latestSignInSite = this.goodsTransportList[i].suppliesWarehouseKeeperVOS[0].latestSignInSite;
        const sourceWareHouseId = this.goodsTransportList[i].suppliesOutOrders[0].sourceSuppliesWarehouse.id;
        for(let j = 0;i<this.goodsTransportList[i].suppliesWarehouseKeeperVOS.length;j++){
          const ele = this.goodsTransportList[i].suppliesWarehouseKeeperVOS[j];
          if(ele.suppliesWarehouseId == sourceWareHouseId){
            this.goodsTransportList[i].sourceEmployeeName = ele.employeeName;
            this.goodsTransportList[i].sourceEmployeeAvatar = ele.avatar;
            break;
          }
        }
        this.goodsTransportList[i].goodsName = "";
        this.goodsTransportList[i].goodsNumber = "";
        for (let j = 0; j < item.length; j++) {
          if(j == 0){
            this.goodsTransportList[i].goodsName += item[j].supplies.matName;
            this.goodsTransportList[i].goodsNumber = item[j].matCount+item[j].supplies.matUnit;
          }else{
            this.goodsTransportList[i].goodsName += ";"+item[j].supplies.matName;
            this.goodsTransportList[i].goodsNumber = ";"+item[j].matCount+item[j].supplies.matUnit;
          }
        }
      }
    })
  }

  getPreparationsTabNumber(){
    this.http.get('/service/supplies-system/admin/SuppliesPreparationsWxcpApi/getPreparationsTabNumber/'+this.eventId).subscribe(res=>{
      this.tagNum = res.data;
      console.log(this.tagNum);
      const all = this.tagNum.preparation + this.tagNum.transport+this.tagNum.user;
      this.responseData.push({ chartPieData: [this.tagNum.user,all], title: '物资运输情况' })
      // this.responseData[this.responseData.length - 1].chartPieData= [this.tagNum.user,all];
      console.log(this.responseData)
    })

  }

  showModal(item:any) {
    this.isShowModal = true;
    this.showModelItem = item;
  }

  handleOk(): void {
    this.isShowModal = false;
  }

  handleCancel(): void {
    this.isShowModal = false;
  }

  /* 关闭事件 */
  eventOk(): void {
    if (this.resultStatus == 'success') {
      this.closeEventVO.closeResult = this.result;
      this.http
        .post(`/service/emergency-event/wxcp/EventApi/close/${this.eventId}`, '', this.closeEventVO, this.postCfg)
        .subscribe((res:any) => {
          if (res.success) {
            this.isShowEventModal = false;
            this.visible = false;
            this.messageService.success('提示：关闭事件成功');
            this.st.reset();
          }else{
            this.messageService.error(res.message);
          }
        });
    }
  }

  /* 结果校验 */
  resultChange() {
    if (this.result != undefined && this.result.replace(/[ ]/g, '').length != 0) {
      this.resultStatus = 'success';
    } else {
      this.resultStatus = 'error';
    }
  }

  eventCancel(): void {
    this.isShowEventModal = false;
  }

  changeEvent() {
    this.isChange = true;
    this.checkbox = false;
  }

  /* 保存变更后的数据 */
  saveChange() {
    this.isChange = false;
    /* 保存编辑后的基础信息 */
    if (Object.keys(this.changeElementsVO).length > 3) {
      const url = `/service/emergency-event/wxcp/EventApi/changeEventDescription`;
      if (
        this.changeElementsVO.overviewAndRequirements == null ||
        this.changeElementsVO.overviewAndRequirements == '' ||
        this.changeElementsVO.overviewAndRequirements == undefined
      ) {
        this.submitEventVO.overviewAndRequirements = this.basicInfo.requirments;
        this.messageService.warning('事件详细描述不能为空');
      } else {
        this.saveEditInfo(url, this.changeElementsVO);
      }
    }
    if (this.isAreaEmergency) {
      /* 保存编辑后的事件发生区域 */
      if (!this.judgeResult(this.changeArea.elementIds, this.submitEventVO.areaIds)) {
        if (this.changeStation.areaName !== '' && this.submitEventVO.areaIds.length !== 0) {
          const url = `/service/emergency-event/wxcp/EventApi/changeEventElement`;
          this.changeArea.elementIds = this.submitEventVO.areaIds;
          this.changeArea.elementCategory = 'AREA';
          this.changeArea.eventId = this.eventId;
          this.changeArea.areaName = this.submitEventVO.areaName;
          this.saveEditInfo(url, this.changeArea);
        } else {
          this.messageService.warning('提示：修改发生区域失败，发生区域不可为空');
          this.areaValue = this.changeArea.elementIds;
          this.submitEventVO.areaIds = this.areaValue;
          this.editInfo(this.eventId);
        }
      }
    } else {
      // /* 保存编辑后的事件发生线路 */
      if (!this.judgeResult(this.changeLine.elementIds, this.submitEventVO.lineIds)) {
        const url = `/service/emergency-event/wxcp/EventApi/changeEventElement`;
        if (this.changeStation.siteName !== '' && (this.submitEventVO.lineIds.length !== 0 || this.submitEventVO.stationIds.length !== 0)) {
          this.changeLine.elementIds = this.submitEventVO.lineIds;
          this.changeLine.elementCategory = 'LINE';
          this.changeLine.eventId = this.eventId;
          this.changeLine.siteName = this.submitEventVO.siteName;
          this.saveEditInfo(url, this.changeLine);
        } else {
          this.messageService.warning('提示：修改发生地点失败，发生地点不可为空');
          const allSiteId = [...this.changeLine.elementIds, ...this.changeStation.elementIds];
          this.siteValue = allSiteId;
          this.submitEventVO.lineIds = this.changeLine.elementIds;
          this.editInfo(this.eventId);
        }
      }
      // /* 保存编辑后的事件发生站点 */
      if (!this.judgeResult(this.changeStation.elementIds, this.submitEventVO.stationIds)) {
        const url = `/service/emergency-event/wxcp/EventApi/changeEventElement`;
        this.changeStation.elementIds = this.submitEventVO.stationIds;
        this.changeStation.elementCategory = 'STATION';
        this.changeStation.eventId = this.eventId;
        this.changeStation.siteName = this.submitEventVO.siteName;
        if (
          this.changeStation.siteName !== '' &&
          (this.submitEventVO.lineIds.length !== 0 ||
            this.submitEventVO.stationIds.length !== 0 ||
            this.submitEventVO.sectionIds.length !== 0)
        ) {
          this.saveEditInfo(url, this.changeStation);
        } else {
          this.messageService.warning('提示：修改发生地点失败，发生地点不可为空');
          const allSiteId = [...this.changeLine.elementIds, ...this.changeStation.elementIds];
          this.siteValue = allSiteId;
          this.submitEventVO.stationIds = this.changeStation.elementIds;
          this.editInfo(this.eventId);
        }
      }
      const upChangeSection = this.changeSection.elementIds.filter((item:any) => item.split('-')[1] == 'up');
      const downChangeSection = this.changeSection.elementIds.filter((item:any) => item.split('-')[1] == 'down');
      const submitUpSection = this.submitEventVO.sectionIds.filter((item:any) => item.split('-')[1] == 'up');
      const submitDownSection = this.submitEventVO.sectionIds.filter((item:any) => item.split('-')[1] == 'down');
      if (!this.judgeResult(upChangeSection, submitUpSection)) {
        const url = `/service/emergency-event/wxcp/EventApi/changeEventElement`;
        const req = {
          elementCategory: 'SECTION_UP',
          elementIds: submitUpSection,
          eventId: this.eventId,
          siteName: this.submitEventVO.siteName,
          operationEmployeeId: this.changeStation.employeeId,
          operationEmployeeName: this.changeStation.employeeIdName,
        };
        if (
          req.siteName !== '' &&
          (this.submitEventVO.lineIds.length !== 0 ||
            this.submitEventVO.stationIds.length !== 0 ||
            this.submitEventVO.sectionIds.length !== 0)
        ) {
          this.saveEditInfo(url, req);
        } else {
          this.messageService.warning('提示：修改发生地点失败，发生地点不可为空');
          const allSectionId = [...this.changeSection.elementIds];
          this.sectionValue = allSectionId;
          this.submitEventVO.sectionIds = this.changeSection.elementIds;
          this.editInfo(this.eventId);
        }
      }
      if (!this.judgeResult(downChangeSection, submitDownSection)) {
        const url = `/service/emergency-event/wxcp/EventApi/changeEventElement`;
        const req = {
          elementCategory: 'SECTION_DOWN',
          elementIds: submitDownSection,
          eventId: this.eventId,
          siteName: this.submitEventVO.siteName,
          operationEmployeeId: this.changeStation.employeeId,
          operationEmployeeName: this.changeStation.employeeIdName,
        };
        if (
          req.siteName !== '' &&
          (this.submitEventVO.lineIds.length !== 0 ||
            this.submitEventVO.stationIds.length !== 0 ||
            this.submitEventVO.sectionIds.length !== 0)
        ) {
          this.saveEditInfo(url, req);
        } else {
          this.messageService.warning('提示：修改发生地点失败，发生地点不可为空');
          const allSectionId = [...this.changeSection.elementIds];
          this.sectionValue = allSectionId;
          this.submitEventVO.sectionIds = this.changeSection.elementIds;
          this.editInfo(this.eventId);
        }
      }
    }

    /* 保存编辑后的事件大类数据 */
    if (!this.judgeResult(this.changeBigCategory.elementIds, this.submitEventVO.categoryId)) {
      const url = `/service/emergency-event/wxcp/EventApi/changeEventElement`;
      this.changeBigCategory.elementIds = this.submitEventVO.categoryId;
      this.tagAndPeopleQuery.dictionaryIds = this.submitEventVO.categoryId;
      this.changeBigCategory.elementCategory = 'BIG_CATEGORY';
      this.changeBigCategory.eventId = this.eventId;
      this.saveEditInfo(url, this.changeBigCategory);
    }

    /* 保存编辑后的专业数据 */
    if (!this.judgeResult(this.changeProfession.elementIds, this.submitEventVO.professionId)) {
      const url = `/service/emergency-event/wxcp/EventApi/changeEventElement`;
      this.changeProfession.elementIds = this.submitEventVO.professionId;
      this.tagAndPeopleQuery.specialtyIds = this.submitEventVO.professionId;
      this.changeProfession.elementCategory = 'PROFESSION';
      this.changeProfession.eventId = this.eventId;
      this.saveEditInfo(url, this.changeProfession);
    }

    /* 保存编辑后的事件类型数据 */
    if (!this.judgeResult(this.changeCategory.elementIds, this.submitEventVO.emergencyCategoryId)) {
      const url = `/service/emergency-event/wxcp/EventApi/changeEventElement`;
      this.changeCategory.elementIds = this.submitEventVO.emergencyCategoryId;
      this.tagAndPeopleQuery.eventTypeIds = this.submitEventVO.emergencyCategoryId;
      this.changeCategory.elementCategory = 'CATEGORY';
      this.changeCategory.eventId = this.eventId;
      this.saveEditInfo(url, this.changeCategory);
    }

    /* 保存编辑后的事件等级数据 */
    if (!this.judgeResult(this.changeLevel.elementIds, this.submitEventVO.eventLevelId)) {
      const url = `/service/emergency-event/wxcp/EventApi/changeEventElement`;
      this.changeLevel.elementIds = this.submitEventVO.eventLevelId;
      this.tagAndPeopleQuery.eventLevelIds = this.submitEventVO.eventLevelId;
      this.changeLevel.elementCategory = 'LEVEL';
      this.changeLevel.eventId = this.eventId;
      this.saveEditInfo(url, this.changeLevel);
    }

    /* 保存编辑后的应急预案 */
    if (!this.judgeResult(this.changeEventPlanVO.planVOS, this.submitEventVO.eventPlanVOS)) {
      const url = `/service/emergency-event/wxcp/EventApi/changeEventPlans`;
      this.changeEventPlanVO.planVOS = this.submitEventVO.eventPlanVOS;
      this.changeEventPlanVO.eventId = this.eventId;
      this.saveEditInfo(url, this.changeEventPlanVO);
    }

    /* 保存编辑后的附件 */
    if (!this.judgeResult(this.changeEventAttachmentFileVO.eventAttachmentFileDTOS, this.submitEventVO.eventAttachmentFiles)) {
      const url = `/service/emergency-event/wxcp/EventApi/changeAttachmentFiles`;
      this.changeEventAttachmentFileVO.eventAttachmentFileDTOS = this.submitEventVO.eventAttachmentFiles;
      this.changeEventAttachmentFileVO.eventId = this.eventId;
      this.saveEditInfo(url, this.changeEventAttachmentFileVO);
    }
  }

  textareaChange() {
    if (this.submitEventVO.overviewAndRequirements.trim() != this.basicInfo.requirments.trim()) {
      this.changeElementsVO.overviewAndRequirements = this.submitEventVO.overviewAndRequirements;
      this.changeElementsVO.eventId = this.eventId;
    } else {
      delete this.changeElementsVO.overviewAndRequirements;
    }
  }

  /* 删除审核人员 */
  deleteCheckUser(i:any) {
    this.submitEventVO.checkUsers.splice(i, 1);
    this.saveCheckUserData();
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
      for (const key in this.allChecked) {
        this.emergencyPlanFile.push(...this.allChecked[key]);
      }
    }
    let ids = [];
    ids = this.emergencyPlanFile.map((element:any) => element.value);
    ids.forEach((element:any) => {
      this.st2.list.forEach((item:any) => {
        if (element == item.id) {
          item.checked = true;
        }
      });
    });
  }

  /* 删除应急规章制度 */
  emergencyPlanFileDelete(i:any) {
    const value = this.submitEventVO.eventPlanVOS[i].value;
    for (const key in this.allChecked) {
      this.allChecked[key].forEach((element:any, index:any) => {
        if (element.value == value) {
          this.allChecked[key].splice(index, 1);
        }
      });
    }
    this.submitEventVO.eventPlanVOS.splice(i, 1);
  }

  /* 删除附件 */
  deleteAttachmentFiles(i:any) {
    this.submitEventVO.eventAttachmentFiles.splice(i, 1);
  }

  /* 获取应急要点列表 */
  getPointList() {
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/get/emergencyPointList/${this.eventId}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.pointList = res.data;
      }
    });
  }

  /* 要点选择 */
  choosePoint(value:any) {
    if (value != null) {
      const id = value.value;
      this.pointId = value.value;
      this.getEmergencyPointDetail(id);
      this.getAllRolePoint(id);
      this.selectRole = {};
    } else {
      this.selectRole = {};
      this.allEmergencyPointData = [];
      this.doneEmergencyPointData = [];
      this.undoneEmergencyPointData = [];
      this.pointRate = 0;
    }
  }

  /* 获取要点下所有角色详情 */
  getAllRolePoint(id:any) {
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/get/emergencyPointItemListByPointId/${id}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.allEmergencyPointData = res.data.map((element:any) => {
          return {
            content: element.content,
            materialReference: element.materialReference,
            pointRoleId:element.pointRoleId,
            status: element.status,
            hidden: false,
            isPublish: false,
            id: element.id,
            showFeedBack: false,
          };
        });
        this.allEmergencyPointData.forEach((element:any, index:any) => {
          this.getPointReportList(element.id, index);
        });
      }
    });
  }

  /* 获取要点详情、角色列表 */
  getEmergencyPointDetail(id:any) {
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/get/emergencyPointDetail/${id}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.pointRate = parseInt(res.data.rate);
        this.roleList = res.data.pointRoleVOList.map((element:any) => {
          return {
            label: element.roleName,
            value: element.id,
            rate: element.roleRate,

          };
        });
      }
    });
  }

  /* 选择角色 */
  chooseRole(item:any) {
    if (item != null) {
      const id = item.value;
      this.emergencyPointRoleId = item.value;
      this.roleRate = item.rate;
      this.getPointDetail(id);
    } else {
      this.roleRate = 0;
      this.getAllRolePoint(this.pointId);
    }
  }

  /* 获取所有应急要点列表 */
  getPointDetail(id:any) {
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/get/emergencyPointItemList/${id}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.allEmergencyPointData = res.data.map((element:any) => {
          return {
            content: element.content,
            materialReference: element.materialReference,
            status: element.status,
            pointRoleId:element.pointRoleId,
            hidden: false,
            isPublish: false,
            id: element.id,
            showFeedBack: false,
          };
        });
        this.allEmergencyPointData.forEach((element:any, index:any) => {
          this.getPointReportList(element.id, index);
        });
      }
    });
  }

  /* 获取回复列表 */
  getPointReportList(id:any, i:any) {
    let undone: any;
    let done: any;
    const reportIds:any = [];
    const newReportIds = [];
    const obj :any= {};
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/get/findAllReportEmployeeByPointItemId/${id}`).subscribe((res) => {
      if (res.success && res.data.length > 0) {
        this.allEmergencyPointData[i].reportItem = res.data.map((element:any) => {
          return {
            deptName: element.deptName,
            reportEmployeeList: element.reportEmployeeList.map((item:any) => {
              return {
                content: item.content,
                name: item.employeeName,
                time: item.createdDate,
                status: item.status,
                resources: item.resources,
                employeeId: item.employeeId,
              };
            }),
          };
        });
        this.allEmergencyPointData[i].reportItem.forEach((item:any) => {
          item.reportEmployeeList.forEach((list:any) => {
            if (list.resources) {
              list.resources = list.resources.split(',');
            } else {
              list.resources = [];
            }
          });
        });
        this.allEmergencyPointData[i].reportItem.forEach((element:any) => {
          element.reportEmployeeList.forEach((item:any) => {
            reportIds.push(item.employeeId);
          });
        });
      }
      /* 对回复人员id去重 */
      reportIds.forEach((element:any, index:any) => {
        if (!obj[element]) {
          newReportIds.push(reportIds[index]);
          obj[element] = 1;
        }
      });
      this.allEmergencyPointData[i].reportNumber = newReportIds.length;
      undone = JSON.stringify(this.allEmergencyPointData.filter((item:any) => item.status == -1 || item.status == 0));
      done = JSON.stringify(this.allEmergencyPointData.filter((item:any) => item.status == 1));
      this.doneEmergencyPointData = JSON.parse(done);
      this.undoneEmergencyPointData = JSON.parse(undone);
    });
  }

  openFeedback(item:any) {
    this.feedbackData.content = '';
    this.feedbackData.resources = '';
    this.pointImageList = [];
    // 判断是否有岗位及是否有权限进行反馈
    if(!this.myRole.roleId){
      this.messageService.error("无岗位信息");
      return;
    }
    let exist = false;
    let roleId = "";
    for(const obj of this.roleList){
      if(obj.value == item.pointRoleId){
        roleId = obj.label;
      }
    }
    console.log(this.roleList);
    console.log(this.canFeedbackRoleList);
    for (let i = 0; i < this.canFeedbackRoleList.length; i++) {
      if(roleId === this.canFeedbackRoleList[i]){
        exist = true;
      }
    }
    if(!exist){
      this.messageService.error("无权限反馈");
      return;
    }

    if(item.showFeedBack == false){
      for (let i = 0;i < this.allEmergencyPointData.length; i++){
        this.allEmergencyPointData[i].showFeedBack = false;
      }
      item.showFeedBack = true;
    }else{
      item.showFeedBack = false;
    }
  }
  // 获取可反馈的应急要点角色列表
  getCanFeedbackRoleListByName(name:any ) {
    this.http.get('/service/emergency-base-config/admin/emergencyRoleApi/getRoleScope/'+ name ).subscribe((res)=> {
      if(res.success){
        this.canFeedbackRoleList = res.data.scope;
      }
    })
  }

  // 获取所有角色信息列表
  getRoleList() {
    const roleList:any = [];
    // 进行查询角色信息列表
    this.http.get('/service/emergency-base-config/admin/emergencyPointApi/getPointRoleList').subscribe((res)=> {
      if (res.success) {
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i];
          roleList.push({name: item.name, id: item.id});
        }
        this.roleList = roleList;
        this.getMyRole();
        // 在点击反馈时判定弹窗
      } else {
        this.messageService.warning("加载角色信息列表失败");
      }
    });
  }

  // 获取当前用户已选的角色信息
  getMyRole(){
    // 获取个人的职位信息，如果登录信息里职位信息为空则弹窗选择。
    if(this.employee.position === "" || this.employee.position === null){
      this.http.get('/service/emergency-event/wxcp/EmergencyPointApi/get/roleByEventIdAndEmployeeId/' + this.eventId + '/' + this.thirdId).subscribe((res) => {
        if (res.success) {
          if (res.data !== null) {
            for (let i = 0; i < this.roleList.length; i++) {
              if (this.roleList[i].id === res.data.roleId) {
                this.myRole = res.data;
                this.getCanFeedbackRoleListByName(this.myRole.roleId);
              }
            }
          } else {
            // 弹窗选择角色
            this.modal.createStatic(EmergencyDispatchChooseRoleComponent, {i: { eventId: this.eventId }},{ modalOptions:{nzClosable:false,nzKeyboard:false}} ).subscribe((result) => {
              this.getMyRole();
            });
          }
        }
      });
    }else{
      this.myRole = {roleId: this.employee.position};
      this.getCanFeedbackRoleListByName(this.myRole.roleId);
    }
  }

  // 反馈应急要点
  feedback(item:any){
    console.log(this.pointImageList,item)
    let displayUrl = "";
    for (let i = 0; i < this.pointImageList.length; i++) {
      const ele = this.pointImageList[i];
      if (i ===  this.pointImageList.length - 1) {
        displayUrl += ele.url;
      } else {
        displayUrl += ele.url + ",";
      }
    }
    this.feedbackData.pointItemId = item.id;
    this.feedbackData.resources = displayUrl;
    this.feedbackData.status = item.status;
    this.feedbackData.employeePost = this.myRole.roleId;

    this.http.post(`/service/emergency-event/wxcp/EmergencyPointApi/submitPointReport/`, this.feedbackData).subscribe((res) => {
      if (res.success) {
        this.openFeedback(item);
        if(JSON.stringify(this.selectRole) !== '{}'){
          this.chooseRole(this.selectRole);
        }else{
          this.choosePoint(this.selectPoint);
        }
      }
    });
  }

  /* 应急要点发布 */
  confirmPublish(i:any, number:any) {
    if (number > 0) {
      this.releaseEmergencyItemVO.employeeId = this.thirdId;
      this.releaseEmergencyItemVO.eventId = this.eventId;
      this.releaseEmergencyItemVO.pointItemId = this.undoneEmergencyPointData[i].id;
      this.http
        .post(`/service/emergency-event/wxcp/EmergencyPointApi/releaseEmergencyItem/`, this.releaseEmergencyItemVO)
        .subscribe((res) => {
          if (res.success) {
            this.undoneEmergencyPointData[i].isPublish = false;
            this.messageService.success('提示：要点发布成功');
            this.getPointDetail(this.emergencyPointRoleId);
            this.isShow = 0;
          } else {
            this.messageService.warning('提示：要点发布失败');
          }
        });
    }
  }

  /* 重新拨打电话 */
  recall() {
    this.http.get(`/service/emergency-event/wxcp/EventApi/callingAgain/${this.eventId}`).subscribe((res) => {
      if (res.success) {
        this.messageService.success('提示：重新拨打成功');
      }
    });
  }

  /* 删除应急处置措施后刷新处置措施列表*/
  deleteItem(status:any) {
    if (status) {
      /* 加载最新处置措施 */
      this.http.get(`/service/emergency-measures/measure/find/measureByEventId/${this.eventId}`).subscribe((res) => {
        if (res.success) {
          const data = res.data;
          data.forEach((element:any) => {
            if (element.resources == null || !element.resources[0]) {
              element.resources = [];
            } else {
              element.resources = element.resources.split(',');
            }
            element.thirdId = this.thirdId;
          });
          this.itemDetail = data;
        }
      });
    }
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
      const id = event.value;
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
      const id = event.value;
      this.emergencyPlanFileQuery.categoryId = id;
    } else {
      this.emergencyPlanFileQuery.categoryId = '';
    }
  }

  /* 查询应急规章制度 */
  searchEmergencyPlan() {
    /* 判断搜索条件是否为空 */
    if (Object.keys(this.emergencyPlanFileQuery).length != 0) {
      this.st2.load(1, this.emergencyPlanFileQuery);
    }
  }

  /* 打开应急变更历史 */
  openEventChangeHistory() {
    this.pageChoose = 1;
    this.childrenVisible = true;
    this.drawerWidth = 540;
    this.http.get(`/service/emergency-event/wxcp/EventApi/getChangeLogList/${this.eventId}`).subscribe((res) => {
      if (res.success) {
        this.eventChangeLog = res.data;
      }
    });
  }

  /* 打开应急发布历史查询 */
  openEmergencyHistory() {
    this.pageChoose = 2;
    this.childrenVisible = true;
    this.drawerWidth = 540;
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEmergencyReleaseHistory/${this.eventId}`).subscribe((res) => {
      if (res.success) {
        this.emergengcyReleaseLog = res.data.map((element:any) => {
          return {
            time: element.createdTime,
            content: element.emergencyRelease,
          };
        });
      }
    });
  }

  /* 表单重置 */
  resetSearch(e:any) {
    const extraParams = { status: 'ongoing' };
    this.st.reset(extraParams);
    this.eventListQuery = {
      elementIds: [],
    };
    this.sfCategoryIds = [];
    this.sfLevelIds = [];
    this.sfLineIds = [];
    this.sf.reset(true);
  }

  /* 导出excel */
  exportExcel() {
    const objString = JSON.stringify(this.eventListQuery);
    const exportQuery = JSON.parse(objString);
    exportQuery.status = 'ongoing';
    exportQuery.employeeId = this.thirdId;
    exportQuery.elementIds = [...this.sfLineIds, ...this.sfCategoryIds, ...this.sfLevelIds];
    this.http
      .post(`/service/emergency-event/admin/AdminEventApi/download/exportEventListExcel`, exportQuery, null, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe(
        (res) => {
          console.log('res:', res);
          if (res != null) {
            // this.fileSaverService.save(res.body, '正在进行的事件.xls');
            this.messageService.success('导出成功');
          } else {
            this.messageService.warning('导出数据为空,请检查查询条件!');
          }
        },
        (error) => {
          console.log(error);
          this.messageService.error('导出失败');
        },
      );
  }

  /* 表单搜索 */
  fromSearch() {
    /* 判断搜索条件是否为空 */
    this.eventListQuery.status = 'ongoing';
    this.eventListQuery.elementIds = [...this.sfLineIds, ...this.sfCategoryIds, ...this.sfLevelIds];
    if (Object.keys(this.eventListQuery).length > 2 || this.eventListQuery.elementIds.length != 0) {
      this.st.load(1, this.eventListQuery);
    }
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

  /* 查看应急全貌详情 */
  openEmengencyItem(i:any) {
    this.pageChoose = 7;
    this.childrenVisible = true;
    this.drawerWidth = 660;
    this.getEmergencyItemDetail(i);
    this.getEmergencyList(i);
    this.isOnlyMessagePush ? this.emergencyClickChart(1) : this.emergencyClickChart(0);
  }

  /* 获取子抽屉应急全貌详情 */
  getEmergencyItemDetail(i:any) {
    const id = this.emergencyItemList[i].id;
    this.virtualId = id;
    const fullViewQuery2 = this.fullViewQuery;
    fullViewQuery2.virtualId = id;
    this.http.post(`/service/emergency-event/wxcp/EventApi/getEventSingleFullView`, fullViewQuery2).subscribe((res) => {
      if (res.success) {
        const call = [];
        const read = [];
        const sign = [];
        call[0] = res.data[0].call;
        call[1] = res.data[0].notCall;
        read[0] = res.data[0].read;
        read[1] = res.data[0].notRead;
        sign[0] = res.data[0].sign;
        sign[1] = res.data[0].notSign;
        this.childReadData.number = read[0];
        this.childNotReadData.number = read[1] - read[0];
        this.childCallData.number = call[0];
        this.childNotCallData.number = call[1] - call[0];
        this.childSignData.number = sign[0];
        this.childNotSignData.number = sign[1] - sign[0];
        this.responseData2 = [
          { chartPieData: call, title: '电话通知情况' },
          { chartPieData: read, title: '消息阅读情况' },
          { chartPieData: sign, title: '人员签到情况' },
          // { chartPieData: [3, 15], title: '物资运输情况' },
        ];
      }
    });
  }

  /* 获取子抽屉应急响应情况列表 */
  getEmergencyList(i:any) {
    const id = this.emergencyItemList[i].id;
    const getPartyList2 = this.getPartyList;
    getPartyList2.virtualId = id;
    this.http.post(`/service/emergency-event/wxcp/EventApi/getPartyListVirtual`, '', getPartyList2, this.postCfg).subscribe((res:any) => {
      if (res.success) {
        this.emergencyResponseList.callNumber = res.data.call.length;
        this.emergencyResponseList.notCallNumber = res.data.notCall.length;
        this.emergencyResponseList.readNumber = res.data.read.length;
        this.emergencyResponseList.notReadNumber = res.data.notRead.length;
        this.emergencyResponseList.signNumber = res.data.sign.length;
        this.emergencyResponseList.notSignNumber = res.data.notSign.length;
        this.emergencyResponseList.call = res.data.call.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            phoneTurnOnTime: element.phoneTurnOnTime,
            phoneOverTime: element.phoneOverTime,
            callTime: element.callDuration,
          };
        });
        this.emergencyResponseList.notCall = res.data.notCall.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            phoneTurnOnTime: element.phoneOverTime,
          };
        });
        this.emergencyResponseList.read = res.data.read.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.emergencyResponseList.notRead = res.data.notRead.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.emergencyResponseList.notSign = res.data.notSign.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.emergencyResponseList.sign = res.data.sign.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            manualSignIn: element.manualSignIn,
            arrivedScene: element.arrivedScene,
            latestSignInSite: element.latestSignInSite,
            signTime: element.latestSignInTime,
          };
        });
      }
    });
  }

  /* 加载子抽屉应急全貌数据 */
  loadChildList(data:any, id:any) {
    setTimeout(
      ()=> {
        const scrollDom:any = document.getElementById(data.scrollDom);
        const listDom:any = document.getElementById(data.dom);
        const partyListItemQuery: any = {
          employeeId: this.thirdId,
          eventId: this.eventId,
          method: data.method,
          pageSize: 5,
          virtualId: id,
        };
        let list = [];
        scrollDom.scrollTop = 0;
        scrollDom.onscroll = ()=>{
          if (Math.floor(listDom.offsetHeight - scrollDom.scrollTop) == scrollDom.clientHeight && !data.isLoading) {
            data.page++;
            partyListItemQuery.page = data.page;
            this.http.post(`/service/emergency-event/wxcp/EventApi/getPartyListForItemVirtual`, partyListItemQuery).subscribe((res) => {
              if (res.success && data.page <= res.data.totalPages) {
                list = res.data.content.map((element:any) => {
                  return {
                    avatar: element.employeeAvatar,
                    name: element.employeeName,
                    deptName: element.employeeDeptName,
                    manualSignIn: element.manualSignIn,
                    arrivedScene: element.arrivedScene,
                    latestSignInSite: element.latestSignInSite,
                    signTime: element.latestSignInTime,
                    phoneTurnOnTime: element.phoneOverTime,
                  };
                });
                if (data.method == 'notRead') {
                  if (this.emergencyResponseList.notRead.length < 20) {
                    this.emergencyResponseList.notRead.push(...list);
                  } else {
                    data.modalTableParams = partyListItemQuery;
                    data.isLoading = true;
                  }
                } else if (data.method == 'notSign') {
                  if (this.emergencyResponseList.notSign.length < 20) {
                    this.emergencyResponseList.notSign.push(...list);
                  } else {
                    data.modalTableParams = partyListItemQuery;
                    data.isLoading = true;
                  }
                } else if (data.method == 'notCall') {
                  if (this.emergencyResponseList.notCall.length < 20) {
                    this.emergencyResponseList.notCall.push(...list);
                  } else {
                    data.modalTableParams = partyListItemQuery;
                    data.isLoading = true;
                  }
                } else if (data.method == 'call') {
                  if (this.emergencyResponseList.call.length < 20) {
                    this.emergencyResponseList.call.push(...list);
                  } else {
                    data.modalTableParams = partyListItemQuery;
                    data.isLoading = true;
                  }
                } else if (data.method == 'read') {
                  if (this.emergencyResponseList.read.length < 20) {
                    this.emergencyResponseList.read.push(...list);
                  } else {
                    data.modalTableParams = partyListItemQuery;
                    data.isLoading = true;
                  }
                } else if (data.method == 'sign') {
                  if (this.emergencyResponseList.sign.length < 20) {
                    this.emergencyResponseList.sign.push(...list);
                  } else {
                    data.modalTableParams = partyListItemQuery;
                    data.isLoading = true;
                  }
                }
              } else {
                data.isLoading = true;
              }
            });
          }
        }
      },
      100,
    );
  }

  /* 打开应急指挥记录 */
  openCommandHistory() {
    this.pageChoose = 3;
    this.childrenVisible = true;
    this.drawerWidth = 540;
    this.getCommandLog();
  }

  /* 应急指挥记录查询 */
  getCommandLog() {
    this.http.get(`/service/emergency-event/wxcp/EventApi/findAllCommandMeasureLogList/${this.eventId}`).subscribe((res) => {
      if (res.success) {
        this.commandLog = res.data.map((element:any) => {
          return {
            content: element.value,
            time: element.createdTime,
          };
        });
      }
    });
  }

  /* 打开应急要点审核 */
  openCheck() {
    this.pageChoose = 4;
    this.childrenVisible = true;
    this.drawerWidth = 540;
    console.log(this.selectRole,this.selectPoint);
    this.selectRole = {};
    this.selectPoint = {};
    this.pointRate = 0; // 要点进度
    this.roleRate = 0; // 角色进度
    this.allEmergencyPointData = [];
    this.doneEmergencyPointData = [];
    this.undoneEmergencyPointData = [];
    this.getPointList();
    // 判断用户的岗位信息。
    this.getRoleList();
  }

  pointChoose1() {
    this.isShow = 0;
  }

  pointChoose2() {
    this.isShow = 1;
  }

  pointChoose3() {
    this.isShow = 2;
  }

  /* 刷新数据 */
  refreshData() {
    this.clearData();
    this.editInfo(this.eventId);
  }

  /* 是否显示下载文件对话框 */
  downloadCancel() {
    this.isShowDownload = false;
  }

  /* 下载应急预案 */
  downloadFile(data:any) {
    const url = data.fileUrl;
    const name = data.title;
    this.isShowDownload = true;
    this.fileDownloadUrl = this.downloadUrl + url;
    this.fileName = name;
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    console.log(file);
    this.previewImage = file.url;
    this.previewVisible = true;
  };

  /* 下载附件 */
  downloadAccessory(data:any) {
    const url = data.url;
    const name = data.fileName;
    this.isShowDownload = true;
    this.fileDownloadUrl = this.downloadUrl + url;
    this.fileName = name;
  }

  /* 下载成功回调 */
  downloadOk(event:any) {
    this.isShowDownload = false;
    this.messageService.success('下载成功');
  }

  /* 下载失败回调 */
  downloadFail(event:any) {
    this.isShowDownload = false;
    this.messageService.warning('下载失败');
  }

  openModalTable(data:any, type:any) {
    const i = data;
    let url: string;
    if (type) {
      url = '/service/emergency-event/wxcp/EventApi/getPartyListForItem';
    } else {
      url = '/service/emergency-event/wxcp/EventApi/getPartyListForItemVirtual';
    }
    // this.modal.createStatic(ModalTable, { i, url }).subscribe((value) => {
    // });
  }

  ngAfterViewInit() {
    this.loadLineData();
    this.loadAllArea();
    this.loadEventLevelData('emergencyLevel');
    /* 加载事件类型数据 */
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/${'emergencyCategory'}`).subscribe((res) => {
      if (res.success) {
        this.sfEventData = res.data.map((element:any) => {
          return { label: element.label, value: element.id };
        });
        // @ts-ignore
        this.searchSchema.properties.emergencyEventType.enum = this.sfEventData;
        this.sf.refreshSchema();
      }
    });
  }

  ngOnInit() {
    this.getLocalStorage();
  }
}
