import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STColumnButton } from '@delon/abc/st';
import { SFComponent, SFSchema, SFTreeSelectWidgetSchema, SFDateWidgetSchema, SFSelectWidgetSchema, SFTextWidgetSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmergencyDispatchEmergencyExerciseEditComponent } from './edit/edit.component';
import { environment } from '@env/environment';
import { dateTimePickerUtil } from '@delon/util';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzSafeNullPipe } from 'ng-zorro-antd/pipes';
import {Base} from "../../../common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-exercise',
  templateUrl: './emergency-exercise.component.html',
  styleUrls: ['./emergency-exercise.css'],
})
export class EmergencyDispatchEmergencyExercise extends Base implements OnInit {
  url = `/service/emergency-drill/wxcp/DrillApi/getDrillList`;
  childrenUrl = `/service/emergency-base-config/admin/adminEmergencyPlanFileApi/findForPage`;
  visible: boolean = false;
  childrenVisible: boolean = false; //子抽屉
  isEdit = false; //是否编辑
  dismissed = false;
  newReport = false;
  title = ['新建演练计划申报', '编辑演练计划申报', '驳回详情'];
  titleIndex = 0;
  selectLineData:any = []; //线路数据
  selectSiteData:any = []; //站点数据
  drawerLineData:any = []; //抽屉页面站点数据
  drawerSiteData:any = []; //抽屉页面站点数据
  statusData = [
    { label: '审批中', value: 'ongoing' },
    { label: '已通过', value: 'pass' },
    { label: '未通过', value: 'notpass' },
    { label: '废弃', value: 'abandon' },
    { label: '未开始', value: 'unstart' },
    { label: '开始', value: 'start' },
    { label: '结束', value: 'finish' },
  ];
  allAreaData :any=[]; //所有区域数据
  eventCategoryData :any=[]; //事件大类数据
  eventLevelData :any=[]; //事件等级
  eventData :any=[]; //事件类型数据
  commandPeople :any=[]; //指挥人员数据
  approver :any=[]; //审批人
  tagAndPeopleQuery: any = {
    areaIds: [],
    dictionaryIds: [], //大类数据
    employeeId: '',
    eventLevelIds: [],
    eventTypeIds: [],
    lineIds: [],
    specialtyIds: [],
    stationIds: [],
  }; //查询标签人员数据
  emergencyUser :any=[];
  submitUserData: any = {};
  emergencyPlanFile :any=[]; //选中的应急规章制度数据

  //发起应急演练事件
  submitEventVO: any = {
    approvalEmployeeId: '',
    approvalEmployeeName: '',
    drillName: '',
    isAreaEmergency: false,
    areaIds: [],
    areaName: '',
    categoryId: '',
    commandUser: {},
    emergencyCategoryId: '',
    emergencyProfessionId: '',
    eventAttachmentFiles: [],
    eventLevelId: '',
    eventPlanVOS: [],
    eventTime: '',
    purpose: '',
    fullPushStatus: true,
    lineIds: [],
    openTheTrajectory: true,
    overviewAndRequirements: '',
    queryTagMethod: 0,
    siteName: '',
    stationIds: [],
    submitAvatar: '',
    submitCorpId: '',
    submitMobilePhone: '',
    submitName: '',
    submitThirdId: '',
    tagVOS: [],
    temCallThirdUsers: [],
  };

  submitTime: any;
  fileList: NzUploadFile[] = []; //上传文件列表
  uploading = false;

  changeElementsVO: any = {}; //修改事件描述
  changeEventPlanVO: any = {}; //修改应急预案
  changeEventAttachmentFileVO: any = {}; //修改应急附件
  changeTemCallVO: any = {}; //修改电话人员
  changeEventCommandVO: any = {}; //修改指挥人员
  changeBigCategory: any = {}; //修改事件大类
  changeCategory: any = {}; //修改事件类型
  changeLevel: any = {}; //修改事件等级
  changeApproval: any = {}; //修改审批人
  drillId: any;
  //查询应急演练列表
  drillListQuery: any = {};
  thirdId: any;
  originData: any = {}; //选择的线路站点区域数据
  allChecked: any = {}; //选择的所有应急规章制度数据

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {
    super();
  }

  @ViewChild('sf1', { static: false })
  public sf1!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      projectName: {
        type: 'string',
        title: '计划名称',
        ui: {
          placeholder: '请输入',
          change: (ngModel:any) => {
            this.drillListQuery.content = ngModel;
          },
        },
      },
      site: {
        type: 'string',
        title: '站点',
        enum: this.selectLineData,
        ui: {
          widget: 'tree-select',
          multiple: true,
          placeholder: '请选择',
          change: (ngModel:any) => {
            let names :any=[];
            let stations :any=[];
            let siteName :any=[];
            for (let i = 0; i < ngModel.length; i++) {
              /* 获取所有选择的线路名称 */
              let lineName = this.drawerLineData.filter((item:any) => item.key == ngModel[i]).map((item:any) => item.title);
              if (lineName.length != 0) {
                names.push(lineName.toString());
              }

              /* 获取所有选择的站点信息 */
              this.selectLineData.forEach((value:any) => {
                let station = value.children.filter((item:any) => {
                  return item.key == ngModel[i];
                });
                if (station.length != 0) {
                  stations.push(station[0]);
                }
              });
            }
            siteName = stations.map((item:any) => item.title);
            siteName.forEach((value:any) => names.push(value));
            this.drillListQuery.siteName = names.toString();
            console.log(this.drillListQuery);
          },
          width: 358,
          allowClear: true,
          dropdownStyle: { 'max-height': '500px' },
        } as SFSelectWidgetSchema,
      },
      status: {
        type: 'string',
        title: '状态',
        enum: this.statusData,
        ui: {
          widget: 'select',
          allowClear: true,
          width: 270,
          placeholder: '请选择',
          change: (ngModel:any) => {
            this.drillListQuery.status = ngModel;
          },
          dropdownStyle: { 'max-height': '200px' },
        } as SFTreeSelectWidgetSchema,
      },

