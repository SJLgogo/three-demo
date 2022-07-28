import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STColumnButton } from '@delon/abc/st';
import { SFComponent, SFSchema, SFRadioWidgetSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from '@env/environment';
import {Base} from "../../../api/common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-point-set',
  templateUrl: './emergency-point-set.component.html',
  styleUrls: ['./emergency-point-set.css'],
})
export class EmergencyDispatchEmergencyPointSet extends Base implements OnInit {
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {
    super();
  }
  url = `/service/emergency-base-config/admin/emergencyPointApi/getAllEmergencyPoint`;
  emergencyPointQuery: any = {}; //查询参数
  visible: boolean = false;
  isShowModal = false;
  pointRoleVOList: any = [];
  fileList: NzUploadFile[] = []; //上传文件列表
  roleList: any = []; //角色列表
  fileCategory: any = []; //规章制度类别
  emergencyPointVO: any = {
    pointRoleVOList: [],
  };
  roleIndex: any; //判断附件上传角色的索引
  uploading = false;
  isEdit = false;
  emergencyPointStatus: any = {}; //修改应急要点状态
  titleName = '新建';

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      pointName: {
        type: 'string',
        title: '应急要点名称',
        ui: {
          placeholder: '请输入',
          change: (ngModel:any) => {
            this.emergencyPointQuery.name = ngModel;
          },
        },
      },
      pointStatus: {
        type: 'string',
        title: '应急要点状态',
        enum: ['启用', '停用'],
        ui: {
          widget: 'radio',
          change: (ngModel) => {
            ngModel == '启用' ? (this.emergencyPointQuery.status = 1) : (this.emergencyPointQuery.status = -1);
          },
        } as SFRadioWidgetSchema,
      },
      personnelSet: {
        type: 'string',
        title: '创建人员',
        ui: {
          placeholder: '请输入',
          change: (ngModel:any) => {
            this.emergencyPointQuery.employeeName = ngModel;
          },
        },
      },
    },
  };

  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '要点名称', index: 'name' },
    {
      title: '状态',
      index: 'status',
      format: function (content) {
        if (content.status == 1) {
          return '启用';
        } else {
          return '停用';
        }
      },
    },
    { title: '创建人员', index: 'createEmployeeName' },
    { title: '更新人员', index: 'editEmployeeName' },
    { title: '设置时间', index: 'createdTime' },
    { title: '更新时间', index: 'editTime' },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          type: 'link',
          click: (record) => {
            console.log(record);
            this.titleName = '编辑';
            this.visible = true;
            this.isEdit = true;
            this.changePointDetail(record.id);
          },
        },
        {
          text: '停用',
          type: 'link',
          pop: {
            title: '确认停用吗？',
            okType: 'danger',
          },
          click: (record) => {
            this.emergencyPointStatus.id = record.id;
            this.emergencyPointStatus.status = -1;
            this.editPointStatus();
          },
        },
        {
          text: '启用',
          type: 'link',
          pop: {
            title: '确认启用吗',
          },
          click: (record) => {
            this.emergencyPointStatus.id = record.id;
            this.emergencyPointStatus.status = 1;
            this.editPointStatus();
          },
        },
      ],
    },
  ];

  /* 表单重置 */
  resetSearch(e:any) {
    const extraParams = {};
    this.st.reset(extraParams);
    // this.emergencyPointQuery = {};
    this.sf.reset(true);
  }
  /* 新建应急处置要点 */
  reset() {
    this.visible = true;
    this.isEdit = false;
    this.titleName = '新建';
    this.getLocalStorage();
  }

  /* 关闭抽屉页面 */
  close() {
    if (this.isEdit) {
      this.visible = false;
      this.clearData();
    } else {
      this.visible = false;
    }
  }
  addPoint(i:any) {
    this.emergencyPointVO.pointRoleVOList[i].emergencyPointItemDTOS.push({ content: '', materialReference: '' });
  }
  addRole() {
    this.emergencyPointVO.pointRoleVOList.push({
      emergencyPointAttachmentFileDTOS: [],
      emergencyPointItemDTOS: [{ content: '', materialReference: '' }],
    });
  }
  deletePoint(i:any, a:any) {
    this.emergencyPointVO.pointRoleVOList[i].emergencyPointItemDTOS.splice(a, 1);
  }
  deleteRole(i:any) {
    this.emergencyPointVO.pointRoleVOList.splice(i, 1);
  }

  /* 删除附件 */
  deleteFile(i:any, c:any) {
    this.emergencyPointVO.pointRoleVOList[i].emergencyPointAttachmentFileDTOS.splice(c, 1);
    console.log(this.emergencyPointVO);
  }

  eventCancel() {
    this.isShowModal = false;
  }
  loadlist() {
    this.http
      .post(`/service/emergency-base-config/admin/emergencyPointApi/getAllEmergencyPoint`, this.emergencyPointQuery)
      .subscribe((res) => {
        console.log(res);
      });
  }
  loadRoleData() {
    this.http.get(`/service/emergency-base-config/admin/emergencyPointApi/getPointRoleList`).subscribe((res) => {
      if (res.success) {
        this.roleList = res.data.map((element:any) => {
          return { label: element.name, value: element.id };
        });
      }
    });
  }
  selectRole(value:any, i:any) {
    if (value != null) {
      this.emergencyPointVO.pointRoleVOList[i].roleName = this.roleList.filter((element:any) => element.value == value)[0].label;
    } else {
      this.emergencyPointVO.pointRoleVOList[i].roleName = null;
    }
  }

  selectFileCategory(value:any) {
    console.log(value);
    if (value != null) {
      this.emergencyPointVO.emergencyFileCategoryName = this.fileCategory.filter((element:any) => element.value == value)[0].label;
    } else {
      this.emergencyPointVO.emergencyFileCategoryName = null;
    }
  }

  getFileCategory() {
    this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/findAllByLevel/${1}`).subscribe((res) => {
      if (res.success) {
        this.fileCategory = res.data.map((element:any) => {
          return { label: element.name, value: element.id };
        });
      }
    });
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
        let fileData: any = {};
        fileData.fileName = res.data.fileName + '.' + res.data.suffix;
        fileData.url = res.data.url;
        this.emergencyPointVO.pointRoleVOList[this.roleIndex].emergencyPointAttachmentFileDTOS.push(fileData);
      }
    });
  }

  getLocalStorage() {
    let value = JSON.parse(<string>window.localStorage.getItem('employee'));
    if (this.isEdit) {
      this.emergencyPointVO.editEmployeeName = value.employeeName;
      this.emergencyPointVO.editEmployeeId = value.thirdPartyAccountUserId;
    } else {
      this.emergencyPointVO.createName = value.employeeName;
      this.emergencyPointVO.createThirdPartyAccountUserId = value.thirdPartyAccountUserId;
    }
  }

  /* 保存应急要点 */
  save() {
    if (this.isEdit) {
      this.http
        .post(`/service/emergency-base-config/admin/emergencyPointApi/editEmergencyPoint`, this.emergencyPointVO)
        .subscribe((res) => {
          console.log(res);
          if (res.success) {
            this.visible = false;
            this.st.reset();
            this.messageService.success('编辑成功');
            this.clearData();
          }
        });
    } else {
      this.http
        .post(`/service/emergency-base-config/admin/emergencyPointApi/addNewEmergencyPoint`, this.emergencyPointVO)
        .subscribe((res) => {
          console.log(res);
          if (res.success) {
            this.visible = false;
            this.st.reset();
            this.messageService.success('提交成功');
            this.clearData();
          }
        });
    }

    console.log(this.emergencyPointVO);
  }
  add(i:any) {
    this.roleIndex = i;
  }

  fromSearch() {
    /* 判断搜索条件是否为空 */
    if (Object.keys(this.emergencyPointQuery).length != 0) {
      this.st.load(1, this.emergencyPointQuery);
    }
  }

  /* 改变应急要点状态 */
  editPointStatus() {
    this.http
      .post(`/service/emergency-base-config/admin/emergencyPointApi/changeEmergencyPointStatus`, this.emergencyPointStatus)
      .subscribe((res) => {
        console.log(res);
        if (res.success) {
          this.isShowModal = false;
          this.st.reload();
          if (this.emergencyPointStatus.status == 1) {
            this.messageService.success('启用成功');
          } else {
            this.messageService.warning('停用成功');
          }
        }
      });
  }

  /* 编辑应急要点 */
  changePointDetail(id:any) {
    this.http.get(`/service/emergency-base-config/admin/emergencyPointApi/getEmergencyPointDetail/${id}`).subscribe((res) => {
      console.log(res);
      if (res.success) {
        this.emergencyPointVO.createName = res.data.createName;
        this.emergencyPointVO.createThirdPartyAccountUserId = res.data.createThirdPartyAccountUserId;
        this.emergencyPointVO.emergencyFileCategoryId = res.data.emergencyFileCategoryId;
        this.emergencyPointVO.emergencyFileCategoryName = res.data.emergencyFileCategoryName;
        this.emergencyPointVO.id = res.data.id;
        this.emergencyPointVO.name = res.data.name;
        this.emergencyPointVO.pointRoleVOList = res.data.pointRoleVOList.map((item:any) => {
          return {
            emergencyPointAttachmentFileDTOS: item.emergencyPointAttachmentFileDTOS.map((fileItem:any) => {
              return {
                fileName: fileItem.fileName,
                url: fileItem.url,
              };
            }),
            emergencyPointItemDTOS: item.emergencyPointItemDTOS.map((pointItem:any) => {
              return {
                content: pointItem.content,
                materialReference: pointItem.materialReference,
              };
            }),
            id: item.id,
            roleId: item.roleId,
            roleName: item.roleName,
          };
        });
        this.getLocalStorage();
        console.log(this.emergencyPointVO);
      }
    });
  }

  clearData() {
    this.emergencyPointVO = {
      pointRoleVOList: [],
    };
    this.emergencyPointVO.pointRoleVOList.push({ emergencyPointAttachmentFileDTOS: [], emergencyPointItemDTOS: [] });
    this.emergencyPointVO.pointRoleVOList[0].emergencyPointItemDTOS.push({ content: '', materialReference: '' });
    this.visible = false;
  }

  /* 判断附件格式 */
  judgeFile(url:any) :any{
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

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.loadlist();
    this.loadRoleData();
    // this.getLocalStorage();
    this.getFileCategory();
    this.emergencyPointVO.pointRoleVOList.push({ emergencyPointAttachmentFileDTOS: [], emergencyPointItemDTOS: [] });
    this.emergencyPointVO.pointRoleVOList[0].emergencyPointItemDTOS.push({ content: '', materialReference: '' });
  }
}
