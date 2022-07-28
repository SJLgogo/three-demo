import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { environment } from '@env/environment';
import { EmergencyDispatchEmployeeShiftEditComponent } from './edit/edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { STColumn, STComponent } from '@delon/abc/st';
import {Base} from "../../../api/common/base";
import {SetupContactSelectComponent} from "../../../shared/components/contact-select/contact-select.component";
import {FileSaverService} from "ngx-filesaver";

@Component({
  selector: 'app-emergency-dispatch-employee-shift',
  templateUrl: './employee-shift.component.html',
})
export class EmergencyDispatchEmployeeShiftComponent extends Base implements OnInit {
  url = `/service/emergency-base-config/admin/AdminShiftClassApi/findAllShiftFilePage`;
  searchSchema: SFSchema = {
    properties: {
      shiftName: {
        type: 'string',
        title: '班表名称',
      },
      myOperate: {
        type: 'number',
        title: '是否查询我上传的班表',
        enum: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
        default: true,
        ui: {
          widget: 'select',
        },
      },
      thirdPartyAccountId: {
        type: 'string',
        default: JSON.parse(<string>localStorage.getItem('employee')).thirdPartyAccountUserId,
        ui: {
          hidden: true,
        },
      },
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '班表名称', index: 'shiftName' },
    { title: '关联部门', index: 'departmentName' },
    { title: '导入人员', index: 'operateEmployeeName' },
    { title: '导入时间', index: 'createdDate' },
    {
      title: '',
      buttons: [
        {
          text: '查看详情',
          click: (item: any) => {
            this.shiftDetail(item);
          },
        },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
        {
          text: '删除',
          icon: 'delete',
          type: 'del',
          click: (item: any) => {
            if (this.isPermission('emergency-shift:button:delete', this.settingsService.app['identifiers'])) {
              this.remove(item);
            } else {
              this.messageService.warning('对不起,你没有权限,请联系管理员!');
            }
          },
        },
      ],
    },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private activeRoute: ActivatedRoute,
    public settingsService: SettingsService,
    private fileSaverService: FileSaverService,
    private messageService: NzMessageService,
    private router: Router,
  ) {
    super();
  }

  //显示班表信息
  viewSchedule() {
    this.router.navigate(['../viewSchedule'], { relativeTo: this.activeRoute }).then((res) => {
      console.log(res);
    });
  }

  //显示班表详细信息
  shiftDetail(item:any) {
    this.router
      .navigate(['../viewSchedule'], {
        relativeTo: this.activeRoute,
        queryParams: {
          employeeShiftFileId: item.id,
          workMonth: item.workMonth,
          year: item.year,
          shiftName: item.shiftName,
        },
      })
      .then((res) => {
        console.log(res);
      });
  }

  data = {
    otherdata: 1,
    time: new Date(),
  };

  isDown = false;

  down():any {
    if (this.isDown) {
      return this.messageService.warning('不要重复点击下载,正在下载中。。。!');
    }
    this.isDown = true;
    let mode = ['organization'];
    this.modal.createStatic(SetupContactSelectComponent, { selectedItems: [], mode: mode }).subscribe((res) => {
      let tagOrganizationIds:any = []; //选中的部门id

      console.log('res：', res);
      res.selectedItems.forEach(function (value:any, index:any, array:any) {
        // tagEmployees.push({ title: value.name, key: value.id, category: value.category });
        tagOrganizationIds.push(value.id);
      });

      if (tagOrganizationIds.length > 1) {
        this.isDown = false;
        return this.messageService.error('不能同时选多个部门!');
      }
      console.log('tagEmployees:', tagOrganizationIds);

      return this.http
        .post(
          `/service/emergency-base-config/admin/adminShiftCategoryApi/export-shift-category-sheet`,
          { departmentId: tagOrganizationIds[0] },
          null,
          {
            observe: 'response',
            responseType: 'blob',
          },
        )
        .subscribe(
          (res) => {
            this.fileSaverService.save(res.body, '班表模板(3.19).xlsx');
            this.messageService.success('导出成功');
            this.isDown = false;
          },
          (error) => {
            console.log(error);
            this.messageService.error('导出失败');
            this.isDown = false;
          },
        );
    });
  }

  // downUrl=`${environment.WEB_URL}/assets/excel/班表模版.xlsx`;
  // downUrl = `${environment.WEB_URL}/assets/excel/班表模板(3.19).xlsx`;

  remove(record:any) {
    this.http
      .delete(`/service/emergency-base-config/admin/AdminShiftClassApi/delete/` + record.id)
      .subscribe((res) => {
        if (res.success) {
          this.messageService.success(res.message);
          this.st.reload();
        }
      });
  }

  ngOnInit() {}

  add() {
    this.modal.createStatic(EmergencyDispatchEmployeeShiftEditComponent, { i: { id: 0 } }).subscribe(() => this.st.reload());
  }
}