      projectUserName: {
        type: 'string',
        title: '上传人',
        ui: {
          placeholder: '请输入',
          change: (ngModel:any) => {
            this.drillListQuery.submitEmployeeName = ngModel;
          },
        },
      },
      date: {
        type: 'string',
        title: '上传时间',
        ui: {
          widget: 'date',
          mode: 'range',
          change: (ngModel:any) => {
            // @ts-ignore
            if (ngModel.length != 0) {
              let beginTime = dateTimePickerUtil.format(ngModel[0], 'yyyy-MM-dd HH:mm:ss');
              let endTime = dateTimePickerUtil.format(ngModel[1], 'yyyy-MM-dd HH:mm:ss');
              this.drillListQuery.beginTime = beginTime;
              this.drillListQuery.endTime = endTime;
            } else {
              this.drillListQuery.beginTime = '';
              this.drillListQuery.endTime = '';
            }
          },
        } as SFDateWidgetSchema,
      },
      area: {
        type: 'string',
        title: '区域',
        enum: this.allAreaData,
        ui: {
          widget: 'tree-select',
          multiple: true,
          allowClear: true,
          width: 270,
          placeholder: '请选择',
          change: (ngModel:any) => {
            let areaName :any=[];
            for (let i = 0; i < ngModel.length; i++) {
              let value = this.allAreaData.filter((item:any) => item.key == ngModel[i]).map((item:any) => item.title);
              areaName.push(value.toString());
            }
            this.drillListQuery.areaName = areaName.toString();
          },
          dropdownStyle: { 'max-height': '200px' },
        } as SFTreeSelectWidgetSchema,
      },
    },
  };

  @ViewChild('sf3', { static: false })
  public sf3!: SFComponent;
  drawerSearchSchema: SFSchema = {
    properties: {
      planName: {
        type: 'string',
        title: '计划名称',
        ui: {
          placeholder: '请输入',
          change: (ngModel:any) => {
            this.submitEventVO.drillName = ngModel;
          },
          blur: () => {
            if (this.isEdit) {
              if (this.submitEventVO.drillName != this.basicInformation.drillName) {
                this.changeElementsVO.eventId = this.drillId;
                this.changeElementsVO.planName = this.submitEventVO.drillName;
              } else {
                delete this.changeElementsVO.planName;
              }
            }
          },
        },
      },
      site: {
        type: 'string',
        title: '站点',
        enum: this.drawerLineData,
        ui: {
          widget: 'tree-select',
          placeholder: '请选择',
          multiple: true,
          change: (ngModel:any) => {
            let lineIds :any=[];
            let stations :any=[];
            let stationIds :any=[];
            let siteName :any=[];
            let names :any=[];
            if (ngModel.length == 0) {
              this.originData.lineIds = [];
            }
            for (let i = 0; i < ngModel.length; i++) {
              /* 获取所有选择的线路id */
              let lineId = this.drawerLineData.filter((item:any) => item.key == ngModel[i]).map((item:any) => item.key);
              let lineName = this.drawerLineData.filter((item:any) => item.key == ngModel[i]).map((item:any) => item.title);
              if (lineId.length != 0) {
                lineIds.push(lineId.toString());
                names.push(lineName.toString());
                this.originData.lineIds = lineIds;
              } else {
                this.originData.lineIds = lineIds;
              }
              /* 获取所有选择的站点信息 */
              this.drawerLineData.forEach((value:any) => {
                let station = value.children.filter((item:any) => {
                  return item.key == ngModel[i];
                });
                if (station.length != 0) {
                  stations.push(station[0]);
                }
              });
            }
            stationIds = stations.map((item:any) => item.key);
            siteName = stations.map((item:any) => item.title);
            siteName.forEach((value:any) => names.push(value));
            this.originData.stationIds = stationIds;
            this.originData.siteName = names.toString();
          },
          width: 358,
          allowClear: true,
          dropdownStyle: { 'max-height': '500px' },
        },
      },
      area: {
        type: 'string',
        title: '区域',
        enum: this.allAreaData,
        readOnly: true,
        ui: {
          widget: 'tree-select',
          placeholder: '请选择',
          allowClear: true,
          multiple: true,
          width: 270,
          change: (ngModel:any) => {
            this.originData.areaIds = ngModel;
            let areaName :any=[];
            for (let i = 0; i < ngModel.length; i++) {
              let value = this.allAreaData.filter((item:any) => item.key == ngModel[i]).map((item:any) => item.title);
              areaName.push(value.toString());
            }
            this.originData.areaName = areaName.toString();
          },
        },
      },
      startTime: {
        type: 'string',
        title: '演练计划开始时间',
        format: 'date-time',
        ui: {
          widget: 'date',
          change: (ngModel:any) => {
            if (ngModel != null) {
              // @ts-ignore
              let time = dateTimePickerUtil.format(ngModel, 'yyyy-MM-dd HH:mm:ss');
              this.submitEventVO.eventTime = time;
              if (this.isEdit) {
                if (this.submitEventVO.eventTime != this.basicInformation.eventTime) {
                  this.changeElementsVO.drillTime = this.submitEventVO.eventTime;
                  this.changeElementsVO.eventId = this.drillId;
                } else {
                  delete this.changeElementsVO.drillTime;
                }
              }
            } else {
              this.submitEventVO.eventTime = '';
            }
          },
        } as SFDateWidgetSchema,
      },
      purpose: {
        type: 'string',
        title: '目的',
        ui: {
          placeholder: '请输入',
          change: (ngModel:any) => {
            this.submitEventVO.purpose = ngModel;
          },
          blur: () => {
            if (this.isEdit) {
              if (this.submitEventVO.purpose != this.basicInformation.purpose) {
                this.changeElementsVO.eventId = this.drillId;
                this.changeElementsVO.purpose = this.submitEventVO.purpose;
              } else {
                delete this.changeElementsVO.purpose;
              }
            }
          },
        },
      },
    },
    required: ['planName', 'startTime'],
  };

  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '演练计划名称', index: 'planName' },
    {
      title: '站点/区域',
      format: function (content) {
        if (content.siteName) {
          return content.siteName;
        } else if (content.areaName) {
          return content.areaName;
        } else {
          return '-';
        }
      },
    },
    { title: '填写人', index: 'submitEmployeeName' },
    { title: '填写时间', index: 'createdTime' },
    {
      title: '状态',
      index: 'content',
      format: function (content, col) {
        if (content.drillProcess == 'ongoing') {
          return '审批中';
        } else if (content.drillProcess == 'pass') {
          return '已通过';
        } else if (content.drillProcess == 'notpass') {
          return '未通过';
        } else {
          return '废弃';
        }
      },
    },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'link',
          click: (record) => {
            this.visible = true;
            this.newReport = true;
            this.titleIndex = 1;
            this.dismissed = false;
            this.submitTime = this.getTime();
            this.changeElementsVO = {};
            this.isEdit = true;
            this.getLocalStorage();
            this.editDrill(record.id);
            this.drillId = record.id;
          },
        },
        // {
        //   text: '删除',
        //   type: 'link',
        // },
      ],
    },
  ];

  /* 应急预案表格 */
  @ViewChild('st2', { static: false }) st2!: STComponent;
  columns2: STColumn[] = [
    {
      title: '操作',
      type: 'checkbox',
    },
    {
      title: '应急规章制度名称',
      index: 'name',
    },
  ];

  /* 加载所有线路数据 */
  loadLineData() {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/findAllLine`).subscribe((res) => {
      if (res.success) {
        this.selectLineData = res.data.map((element:any) => {
          return { title: element.name, key: element.id };
        });
        this.drawerLineData = res.data.map((element:any) => {
          return { title: element.name, key: element.id };
        });
        // @ts-ignore
        this.searchSchema.properties.site.enum = this.selectLineData;
        // @ts-ignore
        this.drawerSearchSchema.properties.site.enum = this.drawerLineData;
        for (let i = 0; i < this.selectLineData.length; i++) {
          this.loadSiteData(this.selectLineData[i].key, i);
          this.loadSiteData(this.drawerLineData[i].key, i);
        }
        this.sf1.refreshSchema();
        this.sf3.refreshSchema();
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
        this.drawerSiteData = res.data.map((element:any) => {
          return { title: element.name, key: element.id, isLeaf: true };
        });
        this.selectLineData[index].children = this.selectSiteData;
        this.drawerLineData[index].children = this.drawerSiteData;
        this.sf1.refreshSchema();
        this.sf3.refreshSchema();
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
        // @ts-ignore
        this.drawerSearchSchema.properties.area.enum = this.allAreaData;
        // @ts-ignore
        this.searchSchema.properties.area.enum = this.allAreaData;
        this.sf3.refreshSchema();
        this.sf1.refreshSchema();
      }
    });
  }

  /**
   * 加载事件大类
   */
  loadEventCategoryData(category: any, check?:any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/` + category).subscribe((res) => {
      this.eventCategoryData = res.data.map((element:any) => {
        return { label: element.label, value: element.id };
      });
      if (typeof check == 'function') {
        check(this.eventCategoryData);
      }
    });
  }

  /**
   * 加载所有事件等级
   */
  loadEventLevelData(category: any, check?:any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByCategory/` + category).subscribe((res) => {
      this.eventLevelData = res.data.map((element:any) => {
        return { label: element.label, value: element.id };
      });
      if (typeof check == 'function') {
        check(this.eventLevelData);
      }
    });
  }

  /* 加载事件类型数据 */
  loadEventlData(value: any, check?:any) {
    this.http.get(`/service/emergency-base-config/admin/dictionary/getByParentId/${value}`).subscribe((res) => {
      this.eventData = [
        ...this.eventData,
        ...res.data.map((element:any) => {
          return { label: element.label, value: element.id };
        }),
      ];
      if (typeof check == 'function') {
        check(this.eventData);
      }
    });
  }

  new() {
    this.visible = true;
    this.newReport = false;
    this.titleIndex = 0;
    this.dismissed = false;
    this.isEdit = false;
    this.submitTime = this.getTime();
    this.getLocalStorage();
  }
  close() {
    this.visible = false;
    if (this.isEdit) {
      this.clearData();
    }
  }

  onChange($event:any) {}

  search() {
    this.visible = true;
    this.newReport = true;
    this.titleIndex = 2;
    this.dismissed = true;
  }

  /* 添加电话人员 */
  addUser() {
    this.modal
      .createStatic(EmergencyDispatchEmergencyExerciseEditComponent, { i: {}, mode: 'add', isSingleSelect: false })
      .subscribe((value) => {
        this.submitEventVO.temCallThirdUsers = value.map((element:any) => {
          return {
            avatar: element.icon,
            corpId: element.corpId,
            eventId: '',
            name: element.name,
            thirdPartyAccountUserId: element.thirdPartyAccountUserId,
          };
        });
        this.st.reload();
      });
  }

  /* 删除电话人员 */
  phoneDelete(i:any) {
    this.submitEventVO.temCallThirdUsers.splice(i, 1);
  }

  /* 添加指挥人员 */
  addCommand() {
    if (this.commandPeople.length == 0) {
      this.modal
        .createStatic(EmergencyDispatchEmergencyExerciseEditComponent, { i: {}, mode: 'add', isSingleSelect: true })
        .subscribe((value) => {
          console.log(value);
          this.commandPeople = value.map((element:any) => {
            return {
              avatar: element.icon,
              corpId: element.corpId,
              eventId: '',
              name: element.name,
              thirdPartyAccountUserId: element.thirdPartyAccountUserId,
            };
          });
          this.submitEventVO.commandUser = this.commandPeople[0];
          this.st.reload();
        });
    }
  }

  /* 删除电话人员 */
  commandDelete(i:any) {
    this.commandPeople.splice(0, 1);
  }

  tagUserDelete(i:any, a:any) {
    this.submitEventVO.tagVOS[i].tagUsers.splice(a, 1);
  }

  /* 事件大类变化回调 */
  categoryChange(eventCategoryData:any) {
    let value = eventCategoryData.filter((item:any) => item.checked).map((item:any) => item.value);
    this.submitEventVO.categoryId = value.toString();
    if (this.isEdit) {
    }
    this.eventData = [];
    if (value.length != 0) {
      for (let i = 0; i < value.length; i++) {
        this.loadEventlData(value[i]);
      }
    } else {
      this.eventData = [];
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

  /* 添加审批人 */
  approverUser() {
    this.modal
      .createStatic(EmergencyDispatchEmergencyExerciseEditComponent, { i: {}, mode: 'add', isSingleSelect: true })
      .subscribe((value) => {
        this.approver = value.map((element:any) => {
          return { label: element.name, value: element.thirdPartyAccountUserId };
        });
        console.log(this.approver);
        this.submitEventVO.approvalEmployeeId = this.approver[0].value;
        this.submitEventVO.approvalEmployeeName = this.approver[0].label;
        this.st.reload();
      });
  }

  /* 查询应急预案预设应急人员 */
  tagSearch() {
    let url: string;
    this.tagAndPeopleQuery.employeeId = this.thirdId;
    if (this.submitEventVO.isAreaEmergency) {
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
    }
    console.log(this.tagAndPeopleQuery);
    this.http.post(url, this.tagAndPeopleQuery).subscribe((res) => {
      console.log(res);
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
        this.messageService.error('查询失败，服务器错误');
      }
    });
  }

  /* 保存演练计划 */
  save() {
    console.log(this.originData);
    if (!this.isEdit) {
      if (this.submitEventVO.isAreaEmergency) {
        this.submitEventVO.lineIds = [];
        this.submitEventVO.stationIds = [];
        this.submitEventVO.siteName = '';
        this.submitEventVO.areaIds = this.originData.areaIds;
        this.submitEventVO.areaName = this.originData.areaName;
      } else {
        this.submitEventVO.areaIds = [];
        this.submitEventVO.areaName = '';
        this.submitEventVO.lineIds = this.originData.lineIds;
        this.submitEventVO.stationIds = this.originData.stationIds;
        this.submitEventVO.siteName = this.originData.siteName;
      }
      if (this.submitEventVO.overviewAndRequirements.length == 0) {
        this.messageService.error('提交失败，请输入事件概括及处理要求');
      } else if (this.submitEventVO.drillName.length == 0) {
        this.messageService.error('提交失败，请输入计划名称');
      } else if (this.submitEventVO.eventTime.length == 0) {
        this.messageService.error('提交失败，请输入演示开始时间');
      } else if (this.commandPeople.length == 0) {
        this.messageService.error('提交失败，请添加指挥人员');
      } else {
        this.http.post(`/service/emergency-drill/wxcp/DrillApi/submitDrill`, this.submitEventVO).subscribe((res) => {
          console.log(res);
          if (res.success) {
            this.visible = false;
            this.clearData();
          }
        });
        this.messageService.success('提交成功');
      }
    } else {
      /* 保存编辑后的基础信息 */
      if (Object.keys(this.changeElementsVO).length > 3) {
        const url = `/service/emergency-drill/wxcp/DrillApi/changeEventDescription`;
        this.saveEditInfo(url, this.changeElementsVO);
      }

      /* 保存编辑后的电话人员信息 */
      if (!this.judgeResult(this.changeTemCallVO.temCallThirdUsers, this.submitEventVO.temCallThirdUsers)) {
        const url = `/service/emergency-drill/admin/DrillApi/change/PhonePeople`;
        this.changeTemCallVO.eventId = this.drillId;
        this.changeTemCallVO.temCallThirdUsers = this.submitEventVO.temCallThirdUsers;
        this.saveEditInfo(url, this.changeTemCallVO);
      }
      /* 保存编辑后的指挥人员数据 */
      if (this.changeEventCommandVO.thirdPartyAccountUserId != this.submitEventVO.commandUser.thirdPartyAccountUserId) {
        const url = `/service/emergency-drill/admin/DrillApi/change/onSiteCommand`;
        this.changeEventCommandVO = this.submitEventVO.commandUser;
        this.changeEventCommandVO.eventId = this.drillId;
        let value = JSON.parse(<string>window.localStorage.getItem('employee'));
        this.changeEventCommandVO.operationEmployeeId = value.thirdPartyAccountUserId;
        this.changeEventCommandVO.operationEmployeeName = value.employeeName;
        this.saveEditInfo(url, this.changeEventCommandVO);
      }

      /* 保存编辑后的应急预案 */
      if (!this.judgeResult(this.changeEventPlanVO.planVOS, this.submitEventVO.eventPlanVOS)) {
        const url = `/service/emergency-drill/wxcp/DrillApi/changeEventPlans`;
        this.changeEventPlanVO.planVOS = this.submitEventVO.eventPlanVOS;
        this.changeEventPlanVO.eventId = this.drillId;
        this.saveEditInfo(url, this.changeEventPlanVO);
      }

      /* 保存编辑后的附件 */
      if (!this.judgeResult(this.changeEventAttachmentFileVO.eventAttachmentFileDTOS, this.submitEventVO.eventAttachmentFiles)) {
        const url = `/service/emergency-drill/wxcp/DrillApi/changeAttachmentFiles`;
        this.changeEventAttachmentFileVO.eventAttachmentFileDTOS = this.submitEventVO.eventAttachmentFiles;
        this.changeEventAttachmentFileVO.eventId = this.drillId;
        this.saveEditInfo(url, this.changeEventAttachmentFileVO);
      }

      /* 保存编辑后的事件大类数据 */
      let bigCategoryArr: any;
      if (this.submitEventVO.categoryId.length != 0) {
        bigCategoryArr = this.submitEventVO.categoryId.split(',');
      } else {
        bigCategoryArr = [];
      }
      if (!this.judgeResult(this.changeBigCategory.elementIds, bigCategoryArr)) {
        console.log('事件大类改变');
        const url = `/service/emergency-drill/wxcp/DrillApi/changeEventElement`;
        this.changeBigCategory.elementIds = bigCategoryArr;
        this.changeBigCategory.elementCategory = 'BIG_CATEGORY';
        this.changeBigCategory.eventId = this.drillId;
        this.saveEditInfo(url, this.changeBigCategory);
      }

      /* 保存编辑后的事件类型数据 */
      let categoryArr: any;
      if (this.submitEventVO.emergencyCategoryId.length != 0) {
        categoryArr = this.submitEventVO.emergencyCategoryId.split(',');
      } else {
        categoryArr = [];
      }
      if (!this.judgeResult(this.changeCategory.elementIds, categoryArr)) {
        console.log('事件类型改变');
        const url = `/service/emergency-drill/wxcp/DrillApi/changeEventElement`;
        this.changeCategory.elementIds = categoryArr;
        this.changeCategory.elementCategory = 'CATEGORY';
        this.changeCategory.eventId = this.drillId;
        this.saveEditInfo(url, this.changeCategory);
      }

      /* 保存编辑后的事件等级数据 */
      let levelArr: any;
      if (this.submitEventVO.eventLevelId.length != 0) {
        levelArr = this.submitEventVO.eventLevelId.split(',');
      } else {
        levelArr = [];
      }
      if (!this.judgeResult(this.changeLevel.elementIds, levelArr)) {
        console.log('事件等级更改');
        const url = `/service/emergency-drill/wxcp/DrillApi/changeEventElement`;
        this.changeLevel.elementIds = levelArr;
        this.changeLevel.elementCategory = 'LEVEL';
        this.changeLevel.eventId = this.drillId;
        this.saveEditInfo(url, this.changeLevel);
      }

      /* 保存编辑后的审批人数据 */
      if (this.changeApproval.approvalEmployeeId != this.submitEventVO.approvalEmployeeId) {
        const url = `/service/emergency-drill/admin/DrillApi/change/approval`;
        this.changeApproval.approvalEmployeeId = this.submitEventVO.approvalEmployeeId;
        this.changeApproval.approvalEmployeeName = this.submitEventVO.approvalEmployeeName;
        this.changeApproval.drillId = this.drillId;
        this.saveEditInfo(url, this.changeApproval);
      }
    }

    console.log(this.submitEventVO);
  }

  /* 判断是否区域应急 */
  areaEmergencyChange() {
    const area:any = this.sf3.getProperty('/area');
    const site:any = this.sf3.getProperty('/site');
    area.schema.readOnly = !this.submitEventVO.isAreaEmergency;
    site.schema.readOnly = this.submitEventVO.isAreaEmergency;
    area.widget.reset('');
    site.widget.reset('');
  }

  /* 表单重置 */
  resetSearch(e:any) {
    this.sf1.reset(true);
    this.st.reset(e);
    this.drillListQuery = {};
  }
  /* 表单搜索 */
  fromSearch() {
    /* 判断搜索条件是否为空 */
    if (Object.keys(this.drillListQuery).length != 0) {
      console.log(this.drillListQuery);
      this.st.load(1, this.drillListQuery);
    }
  }

  getLocalStorage() {
    let value = JSON.parse(<string>window.localStorage.getItem('employee'));
    this.thirdId = value.thirdPartyAccountUserId;
    if (this.isEdit) {
      this.changeElementsVO.operationEmployeeId = value.thirdPartyAccountUserId;
      this.changeElementsVO.operationEmployeeName = value.employeeName;

      this.changeEventAttachmentFileVO.employeeId = value.thirdPartyAccountUserId;
      this.changeEventAttachmentFileVO.employeeIdName = value.employeeName;

      this.changeEventPlanVO.employeeId = value.thirdPartyAccountUserId;
      this.changeEventPlanVO.employeeIdName = value.employeeName;

      this.changeTemCallVO.operationEmployeeId = value.thirdPartyAccountUserId;
      this.changeTemCallVO.operationEmployeeName = value.employeeName;

      this.changeBigCategory.operationEmployeeId = value.thirdPartyAccountUserId;
      this.changeBigCategory.operationEmployeeName = value.employeeName;

      this.changeCategory.operationEmployeeId = value.thirdPartyAccountUserId;
      this.changeCategory.operationEmployeeName = value.employeeName;

      this.changeLevel.operationEmployeeId = value.thirdPartyAccountUserId;
      this.changeLevel.operationEmployeeName = value.employeeName;

      this.changeApproval.updateUserId = value.thirdPartyAccountUserId;
    } else {
      this.submitEventVO.submitAvatar = value.avatar;
      this.submitEventVO.submitCorpId = value.cropId;
      this.submitEventVO.submitMobilePhone = value.mobilePhone;
      this.submitEventVO.submitThirdId = value.thirdPartyAccountUserId;
      this.submitEventVO.submitName = value.employeeName;
    }
  }

  getTime() {
    var date = new Date();
    var seperator1 = '/';
    var seperator2 = ':';
    var month: any = date.getMonth() + 1;
    var strDate: any = date.getDate();
    var hours: any = date.getHours();
    var minutes: any = date.getMinutes();
    var seconds: any = date.getSeconds();
    //月
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    //日
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    //时
    if (hours >= 0 && hours <= 9) {
      hours = '0' + hours;
    }
    //分
    if (minutes >= 0 && minutes <= 9) {
      minutes = '0' + minutes;
    }
    //秒
    if (seconds >= 0 && seconds <= 9) {
      seconds = '0' + seconds;
    }
    //格式化后日期为：yyyy-MM-dd HH:mm:ss
    var currentdate =
      date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + hours + seperator2 + minutes + seperator2 + seconds;
    return currentdate;
  }

  return() {
    this.visible = false;
  }

  tagClose(i:any) {
    this.submitEventVO.tagVOS.splice(i, 1);
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    this.handleUpload();
    return false;
  };

  /* 上传附件 */
  handleUpload() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    this.uploading = true;
    this.http.post(`/api/upload`, formData).subscribe((res) => {
      if (res.success) {
        let fileData: any = {};
        fileData.fileName = res.data.fileName + '.' + res.data.suffix;
        fileData.url = res.data.url;
        this.submitEventVO.eventAttachmentFiles.push(fileData);
        console.log(this.submitEventVO);
      }
    });
  }

  ngAfterViewInit() {
    this.loadLineData();
    this.loadAllArea();
    this.loadEventCategoryData('emergencyBigCategory');
    this.loadEventLevelData('emergencyLevel');
  }

  basicInformation: any = {}; //编辑页面的表单基础信息

  /* 编辑应急演练 */
  editDrill(id:any) {
    console.log(this.submitEventVO);
    /* 加载基础信息*/
    this.http.get(`/service/emergency-drill/wxcp/DrillApi/getDrill/${id}`).subscribe((res) => {
      console.log(res);
      if (res.success) {
        let approval: any = {};
        // @ts-ignore
        this.drawerSearchSchema.properties.startTime.default = res.data.drillTime;
        // @ts-ignore
        this.drawerSearchSchema.properties.planName.default = res.data.planName;
        // @ts-ignore
        this.drawerSearchSchema.properties.purpose.default = res.data.purpose;

        approval.label = res.data.approvalEmployeeName;
        approval.value = res.data.approvalEmployeeId;
        this.changeApproval.approvalEmployeeName = res.data.approvalEmployeeName;
        this.changeApproval.approvalEmployeeId = res.data.approvalEmployeeId;
        this.submitEventVO.approvalEmployeeId = res.data.approvalEmployeeId;
        this.approver[0] = approval;

        this.basicInformation.drillName = res.data.planName;
        this.submitEventVO.drillName = res.data.planName;

        this.basicInformation.purpose = res.data.purpose;
        this.submitEventVO.purpose = res.data.purpose;

        this.basicInformation.eventTime = res.data.drillTime;
        this.basicInformation.overviewAndRequirements = res.data.overviewAndRequirements;
        this.submitEventVO.overviewAndRequirements = res.data.overviewAndRequirements;

        this.submitEventVO.submitName = res.data.submitEmployeeName;

        this.submitTime = res.data.createdTime;
        this.sf3.refreshSchema();
      }
    });

    /* 加载线路、站点、事件大类、事件等级、事件类型 */
    this.http.get(`/service/emergency-drill/wxcp/DrillApi/getEventElementInfo/${id}`).subscribe((res) => {
      console.log(res);
      let lineId :any=[];
      let siteId :any=[];
      let categoryId :any=[];
      let bigCategoryId :any=[];
      let areaId :any=[];
      let levelId :any=[];
      res.data.forEach((element:any) => {
        if (element.elementCategory == 'LINE') {
          lineId.push(element.elementId);
        } else if (element.elementCategory == 'CATEGORY') {
          categoryId.push(element.elementId);
        } else if (element.elementCategory == 'BIG_CATEGORY') {
          bigCategoryId.push(element.elementId);
        } else if (element.elementCategory == 'STATION') {
          siteId.push(element.elementId);
        } else if (element.elementCategory == 'AREA') {
          areaId.push(element.elementId);
        } else if (element.elementCategory == 'LEVEL') {
          levelId.push(element.elementId);
        }
      });
      let allSiteId = lineId.concat(siteId);
      console.log(allSiteId);
      console.log(areaId);

      // @ts-ignore
      this.drawerSearchSchema.properties.site.default = allSiteId;
      // @ts-ignore
      this.drawerSearchSchema.properties.area.default = areaId;
      // @ts-ignore
      this.drawerSearchSchema.properties.site.readOnly = true;
      // @ts-ignore
      this.drawerSearchSchema.properties.area.readOnly = true;
      this.submitEventVO.areaIds = areaId;
      this.submitEventVO.lineIds = lineId;
      this.submitEventVO.stationIds = siteId;

      this.changeBigCategory.elementIds = bigCategoryId;
      this.submitEventVO.categoryId = bigCategoryId.toString();

      this.changeCategory.elementIds = categoryId;
      this.submitEventVO.emergencyCategoryId = categoryId.toString();

      this.changeLevel.elementIds = levelId;
      this.submitEventVO.eventLevelId = levelId.toString();
      this.sf3.refreshSchema();

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
      function categoryCheck(value:any) {
        if (bigCategoryId.length != 0) {
          bigCategoryId.forEach((element:any) => {
            value.forEach((item:any) => {
              if (item.value == element) {
                item.checked = true;
              }
            });
          });
        }
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
      this.loadEventCategoryData('emergencyBigCategory', categoryCheck);
      this.loadEventLevelData('emergencyLevel', levelCheck);
      bigCategoryId.forEach((value:any) => {
        this.eventData = [];
        this.loadEventlData(value, eventCheck);
      });
    });

    /* 加载电话人员 */
    this.http.get(`/service/emergency-drill/wxcp/DrillApi/getPhonePeople/${id}`).subscribe((res) => {
      if (res.success) {
        this.changeTemCallVO.temCallThirdUsers = res.data.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            corpId: element.corpId,
            eventId: '',
            name: element.employeeName,
            thirdPartyAccountUserId: element.employeeId,
          };
        });
        this.submitEventVO.temCallThirdUsers = res.data.map((element:any) => {
          return {
            avatar: element.employeeAvatar,
            corpId: element.corpId,
            eventId: '',
            name: element.employeeName,
            thirdPartyAccountUserId: element.employeeId,
          };
        });
      }
    });

    /* 加载应急预案 */
    this.http.get(`/service/emergency-drill/wxcp/DrillApi/getEmergencyPlanList/${id}`).subscribe((res) => {
      if (res.success) {
        this.changeEventPlanVO.planVOS = res.data.map((element:any) => {
          return {
            fileUrl: element.drillPlanUrl,
            title: element.drillPlanName,
            value: element.drillPlanId,
          };
        });
        this.submitEventVO.eventPlanVOS = res.data.map((element:any) => {
          return {
            fileUrl: element.drillPlanUrl,
            title: element.drillPlanName,
            value: element.drillPlanId,
          };
        });
      }
    });

    /* 加载附件 */
    this.http.get(`/service/emergency-drill/wxcp/DrillApi/getAttachmentFiles/${id}`).subscribe((res) => {
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

    /* 加载应急指挥 */
    this.http.get(`/service/emergency-drill/wxcp/DrillApi/getDrillCommand/${id}`).subscribe((res) => {
      if (res.success) {
        this.commandPeople = [];
        let command: any = {};
        command.avatar = res.data.commandAvatar;
        command.corpId = res.data.commandCorpId;
        command.eventId = '';
        command.name = res.data.commandName;
        command.thirdPartyAccountUserId = res.data.commandId;
        this.commandPeople.push(command);
        this.changeEventCommandVO = command;
        this.submitEventVO.commandUser = command;
      }
    });
  }

  /* 保存编辑后的信息 */
  saveEditInfo(url:any, data:any) {
    this.http.post(url, data).subscribe((res) => {
      console.log(res);
      if (res.success) {
        this.visible = false;
        this.clearData();
        this.st.reset();
      }
    });
  }

  /* 清空数据 */
  clearData() {
    this.loadEventCategoryData('emergencyBigCategory');
    this.loadEventLevelData('emergencyLevel');
    this.eventData = [];
    this.approver = [];
    this.commandPeople = [];
    this.tagAndPeopleQuery = {
      areaIds: [],
      dictionaryIds: [], //大类数据
      employeeId: '',
      eventLevelIds: [],
      eventTypeIds: [],
      lineIds: [],
      specialtyIds: [],
      stationIds: [],
    };
    this.submitEventVO = {
      approvalEmployeeId: '',
      approvalEmployeeName: '',
      drillName: '',
      isAreaEmergency: false,
      areaIds: [],
      areaName: '',
      categoryId: '',
      commandUser: {},
      emergencyCategoryId: '',
      emergencyProfessionId: '',
      eventAttachmentFiles: [],
      eventLevelId: '',
      eventPlanVOS: [],
      eventTime: '',
      purpose: '',
      fullPushStatus: true,
      lineIds: [],
      openTheTrajectory: true,
      overviewAndRequirements: '',
      queryTagMethod: 0,
      siteName: '',
      stationIds: [],
      submitAvatar: '',
      submitCorpId: '',
      submitMobilePhone: '',
      submitName: '',
      submitThirdId: '',
      tagVOS: [],
      temCallThirdUsers: [],
    };

    // @ts-ignore
    delete this.drawerSearchSchema.properties.startTime.default;
    // @ts-ignore
    delete this.drawerSearchSchema.properties.planName.default;
    // @ts-ignore
    delete this.drawerSearchSchema.properties.area.default;
    // @ts-ignore
    delete this.drawerSearchSchema.properties.area.readOnly;
    // @ts-ignore
    delete this.drawerSearchSchema.properties.site.default;
    // @ts-ignore
    delete this.drawerSearchSchema.properties.site.readOnly;
    // @ts-ignore
    delete this.drawerSearchSchema.properties.purpose.default;
    this.sf3.reset(true);
    this.sf3.refreshSchema();
  }

  /* 删除附件 */
  deleteAttachmentFiles(i:any) {
    this.submitEventVO.eventAttachmentFiles.splice(i, 1);
    console.log(this.submitEventVO);
  }

  /* 添加应急预案 */
  addPlanFile() {
    if (this.st) {
      this.st2.load();
    }
    this.emergencyPlanFile = this.submitEventVO.eventPlanVOS;
    this.childrenVisible = true;
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
      this.st2.list.forEach((item:any) => {
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

  /* 关闭子抽屉页面 */
  closeChildren() {
    this.childrenVisible = false;
  }

  /* 取消选择 */
  childrenCancel() {
    this.childrenVisible = false;
  }

  /* 确认选择 */
  childrenConfirm() {
    this.submitEventVO.eventPlanVOS = this.emergencyPlanFile;
    this.childrenVisible = false;
    console.log(this.submitEventVO);
  }

  textareaChange() {
    if (this.isEdit) {
      if (this.submitEventVO.overviewAndRequirements != this.basicInformation.overviewAndRequirements) {
        this.changeElementsVO.overviewAndRequirements = this.submitEventVO.overviewAndRequirements;
        this.changeElementsVO.eventId = this.drillId;
      } else {
        delete this.changeElementsVO.overviewAndRequirements;
      }
    }
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

  abandon() {
    this.http.get(`/service/emergency-drill/wxcp/DrillApi/change/eventProcess/abandon/${this.drillId}/${this.thirdId}`).subscribe((res) => {
      console.log(res);
      if (res.success) {
        this.visible = false;
        this.clearData();
        this.st.reset();
      }
    });
  }

  ngOnInit() {}
}
