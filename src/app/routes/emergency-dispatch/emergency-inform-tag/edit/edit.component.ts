import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import {
  SFComponent,
  SFSchema,
  SFSchemaEnumType,
  SFSelectWidgetSchema,
  SFTransferWidgetSchema,
  SFTreeSelectWidgetSchema,
  SFUISchema,
} from '@delon/form';
import { LineNetworkService } from '../../service/line-network.service';
import { DictionaryService } from '../../service/dictionary.service';
import { delay, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import {SetupContactSelectComponent} from "../../../../shared/components/contact-select/contact-select.component";

@Component({
  selector: 'app-emergency-dispatch-emergency-inform-tag-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmergencyTagInformEditComponent implements AfterViewInit {
  record: any = {};
  i: any;
  mode: any;
  areaSchemaJson: any; //区域json
  notAreaSchemaJson: any; //非区域json
  // area; //是否区域
  selectUserDataNotArea: any;
  selectUserDataIsArea: any;
  // 添加的数据
  tagGroupVO = {
    id: '',
    name: '',
    people: [],
  };
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
    //区域的json数据格式
    this.areaSchemaJson = {
      properties: {
        name: {
          type: 'string',
          title: '应急通知标签组名称',
          ui: {
            placeholder: '请输入',
            change: (ngModel:any) => {
              this.tagGroupVO.name = ngModel;
            },
          },
        },
        selectEmployeeIds: {
          type: 'string',
          title: '对应应急人员',
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
              this.i = this.sf.value;
              this.selectUser();
            },
          },
        },
      },
    };

    //判断是否编辑
    if (this.mode == 'edit') {
      console.log('data:', this.i);
      this.tagGroupVO.id = this.i.id;
      this.tagGroupVO.name = this.i.name;
      let tagEmployees:any = []; //用户数据
      let tagEmployeeIds:any = []; //用户id
      let tagGroup:any = []; //用户数据
      this.i.people.forEach(function (value:any, index:any, array:any) {
        tagGroup.push({ name: value.name, avatar: value.avatar, thirdPartyAccountId: value.thirdPartyAccountId });
        tagEmployees.push({ title: value.name, key: value.thirdPartyAccountId, category: value.category, icon: value.avatar });
        tagEmployeeIds.push(value.thirdPartyAccountId);
      });
      this.tagGroupVO.people = tagGroup;
      this.selectUserDataIsArea = tagEmployees;
      this.sf.refreshSchema(this.areaSchemaJson);
      this.areaSchemaJson.properties.selectEmployeeIds.enum = tagEmployees;
      this.areaSchemaJson.properties.selectEmployeeIds.default = tagEmployeeIds;
      this.sf.refreshSchema();
    } else {
      // this.area = true;
      //默认加载区域的
      this.sf.refreshSchema(this.areaSchemaJson);
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

  selectUser() {
    //如果编辑窗口、就把区域或非区域对应的人信息赋值到控件中
    let selectedItems :any= [];
    if (this.mode == 'edit') {
      console.log(this.selectUserDataIsArea);
      if (this.selectUserDataIsArea != null) {
        let objArea:any = {};
        this.selectUserDataIsArea.map((item:any) => {
          objArea = item;
          objArea['thirdPartyAccountUserId'] = item['key'];
          objArea['name'] = item['title'];
          // delete objArea['key'];
          // delete objArea['title'];
          selectedItems.push(objArea);
        });
      } else if (this.selectUserDataNotArea != null) {
        let obj :any= {};
        this.selectUserDataNotArea.map((item:any) => {
          obj = item;
          obj['thirdPartyAccountUserId'] = item['key'];
          obj['name'] = item['title'];
          // delete obj['key'];
          // delete obj['title'];
          selectedItems.push(obj);
        });
      }
    }
    let mode = ['employee'];
    this.modal.createStatic(SetupContactSelectComponent, { selectedItems: selectedItems, mode: mode }).subscribe((res) => {
      let tagEmployees:any = []; //选中的用户数据
      let tagEmployeeIds:any = []; //选中的用户id
      let tagOrganizationIds = []; //选中的部门id
      let tagGroup:any = []; //选中的用户数据

      console.log('res：', res);
      res.selectedItems.forEach(function (value:any, index:any, array:any) {
        tagGroup.push({ name: value.name, avatar: value.icon, thirdPartyAccountId: value.thirdPartyAccountUserId });
        tagEmployees.push({ title: value.name, key: value.thirdPartyAccountUserId, category: value.category, icon: value.icon });
        tagEmployeeIds.push(value.thirdPartyAccountUserId);
      });
      this.tagGroupVO.people = tagGroup;
      this.i.selectEmployeeIds = tagEmployeeIds;
      this.selectUserDataIsArea = tagEmployees;
      this.areaSchemaJson.properties.selectEmployeeIds.enum = tagEmployees;
      this.areaSchemaJson.properties.selectEmployeeIds.default = tagEmployeeIds;
      this.sf.refreshSchema();
      Object.assign(this.i, this.sf.value);
    });
  }

  save(value: any):any {
    // delete value.selectLinesAndStation;
    // if (value.selectEmployeeIds != null) {
    let selectEmployeeIds = value.selectEmployeeIds.toString();
    let selectEmployee = this.tagGroupVO.people.filter((item:any) => {
      return selectEmployeeIds.includes(item.thirdPartyAccountId);
    });
    this.tagGroupVO.people = selectEmployee;
    // }
    console.log(this.tagGroupVO);
    if (this.mode == 'edit') {
      this.http.post(`/service/emergency-base-config/admin/adminTagGroupApi/update`, this.tagGroupVO).subscribe((res) => {
        if (res.success) {
          this.msgSrv.success('更新标签成功');
          this.modalRef.close(true);
        } else {
          this.msgSrv.error('保存标签报错,检查数据!');
        }
      });
    } else {
      this.http.post(`/service/emergency-base-config/admin/adminTagGroupApi/add`, this.tagGroupVO).subscribe((res) => {
        if (res.success) {
          this.msgSrv.success('保存标签成功');
          this.modalRef.close(true);
        } else {
          this.msgSrv.error('保存标签报错,检查数据!');
        }
      });
    }
  }

  close() {
    this.modalRef.destroy();
  }
}
