import {Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STComponent, STColumnButton} from '@delon/abc/st';
import {SFComponent, SFSchema, SFTreeSelectWidgetSchema} from '@delon/form';
import {DictionaryService} from '../service/dictionary.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '@env/environment';
import {ModalTable} from '../components/modal-table/modal-table.component';
import {Base} from "../../../api/common/base";
import {FileSaverService} from "ngx-filesaver";

@Component({
  selector: 'app-emergency-dispatch-emergency-history-report',
  templateUrl: './emergency-history-report.component.html',
  styleUrls: ['./emergency-history-report.css'],
})
export class EmergencyDispatchEmergencyHistoryReport extends Base implements OnInit {
  visible: boolean = false;
  showResponseDetail = true;
  isShowReNotice = false;
  isChange=false;
  colorList: any = ['#fff', '#68d6a4', '#32c5ff', '#d69d00'];
  showClassify: any = true;
  url = `/service/emergency-event/admin/AdminEventApi/getEventListQuery`;
  customRequests: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize',
    },
    params: {status: 'finish'},
  };

  selectLineData: any = []; //线路数据
  selectSiteData: any = []; //站点数据
  allAreaData: any = []; //所有区域数据
  eventCategoryData: any = []; //事件大类数据
  eventLevelData: any = []; //事件等级
  eventData: any = []; //事件类型数据
  majorData: any = []; //相关专业数据
  emergencyPlanFile = []; //选中的应急规章制度数据
  eventId: any;
  editEventCategoryData: any; //查看状态下的事件大类数据
  editMajorData: any; //查看状态下的的相关专业数据
  editLevelData: any; //查看状态下的事件等级数据
  editEventData: any; //查看状态下的事件类型数据
  childrenVisible: boolean = false; // 控制事件相关人员重新通知页面显示
  bigCategoryName = '';
  submitEventVO: any = {};
  basicInfo: any = {};
  fullViewQuery: any = {}; //查询应急全貌
  responseList: any = {}; //响应情况列表
  thirdId: any;
  getPartyList: any = {};
  siteNameTag: any = []; //地点标签数据
  emergencyReleaseVO: any = {};
  sfEventData: any = []; //表单事件类型数据
  refreshSf = true;
  eventListQuery: any = {
    elementIds: [],
  };
  sfLineIds: any = [];
  sfCategoryIds: any = [];
  sfLevelIds: any = [];

  pointList: any = []; // 应急要点列表
  roleList: any = []; // 要点角色列表
  selectPoint: any = {};
  selectRole: any = {};
  // 应急要点审核要点数据
  allEmergencyPointData: any = [];
  doneEmergencyPointData: any = [];
  undoneEmergencyPointData: any = [];
  pointRate = 0; // 要点进度
  roleRate = 0; // 角色进度
  pointId: any;
  emergencyPointRoleId: any;

  // 应急响应情况饼状图数据
  responseData: any = [];
  navchoose = 0;
  goodsTransportList: any; // 物资运输情况列表
  tagNum: any; // 应急物资的tag明细

  // 最新处置措施列表组件数据
  itemDetail: any = [];

  // 事件变更历史
  drawerWidth = 660; // 子抽屉页面宽度
  pageChoose = 0;
  eventChangeLog: any = []; // 事件变更日志数据

  // 应急全貌列表数据
  emergencyItemList: any = [];

  // 设备抢修负责人/现场指挥组件人员信息
  personnelInfoData: any = {};
  listIndex = 0;
  fileDownloadUrl: any;
  isShowDownload = false;
  fileName: any;
  downloadUrl = "";
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
  isOnlyMessagePush = false;
  cilckNumber: any;

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
  responseData2: any = []; // 应急响应情况饼状图数据
  childCilckNumber: any;
  modalTableParams = {};
  emergencyListIndex = 0;
  colorList2: any = ['#fff', '#68d6a4', '#32c5ff', '#d69d00'];
  postCfg = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  };
  emergencyResponseList: any = {}; // 应急全貌中的响应情况列表

  @ViewChild('sf', {static: false}) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      eventNameNo: {
        type: 'string',
        title: '事件名称',
        ui: {
          placeholder: '请输入',
          width: 270,
          change: (ngModel: any) => {
            this.eventListQuery.eventName = ngModel;
          },
        },
      },
      emergencyEventLevel: {
        type: 'string',
        title: '事件等级',
        ui: {
          widget: 'select',
          mode: 'tags',
          width: 300,
          allowClear: true,
          dropdownStyle: {'max-height': '500px'},
          placeholder: '请选择',
          showArrow: true,
          change: (ngModel: any) => {
            this.sfLevelIds = [];
            ngModel.forEach((element: any) => {
              this.sfLevelIds.push(element);
            });
          },
        } as SFTreeSelectWidgetSchema,
      },
      status: {
        type: 'boolean',
        title: '区域应急',
        ui: {
          change: (ngModel: any) => {
          },
        },
      },
      emergencyEventType: {
        type: 'string',
        title: '事件类别',
        ui: {
          widget: 'select',
          mode: 'tags',
          width: 300,
          showArrow: true,
          allowClear: true,
          placeholder: '请选择',
          dropdownStyle: {'max-height': '500px'},
          change: (ngModel: any) => {
            this.sfCategoryIds = [];
            ngModel.forEach((element: any) => {
              this.sfCategoryIds.push(element);
            });
          },
        } as SFTreeSelectWidgetSchema,
      },
    },
  };

  @ViewChild('st', {static: false}) st!: STComponent;
  columns: STColumn[] = [
    {title: '编号', index: 'planName', type: 'checkbox'},
    {title: '事件名称', width: 220, index: 'eventName'},
    {title: '发起时间', width: 220, type: 'date', index: 'createdTime'},
    {title: '发起人', width: 220, index: 'submitEmployeeName'},
    {
      title: '应急地点',
      width: 116,
      format: function (content) {
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
        if (content.levelName.length) {
          return content.levelName;
        } else {
          return '-';
        }
      },
    },
    {title: '事件描述以及概况', index: 'overviewAndRequirements'},
    {title: '关闭事件时间', index: 'closeTime'},
    {title: '处理结果', index: 'closeResult'},
    {title: '关闭时参与部门数量', index: 'closePartyInOrganizationSize'},
    {title: '关闭时参与人员数量', index: 'closePartyInEmployeeSize'},
    {title: '关闭时的处理时长', index: 'closeProcessingTime'},
    {
      title: '操作',
      width: 87,
      buttons: [
        {
          text: '详情',
          type: 'link',
          click: (record) => {
            this.eventId = record.id;
            this.fullViewQuery.eventId = record.id;
            this.getPartyList.eventId = record.id;
            this.getPartyList.employeeId = this.thirdId;
            this.emergencyReleaseVO.eventId = record.id;
            this.emergencyReleaseVO.submitThirdId = this.thirdId;
            this.personnelInfoData.noEdit = true;
            this.refreshSf = false;
            this.visible = true;
            if (record.siteName != null) {
              this.siteNameTag = record.siteName.split(/[,]/);
            } else {
              this.siteNameTag = [];
            }
            this.isOnlyMessagePush = record.onlyPushMessage;
            record.onlyPushMessage ? this.clickChart(1) : this.clickChart(0);
            this.editInfo(record.id);
          },
        },
      ],
      fixed: 'right',
    },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private dictionaryService: DictionaryService,
    private fileSaverService: FileSaverService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private messageService: NzMessageService,
  ) {
    super();
  }

  editInfo(id: any) {
    const postCfg = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    };
    /* 加载基础信息*/
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEvent/${id}`).subscribe((res) => {
      if (res.success) {
        this.basicInfo.emergencyTitle = res.data.eventName;
        this.basicInfo.submitEmployeeName = res.data.submitEmployeeName;
        this.basicInfo.eventTime = res.data.eventTime;
        this.basicInfo.requirments = res.data.overviewAndRequirements;
      }
    });

    /* 加载事件类型等级*/
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEventElementInfo/${id}`).subscribe((res) => {
      if (res.success) {
        let lineId = [];
        let siteId = [];
        let categoryId: any = [];
        let bigCategoryId: any = [];
        let professionId: any = [];
        let areaId = [];
        let levelId: any = [];
        res.data.forEach((element: any) => {
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
          }
        });

        /* 等级回调函数 */
        function levelCheck(value: any) {
          if (levelId.length != 0) {
            levelId.forEach((element: any) => {
              value.forEach((item: any) => {
                if (item.value == element) {
                  item.checked = true;
                }
              });
            });
          }
        }

        /* 事件大类回调函数 */
        function categoryCheck(value: any) {
          if (bigCategoryId.length != 0) {
            bigCategoryId.forEach((element: any) => {
              value.forEach((item: any) => {
                if (item.value == element) {
                  item.checked = true;
                }
              });
            });
          }
        }

        /* 事件类型回调函数 */
        function eventCheck(value: any) {
          if (categoryId.length != 0) {
            categoryId.forEach((element: any) => {
              value.forEach((item: any) => {
                if (item.value == element) {
                  item.checked = true;
                }
              });
            });
          }
        }

        /* 相关专业回调函数 */
        function majorCheck(value: any) {
          if (professionId.length != 0) {
            professionId.forEach((element: any) => {
              value.forEach((item: any) => {
                if (item.value == element) {
                  item.checked = true;
                }
              });
            });
          }
        }

        this.loadEventCategoryData('emergencyBigCategory', categoryCheck);
        this.loadEventLevelData('emergencyLevel', levelCheck);
        bigCategoryId.forEach((value: any) => {
          this.eventData = [];
          this.majorData = [];
          let name = this.eventCategoryData.filter((item: any) => item.value == value).map((item: any) => item.label);
          if (name == '综合类应急处置') {
            this.loadEventlData(value, eventCheck);
          } else if (name == '专业类故障处理') {
            this.loadMajorData(value, majorCheck);
          }
        });
      }
    });

    /* 加载应急预案 */
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEmergencyPlanList/${id}`).subscribe((res) => {
      if (res.success) {
        this.submitEventVO.eventPlanVOS = res.data.map((element: any) => {
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
        this.submitEventVO.eventAttachmentFiles = res.data.map((element: any) => {
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
        let call = [0, 0];
        let read = [0, 0];
        let sign = [0, 0];
        res.data.forEach((element: any) => {
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
          {chartPieData: call, title: '电话通知情况'},
          {chartPieData: read, title: '消息阅读情况'},
          {chartPieData: sign, title: '人员签到情况'},
        ];
        this.getPreparationsTabNumber();
        this.navChoose(0);
        this.emergencyItemList = res.data.map((item: any) => {
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
    this.http.post(`/service/emergency-event/wxcp/EventApi/getPartyList`, '', this.getPartyList, postCfg).subscribe((res) => {
      if (res.success) {
        this.responseList.callNumber = res.data.call.length;
        this.responseList.notCallNumber = res.data.notCall.length;
        this.responseList.readNumber = res.data.read.length;
        this.responseList.notReadNumber = res.data.notRead.length;
        this.responseList.call = res.data.call.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            phoneTurnOnTime: element.phoneTurnOnTime,
            phoneOverTime: element.phoneOverTime,
            callTime: element.callDuration,
          };
        });
        this.responseList.notCall = res.data.notCall.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            phoneTurnOnTime: element.phoneOverTime,
          };
        });
        this.responseList.read = res.data.read.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.responseList.notRead = res.data.notRead.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.responseList.notSign = res.data.notSign.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.responseList.sign = res.data.sign.map((element: any) => {
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
      if (res.success) {
        if (res.data != null) {
          this.personnelInfoData.name = res.data.commandName;
          this.personnelInfoData.img = res.data.commandAvatar;
          this.personnelInfoData.detail = res.data.value;
        } else {
          this.personnelInfoData = {
            noEdit: true,
          };
        }
      }
    });

    /* 加载最新处置措施 */
    this.http.get(`/service/emergency-measures/measure/find/measureByEventId/${id}`).subscribe((res) => {
      if (res.success) {
        this.itemDetail = res.data.map((element: any) => {
          return {
            createdDate: element.createdDate,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            description: element.description,
            resources: element.resources.split(','),
            noEdit: true,
          };
        });
      }
    });

    /* 加载应急发布 */
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEmergencyRelease/${id}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.emergencyReleaseVO.emergencyReleaseValue = res.data.emergencyRelease;
      }
    });
  }

  /* 加载所有线路数据 */
  /* loadLineData() {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/findAllLine`).subscribe((res) => {
      if (res.success) {
        this.selectLineData = res.data.map((element:any) => {
          return { title: element.name, key: element.id };
        });
        this.searchSchema.properties.emergencySite.enum = this.selectLineData;
        for (let i = 0; i < this.selectLineData.length; i++) {
          this.loadSiteData(this.selectLineData[i].key, i);
        }
        this.sf.refreshSchema();
      }
    });
  } */

  /* 根据线路ID获取相应的站点信息 */
  /* loadSiteData(lineId, index) {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/getAllStationsByLineIds/${lineId}`).subscribe((res) => {
      if (res.success) {
        this.selectSiteData = res.data.map((element:any) => {
          return { title: element.name, key: element.id, isLeaf: true };
        });
        this.selectLineData[index].children = this.selectSiteData;
        this.sf.refreshSchema();
      }
    });
  } */

  /* 加载应急区域数据 */
  loadAllArea() {
    this.http.get(`/service/emergency-base-config/admin/adminAreaApi/findAllArea`).subscribe((res) => {
      if (res.success) {
        this.allAreaData = res.data.map((element: any) => {
          return {title: element.name, key: element.id, isLeaf: true};
        });
      }
    });
  }

  /**
   * 加载事件大类
   */
  loadEventCategoryData(category: any, check?: any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/` + category).subscribe((res) => {
      this.eventCategoryData = res.data.map((element: any) => {
        return {label: element.label, value: element.id};
      });
      if (typeof check == 'function') {
        check(this.eventCategoryData);
      }
      this.getBigCategoryName();
    });
  }

  /**
   * 加载所有事件等级
   */
  loadEventLevelData(category: any, check?: any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/` + category).subscribe((res) => {
      this.eventLevelData = res.data.map((element: any) => {
        return {label: element.label, value: element.id};
      });
      // @ts-ignore
      this.searchSchema.properties.emergencyEventLevel.enum = this.eventLevelData;
      if (typeof check == 'function') {
        check(this.eventLevelData);
        this.editLevelData = this.eventLevelData.filter((item: any) => item.checked).map((item: any) => item.label);
      }
      if (this.refreshSf) {
        this.sf.refreshSchema();
      }
    });
  }

  /* 加载事件类型数据 */
  loadEventlData(value: any, check?: any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByParentId/${value}`).subscribe((res) => {
      if (res.success) {
        this.eventData = res.data.map((element: any) => {
          return {label: element.label, value: element.id};
        });
      }
      if (typeof check == 'function') {
        check(this.eventData);
        this.editEventData = this.eventData.filter((item: any) => item.checked);
      }
    });
  }

  /* 加载相关专业数据 */
  loadMajorData(value: any, check?: any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByParentId/${value}`).subscribe((res) => {
      if (res.success) {
        this.majorData = res.data.map((element: any) => {
          return {label: element.label, value: element.id};
        });
      }
      if (typeof check == 'function') {
        check(this.majorData);
        this.editMajorData = this.majorData.filter((item: any) => item.checked);
      }
    });
  }

  getBigCategoryName() {
    let name = [];
    name = this.eventCategoryData.filter((item: any) => item.checked).map((item: any) => item.label);
    this.editEventCategoryData = name.toString();
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

  /* 清除数据 */
  clearData() {
    this.basicInfo = {};
    this.siteNameTag = [];
    this.eventData = [];
    this.majorData = [];
    this.editMajorData = [];
    this.editEventData = [];
    this.editLevelData = [];
    this.editEventCategoryData = '';
    this.submitEventVO = {};
    this.refreshSf = false;
    this.emergencyReleaseVO = {}; //应急发布
    this.responseList = {}; //响应情况列表
    this.responseData = []; //应急响应情况饼状图数据
    this.itemDetail = []; //最新处置措施列表组件数据
    this.emergencyItemList = []; //应急全貌列表数据
    this.personnelInfoData = {}; //设备抢修负责人/现场指挥组件人员信息
    this.notReadData.page = 0;
    this.notSignData.page = 0;
    this.notCallData.page = 0;
    this.readData.page = 0;
    this.signData.page = 0;
    this.callData.page = 0;
    this.notReadData.isLoading = false;
    this.notSignData.isLoading = false;
    this.notCallData.isLoading = false;
    this.readData.isLoading = false;
    this.signData.isLoading = false;
    this.callData.isLoading = false;
    this.pointList = []; // 应急要点列表
    this.roleList = []; // 要点角色列表
    this.allEmergencyPointData = [];
    this.doneEmergencyPointData = [];
    this.undoneEmergencyPointData = [];
    this.selectPoint = {};
    this.selectRole = {};
    this.pointRate = 0;
    this.roleRate = 0;
    this.loadEventCategoryData('emergencyBigCategory');
    this.loadEventLevelData('emergencyLevel');
  }

  /* 表单重置 */
  resetSearch(e: any) {
    const extraParams = {status: 'finish'};
    this.st.reset(extraParams);
    this.eventListQuery = {
      elementIds: [],
    };
    this.sfCategoryIds = [];
    this.sfLevelIds = [];
    this.sf.reset(true);
  }

  exportExcel() {
    const objString = JSON.stringify(this.eventListQuery);
    const exportQuery = JSON.parse(objString);
    exportQuery.status = 'finish';
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
            this.fileSaverService.save(res.body, '应急事件历史报表.xls');
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
    // @ts-ignore
    const status = this.sf.getProperty('/status')._value;
    if (status) {
      this.eventListQuery.areaEmergency = true;
    } else {
      this.eventListQuery.areaEmergency = false;
    }
    /* 判断搜索条件是否为空 */
    this.eventListQuery.status = 'finish';
    this.eventListQuery.elementIds = [...this.sfCategoryIds, ...this.sfLevelIds];
    if (Object.keys(this.eventListQuery).length > 2 || this.eventListQuery.elementIds.length != 0) {
      this.st.load(1, this.eventListQuery);
    }
  }

  close(): void {
    this.visible = false;
    this.clearData();
  }

  categoryStatus(showClassify: boolean) {
    this.showClassify = showClassify;
  }

  getLocalStorage() {
    let value = JSON.parse(<string>window.localStorage.getItem('employee'));
    this.fullViewQuery.avatar = value.avatar;
    this.fullViewQuery.name = value.employeeName;
    this.fullViewQuery.thirdId = value.thirdPartyAccountUserId;
    this.thirdId = value.thirdPartyAccountUserId;
  }

  /* 是否显示下载文件对话框 */
  downloadCancel() {
    this.isShowDownload = false;
  }

  /* 下载应急预案 */
  downloadFile(data: any) {
    const url = data.fileUrl;
    const name = data.title;
    this.isShowDownload = true;
    this.fileDownloadUrl = this.downloadUrl + url;
    this.fileName = name;
  }

  /* 下载附件 */
  downloadAccessory(data: any) {
    console.log(data);
    const url = data.url;
    const name = data.fileName;
    this.isShowDownload = true;
    this.fileDownloadUrl = this.downloadUrl + url;
    this.fileName = name;
  }

  /* 下载成功回调 */
  downloadOk(event: any) {
    this.isShowDownload = false;
    this.messageService.success('下载成功');
  }

  /* 下载失败回调 */
  downloadFail(event: any) {
    this.isShowDownload = false;
    this.messageService.warning('下载失败');
  }

  /* 下拉加载数据 */
  loadList(data: any) {
    setTimeout(() => {
        const scrollDom: any = document.getElementById(data.scrollDom);
        const listDom: any = document.getElementById(data.dom);
        const partyListItemQuery: any = {
          employeeId: this.thirdId,
          eventId: this.eventId,
          method: data.method,
          pageSize: 5,
        };
        let list = [];
        scrollDom.onscroll = () => {
          if (Math.floor(listDom.offsetHeight - scrollDom.scrollTop) == scrollDom.clientHeight && !data.isLoading) {
            data.page++;
            partyListItemQuery.page = data.page;
            this.http.post(`/service/emergency-event/wxcp/EventApi/getPartyListForItem`, partyListItemQuery).subscribe((res) => {
              if (res.success && data.page <= res.data.totalPages) {
                list = res.data.content.map((element: any) => {
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

  /* 查看应急全貌详情 */
  openEmengencyItem(i: any) {
    this.pageChoose = 2;
    this.childrenVisible = true;
    this.drawerWidth = 660;
    this.getEmergencyItemDetail(i);
    this.getEmergencyList(i);
    this.isOnlyMessagePush ? this.emergencyClickChart(1) : this.emergencyClickChart(0);
  }

  /* 获取子抽屉应急全貌详情 */
  getEmergencyItemDetail(i: any) {
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
          {chartPieData: call, title: '电话通知情况'},
          {chartPieData: read, title: '消息阅读情况'},
          {chartPieData: sign, title: '人员签到情况'},
          // { chartPieData: [3, 15], title: '物资运输情况' },
        ];
      }
    });
  }

  /* 获取子抽屉应急响应情况列表 */
  getEmergencyList(i: any) {
    const id = this.emergencyItemList[i].id;
    const getPartyList2 = this.getPartyList;
    getPartyList2.virtualId = id;
    this.http.post(`/service/emergency-event/wxcp/EventApi/getPartyListVirtual`, '', getPartyList2, this.postCfg).subscribe((res) => {
      if (res.success) {
        this.emergencyResponseList.callNumber = res.data.call.length;
        this.emergencyResponseList.notCallNumber = res.data.notCall.length;
        this.emergencyResponseList.readNumber = res.data.read.length;
        this.emergencyResponseList.notReadNumber = res.data.notRead.length;
        this.emergencyResponseList.signNumber = res.data.sign.length;
        this.emergencyResponseList.notSignNumber = res.data.notSign.length;
        this.emergencyResponseList.call = res.data.call.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            phoneTurnOnTime: element.phoneTurnOnTime,
            phoneOverTime: element.phoneOverTime,
            callTime: element.callDuration,
          };
        });
        this.emergencyResponseList.notCall = res.data.notCall.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
            phoneTurnOnTime: element.phoneOverTime,
          };
        });
        this.emergencyResponseList.read = res.data.read.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.emergencyResponseList.notRead = res.data.notRead.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.emergencyResponseList.notSign = res.data.notSign.map((element: any) => {
          return {
            avatar: element.employeeAvatar,
            name: element.employeeName,
            deptName: element.employeeDeptName,
          };
        });
        this.emergencyResponseList.sign = res.data.sign.map((element: any) => {
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
  loadChildList(data: any, id: any) {
    setTimeout(() => {
        const scrollDom: any = document.getElementById(data.scrollDom);
        const listDom: any = document.getElementById(data.dom);
        const partyListItemQuery: any = {
          employeeId: this.thirdId,
          eventId: this.eventId,
          method: data.method,
          pageSize: 5,
          virtualId: id,
        };
        let list = [];
        scrollDom.scrollTop = 0;
        scrollDom.onscroll = () => {
          if (Math.floor(listDom.offsetHeight - scrollDom.scrollTop) == scrollDom.clientHeight && !data.isLoading) {
            data.page++;
            partyListItemQuery.page = data.page;
            this.http.post(`/service/emergency-event/wxcp/EventApi/getPartyListForItemVirtual`, partyListItemQuery).subscribe((res) => {
              if (res.success && data.page <= res.data.totalPages) {
                list = res.data.content.map((element: any) => {
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
      eventId: this.eventId,
      status: item + 1
    }
    this.http.post(`/service/supplies-system/admin/SuppliesPreparationsWxcpApi/getSubmitSuppliesPreparationsList`, postData).subscribe(res => {
      console.log(res.data);
      this.goodsTransportList = res.data;
      for (let i = 0; i < this.goodsTransportList.length; i++) {
        const item = this.goodsTransportList[i].suppliesOutOrders;
        const sourceWareHouseId = this.goodsTransportList[i].suppliesOutOrders[0].sourceSuppliesWarehouse.id;
        for (let j = 0; i < this.goodsTransportList[i].suppliesWarehouseKeeperVOS.length; j++) {
          const ele = this.goodsTransportList[i].suppliesWarehouseKeeperVOS[j];
          if (ele.suppliesWarehouseId == sourceWareHouseId) {
            this.goodsTransportList[i].sourceEmployeeName = ele.employeeName;
            this.goodsTransportList[i].sourceEmployeeAvatar = ele.avatar;
            break;
          }
        }
        this.goodsTransportList[i].latestSignInSite = this.goodsTransportList[i].suppliesWarehouseKeeperVOS[0].latestSignInSite;
        this.goodsTransportList[i].goodsName = "";
        this.goodsTransportList[i].goodsNumber = "";
        for (let j = 0; j < item.length; j++) {
          if (j == 0) {
            this.goodsTransportList[i].goodsName += item[j].supplies.matName;
            this.goodsTransportList[i].goodsNumber = item[j].matCount + item[j].supplies.matUnit;
          } else {
            this.goodsTransportList[i].goodsName += ";" + item[j].supplies.matName;
            this.goodsTransportList[i].goodsNumber = ";" + item[j].matCount + item[j].supplies.matUnit;
          }
        }
      }
    })
  }

  getPreparationsTabNumber() {
    this.http.get('/service/supplies-system/admin/SuppliesPreparationsWxcpApi/getPreparationsTabNumber/' + this.eventId).subscribe(res => {
      this.tagNum = res.data;
      console.log(this.tagNum);
      const all = this.tagNum.preparation + this.tagNum.transport + this.tagNum.user;
      this.responseData.push({chartPieData: [this.tagNum.user, all], title: '物资运输情况'});
      console.log(this.responseData)
    })

  }

  /* 重新拨打电话 */
  recall() {
    this.http.get(`/service/emergency-event/wxcp/EventApi/callingAgain/${this.eventId}`).subscribe((res) => {
      if (res.success) {
        this.messageService.success('提示：重新拨打成功');
      }
    });
  }

  closeChildren() {
    this.childrenVisible = false;
  }

  openModalTable(data: any, type: any) {
    let i = data;
    let url: string;
    if (type) {
      url = '/service/emergency-event/wxcp/EventApi/getPartyListForItem';
    } else {
      url = '/service/emergency-event/wxcp/EventApi/getPartyListForItemVirtual';
    }
    this.modal.createStatic(ModalTable, {i: i, url: url}).subscribe((value) => {
    });
  }

  /* 打开应急要点审核 */
  openCheck() {
    this.pageChoose = 3;
    this.childrenVisible = true;
    this.drawerWidth = 540;
    this.getPointList();
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
  choosePoint(value: any) {
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
  getAllRolePoint(id: any) {
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/get/emergencyPointItemListByPointId/${id}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.allEmergencyPointData = res.data.map((element: any) => {
          return {
            content: element.content,
            materialReference: element.materialReference,
            status: element.status,
            hidden: false,
            isPublish: false,
            id: element.id,
          };
        });
        this.allEmergencyPointData.forEach((element: any, index: any) => {
          this.getPointReportList(element.id, index);
        });
      }
    });
  }

  /* 获取要点详情、角色列表 */
  getEmergencyPointDetail(id: any) {
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/get/emergencyPointDetail/${id}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.pointRate = parseInt(res.data.rate);
        this.roleList = res.data.pointRoleVOList.map((element: any) => {
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
  chooseRole(item: any) {
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
  getPointDetail(id: any) {
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/get/emergencyPointItemList/${id}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.allEmergencyPointData = res.data.map((element: any) => {
          return {
            content: element.content,
            materialReference: element.materialReference,
            status: element.status,
            hidden: false,
            isPublish: false,
            id: element.id,
          };
        });
        this.allEmergencyPointData.forEach((element: any, index: any) => {
          this.getPointReportList(element.id, index);
        });
      }
    });
  }

  /* 获取回复列表 */
  getPointReportList(id: any, i: any) {
    let undone: any;
    let done: any;
    const reportIds: any = [];
    const newReportIds = [];
    const obj: any = {};
    this.http.get(`/service/emergency-event/wxcp/EmergencyPointApi/get/findAllReportEmployeeByPointItemId/${id}`).subscribe((res) => {
      if (res.success && res.data.length > 0) {
        this.allEmergencyPointData[i].reportItem = res.data.map((element: any) => {
          return {
            deptName: element.deptName,
            reportEmployeeList: element.reportEmployeeList.map((item: any) => {
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
        this.allEmergencyPointData[i].reportItem.forEach((item: any) => {
          item.reportEmployeeList.forEach((list: any) => {
            if (list.resources) {
              list.resources = list.resources.split(',');
            } else {
              list.resources = [];
            }
          });
        });
        this.allEmergencyPointData[i].reportItem.forEach((element: any) => {
          element.reportEmployeeList.forEach((item: any) => {
            reportIds.push(item.employeeId);
          });
        });
      }
      /* 对回复人员id去重 */
      reportIds.forEach((element: any, index: any) => {
        if (!obj[element]) {
          newReportIds.push(reportIds[index]);
          obj[element] = 1;
        }
      });
      this.allEmergencyPointData[i].reportNumber = newReportIds.length;
      undone = JSON.stringify(this.allEmergencyPointData.filter((item: any) => item.status == -1 || item.status == 0));
      done = JSON.stringify(this.allEmergencyPointData.filter((item: any) => item.status == 1));
      this.doneEmergencyPointData = JSON.parse(done);
      this.undoneEmergencyPointData = JSON.parse(undone);
    });
  }

  ngAfterViewInit() {
    // this.loadLineData();
    this.loadAllArea();
    this.loadEventCategoryData('emergencyBigCategory');
    this.loadEventLevelData('emergencyLevel');
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/${'emergencyCategory'}`).subscribe((res) => {
      if (res.success) {
        this.sfEventData = res.data.map((element: any) => {
          return {label: element.label, value: element.id};
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
