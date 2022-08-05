import {Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {STColumn, STComponent, STColumnButton} from '@delon/abc/st';
import {SFComponent, SFSchema, SFStringWidgetSchema, SFSelectWidgetSchema, SFDateWidgetSchema} from '@delon/form';
import {Base} from '../../../common/base';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {environment} from '@env/environment';
import {dateTimePickerUtil} from '@delon/util';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-emergency-dispatch-emergency-plan-manage',
  templateUrl: './emergency-plan-manage.component.html',
  styleUrls: ['./emergency-plan-manage.css'],
})
export class EmergencyDispatchEmergencyPlanManage extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/adminEmergencyPlanFileApi/findForPage`;

  constructor(private messageService: NzMessageService, private http: _HttpClient) {
    super();
  }

  visible = false;
  selectedValue: any;
  planFileCategoryData = []; //应急规章制度类型列表数据
  categoryTwoData = []; //二级分类数据
  categoryThreeData = []; //三级分类数据
  emergencyPlanFileDTO: any = {}; //新增应急预案文件
  categoryTwoStatus: any = true;
  planFileCategory: any; //应急规章制度类型
  categoryTwo: any; //二级分类
  categoryThree: any; //三级分类
  fileList: NzUploadFile[] = []; //上传文件列表
  uploading = false;
  emergencyPlanFileQuery: any = {}; //应急预案查询
  searchCategoryList = []; //查询预案类别列表
  searchTypeList = []; //查询预案类型列表

  @ViewChild('sf', {static: false}) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      planName: {
        type: 'string',
        title: '预案名称',
        ui: {
          placeholder: '请输入',
          width: 270,
          change: (ngModel) => {
            console.log(ngModel);
            this.emergencyPlanFileQuery.name = ngModel;
          },
        } as SFStringWidgetSchema,
      },
      uploadTime: {
        type: 'string',
        title: '上传时间',
        ui: {
          widget: 'date',
          mode: 'range',
          change: (ngModel: any) => {
            console.log(ngModel);
            // @ts-ignore
            if (ngModel.length != 0) {
              let beginTime = dateTimePickerUtil.format(ngModel[0], 'yyyy-MM-dd 00:00:00');
              let endTime = dateTimePickerUtil.format(ngModel[1], 'yyyy-MM-dd 23:59:59');
              this.emergencyPlanFileQuery.startDate = beginTime;
              this.emergencyPlanFileQuery.endDate = endTime;
            } else {
              this.emergencyPlanFileQuery.startDate = '';
              this.emergencyPlanFileQuery.endDate = '';
            }
          },
        } as SFDateWidgetSchema,
      },
      typeName: {
        enum: [],
        type: 'string',
        title: '预案类型',
        ui: {
          widget: 'select',
          placeholder: '请选择',
          width: 270,
          allowClear: true,
          dropdownStyle: {'max-height': '200px'},
          change: (ngModel: any) => {
            console.log(ngModel);
            if (ngModel != null) {
              this.emergencyPlanFileQuery.typeId = ngModel;
              this.getSearchCategory(ngModel);
            } else {
              this.emergencyPlanFileQuery.typeId = '';
            }
          },
        },
      },
      categoryName: {
        type: 'string',
        title: '预案类别',
        ui: {
          widget: 'select',
          placeholder: '请选择',
          width: 270,
          allowClear: true,
          dropdownStyle: {'max-height': '200px'},
          change: (ngModel: any) => {
            if (ngModel != null) {
              this.emergencyPlanFileQuery.categoryId = ngModel;
            } else {
              this.emergencyPlanFileQuery.categoryId = '';
            }
          },
        },
      },
      uploader: {
        type: 'string',
        title: '上传人',
        ui: {
          placeholder: '请输入',
          width: 270,
          dropdownStyle: {'max-height': '200px'},
          change: (ngModel: any) => {
            console.log(ngModel);
            this.emergencyPlanFileQuery.uploaderName = ngModel;
          },
        },
      },
    },
  };

  @ViewChild('st', {static: false}) st!: STComponent;
  columns: STColumn[] = [
    {title: '预案名称', width: 270, index: 'name'},
    {title: '预案类型', width: 135, index: 'emergencyPlanFileTypeName'},
    {title: '预案类别', width: 150, index: 'emergencyPlanFileCategoryName'},
    {title: '上传人', width: 202, index: 'uploaderName'},
    {title: '上传时间', width: 492, index: 'createdDate'},
    {
      title: '操作',
      width: 268,
      index: 'used',
      buttons: [
        {
          text: '启用',
          type: 'link',
          pop: {
            title: '确认启用吗',
          },
          iif: (record) => record.used == false,
          iifBehavior: 'hide',
          click: (record) => {
            console.log(record);
            this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileApi/use/${record.id}`).subscribe((res) => {
              console.log(res);
              if (res.success) {
                this.st.reset();
                this.messageService.success('提示：启用成功');
              }
            });
          },
        },
        {
          text: '停用',
          type: 'link',
          pop: {
            title: '确认停用吗？',
            okType: 'danger',
          },
          iif: (record) => record.used,
          iifBehavior: 'hide',
          click: (record) => {
            console.log(record);
            this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileApi/stop/${record.id}`).subscribe((res) => {
              console.log(res);
              if (res.success) {
                this.st.reset();
                this.messageService.warning('提示：停用成功');
              }
            });
          },
        },
      ],
    },
  ];

  /* 表单重置 */
  resetSearch(e: any) {
    const extraParams = {};
    this.st.reset(extraParams);
    this.searchCategoryList = [];
    this.searchTypeList = [];
    this.emergencyPlanFileQuery = {};
    this.sf.reset(true);
  }

  /* 加载应急规章制度类型 */
  getEmergencyPlanFileCategory() {
    this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/findAllByLevel/${1}`).subscribe((res) => {
      if (res.success) {
        this.planFileCategoryData = res.data.map((element: any) => {
          return {label: element.name, value: element.id};
        });
        const typeNameProperty = this.sf.getProperty('/typeName')!;
        typeNameProperty.schema.enum = res.data.map((element: any) => {
          return {label: element.name, value: element.id};
        });
        this.sf.refreshSchema();
      }
    });
  }

  /* 加载 二级分类数据*/
  getCategoryTwo(id: any) {
    this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/findAllByParentId/${id}`).subscribe((res) => {
      if (res.success) {
        this.categoryTwoData = res.data.map((element: any) => {
          return {label: element.name, value: element.id};
        });
      }
    });
  }

  /* 加载查询预案类别数据 */
  getSearchCategory(id: any) {
    this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/findAllByParentId/${id}`).subscribe((res) => {
      if (res.success) {
        this.searchCategoryList = res.data.map((element: any) => {
          return {label: element.name, value: element.id};
        });
        const statusProperty = this.sf.getProperty('/categoryName')!;
        statusProperty.schema.enum = this.searchCategoryList;
        statusProperty.widget.reset(this.searchCategoryList);
      }
    });
  }

  /* 加载三级分类数据*/
  getCategoryThree(id: any) {
    this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/findAllByParentId/${id}`).subscribe((res) => {
      if (res.success) {
        this.categoryThreeData = res.data.map((element: any) => {
          return {label: element.name, value: element.id};
        });
      }
    });
  }

  /* 应急规章制度类型选择回调 */
  emergencyPlanFileCategoryChange(event: any) {
    if (event != null) {
      let id = event.value;
      this.categoryTwo = null;
      this.emergencyPlanFileDTO.emergencyPlanFileTypeName = event.label;
      this.emergencyPlanFileDTO.emergencyPlanFileTypeId = event.value;
      this.getCategoryTwo(id);
    } else {
      this.categoryTwo = null;
      this.categoryThree = null;
    }
  }

  /* 二级分类数据回调 */
  categoryTwoChange(event: any) {
    if (event != null) {
      let id = event.value;
      this.categoryThree = null;
      this.emergencyPlanFileDTO.emergencyPlanFileCategoryName = event.label;
      this.emergencyPlanFileDTO.emergencyPlanFileCategoryId = event.value;
      this.getCategoryThree(id);
    } else {
      this.categoryThree = null;
    }
  }

  /* 三级分类数据回调 */
  categoryThreeChange(event: any) {
    if (event != null) {
      this.emergencyPlanFileDTO.emergencyPlanFileLevelThreeName = event.label;
      this.emergencyPlanFileDTO.emergencyPlanFileLevelThreeId = event.value;
    }
  }

  getLocalStorage() {
    let value: any;
    //>>>>>陈阳
    this.emergencyPlanFileDTO.uploaderId = value.thirdPartyAccountUserId;
    this.emergencyPlanFileDTO.uploaderName = value.employeeName;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    this.handleUpload();
    return false;
  };

  handleUpload() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    this.uploading = true;
    this.http.post(`/api/upload`, formData).subscribe((res) => {
      if (res.success) {
        this.emergencyPlanFileDTO.url = res.data.url;
        console.log(res);
      }
    });
  }

  fileRemove = (file: NzUploadFile) => {
    this.emergencyPlanFileDTO.url = null;
    return true;
  };

  addEmergencyPlanFile() {
    this.http.post(`/service/emergency-base-config/admin/adminEmergencyPlanFileApi/add`, this.emergencyPlanFileDTO).subscribe((res) => {
      console.log(res);
      if (res.success) {
        this.messageService.success('上传成功');
        this.visible = false;
        this.st.reload();
        this.planFileCategory = null;
        this.categoryTwo = null;
        this.categoryThree = null;
        this.emergencyPlanFileDTO = {};
        this.fileList = [];
      }
    });
  }

  closeChildren() {
    this.visible = false;
  }

  upload() {
    this.visible = true;
    this.getLocalStorage();
  }

  cancel() {
    this.visible = false;
  }

  confirm() {
    console.log(this.emergencyPlanFileDTO);
    if (this.planFileCategory == null) {
      this.messageService.warning('提示：请选择应急规章制度类型');
    } else if (this.categoryTwo == null) {
      this.messageService.warning('提示：请选择二级分类');
    } else if (this.categoryThree == null) {
      this.messageService.warning('提示：请选择三级分类');
    } else if (this.emergencyPlanFileDTO.name == '' || this.emergencyPlanFileDTO.name == null) {
      this.messageService.warning('提示：请输入应急预案名称');
    } else if (this.emergencyPlanFileDTO.url == null) {
      this.messageService.warning('提示：请上传文件');
    } else {
      console.log(this.emergencyPlanFileDTO);
      this.addEmergencyPlanFile();
    }
  }

  /* 表单查询 */
  search() {
    console.log(this.emergencyPlanFileQuery);

    /* 判断搜索条件是否为空 */
    if (Object.keys(this.emergencyPlanFileQuery).length != 0) {
      console.log(this.emergencyPlanFileQuery);
      this.st.load(1, this.emergencyPlanFileQuery);
    }
  }

  ngAfterViewInit(): void {
    this.getEmergencyPlanFileCategory();
  }

  ngOnInit() {
    /*  this.http.post(`/service/emergency-base-config/admin/adminEmergencyPlanFileApi/findForPage`, this.emergencyPlanFileQuery).subscribe((res) => {
       console.log(res);
     }); */
  }
}
