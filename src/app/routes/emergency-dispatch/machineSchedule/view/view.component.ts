import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { SFComponent, SFSchema, SFSelectWidgetSchema, SFUISchema } from '@delon/form';
import * as dateFns from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import {SetupContactSelectComponent} from "../../../../shared/components/contact-select/contact-select.component";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-schedule-machineSchedule-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class ScheduleMachineScheduleViewComponent implements OnInit {
  record: any = {};
  dataSet: any[] = [];
  monthDays:any = [];
  weekDays:any = [];
  loading = false;
  className = '';
  title = '';
  shiftName = ''; // 班表名称
  selectDepartmentData: any; // 选中的部门数据
  total = 0;
  page = 1;
  pageSize = 20;

  searchData: any;

  projectClasses: any[] = [
    {
      label: '项目列表',
      group: true,
      children: [],
    },
  ];
  staticDayToChineseDay:any = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' };
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      departmentId: {
        type: 'string',
        title: '部门',
        // @ts-ignore
        enum: this.selectDepartmentData,
        ui: {
          widget: 'select',
          width: 250,
        } as SFSelectWidgetSchema,
      },
      range: {
        type: 'string',
        title: '',
        ui: {
          // spanLabelFixed: 10,
          // grid: { span: 1 },
          widget: 'range-input', // 自定义小部件的KEY
          change: () => {
            //调用选人控件
            this.selectDepartmentName();
          },
        },
      },
      date: {
        type: 'string',
        title: '月份',
        format: 'month',
      },
    },
    required: ['date'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 6 },
    },
  };

  constructor(
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}

  searchSchedule():any {
    // this.currentSize = 0;
    // this.className = '';
    // const post = _.cloneDeep(this.sf.value);
    // post.date = post.date + '-01';
    // this.loading = true;

    // this.dataSet = [{
    //   // 'projectName': '成都3号线2期、3期整线测试及质保项目',
    //   // 'className': '锦水河工班',
    //   // 'shiftContent': '白班1(10小时)08:00:00-19:00:00晚班1(13小时)19:00:00-08:00:00培训1(4小时)09:00:00-13:00:00',
    //   // 'classSize': 2,
    //   // 'show': true,
    //   'name': '吕仕新',
    //   'data': ['白1', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    //   'ids': ['2c90814a6efebe51016f5fd504fb57f8', '2c90814a6efebe51016f5fd504fc57f9', '2c90814a6efebe51016f5fd504fc57fa', '2c90814a6efebe51016f5fd504fc57fb', '2c90814a6efebe51016f5fd504fc57fc', '2c90814a6efebe51016f5fd504fc57fd', '2c90814a6efebe51016f5fd504fc57fe', '2c90814a6efebe51016f5fd504fc57ff', '2c90814a6efebe51016f5fd504fc5800', '2c90814a6efebe51016f5fd504fc5801', '2c90814a6efebe51016f5fd504fc5802', '2c90814a6efebe51016f5fd504fd5803', '2c90814a6efebe51016f5fd504fd5804', '2c90814a6efebe51016f5fd504fd5805', '2c90814a6efebe51016f5fd504fd5806', '2c90814a6efebe51016f5fd504fd5807', '2c90814a6efebe51016f5fd504fd5808', '2c90814a6efebe51016f5fd504fd5809', '2c90814a6efebe51016f5fd504fd580a', '2c90814a6efebe51016f5fd504fd580b', '2c90814a6efebe51016f5fd504fd580c', '2c90814a6efebe51016f5fd504fd580d', '2c90814a6efebe51016f5fd504fe580e', '2c90814a6efebe51016f5fd504fe580f', '2c90814a6efebe51016f5fd504fe5810', '2c90814a6efebe51016f5fd504fe5811', '2c90814a6efebe51016f5fd504fe5812', '2c90814a6efebe51016f5fd504fe5813', '2c90814a6efebe51016f5fd504fe5814', '2c90814a6efebe51016f5fd504fe5815', '2c90814a6efebe51016f5fd504fe5816'],
    // }, {
    //   // 'projectName': '成都3号线2期、3期整线测试及质保项目',
    //   // 'className': '锦水河工班',
    //   // 'shiftContent': '白班1(10小时)08:00:00-19:00:00晚班1(13小时)19:00:00-08:00:00培训1(4小时)09:00:00-13:00:00',
    //   // 'classSize': 2,
    //   // 'show': false,
    //   'name': '周维',
    //   'data': ['白1', null, null, null, null, '白1', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    //   'ids': ['2c90814a6efebe51016f5fd504fe5817', '2c90814a6efebe51016f5fd504fe5818', '2c90814a6efebe51016f5fd504ff5819', '2c90814a6efebe51016f5fd504ff581a', '2c90814a6efebe51016f5fd504ff581b', '2c90814a6efebe51016f5fd504ff581c', '2c90814a6efebe51016f5fd504ff581d', '2c90814a6efebe51016f5fd504ff581e', '2c90814a6efebe51016f5fd504ff581f', '2c90814a6efebe51016f5fd504ff5820', '2c90814a6efebe51016f5fd504ff5821', '2c90814a6efebe51016f5fd505005822', '2c90814a6efebe51016f5fd505005823', '2c90814a6efebe51016f5fd505005824', '2c90814a6efebe51016f5fd505005825', '2c90814a6efebe51016f5fd505005826', '2c90814a6efebe51016f5fd505005827', '2c90814a6efebe51016f5fd505005828', '2c90814a6efebe51016f5fd505005829', '2c90814a6efebe51016f5fd50500582a', '2c90814a6efebe51016f5fd50500582b', '2c90814a6efebe51016f5fd50500582c', '2c90814a6efebe51016f5fd50501582d', '2c90814a6efebe51016f5fd50501582e', '2c90814a6efebe51016f5fd50501582f', '2c90814a6efebe51016f5fd505015830', '2c90814a6efebe51016f5fd505015831', '2c90814a6efebe51016f5fd505015832', '2c90814a6efebe51016f5fd505015833', '2c90814a6efebe51016f5fd505015834', '2c90814a6efebe51016f5fd505015835'],
    // }];

    this.dynamicCreateTableHeader(this.sf.value['date']);
    if (!this.sf.value['date']) {
      return this.msgSrv.error('月份必填!');
    }
    const values = this.sf.value['date'].split('-');

    let departmentIds = [];
    console.log('departmentId:', this.sf.value['departmentId']);

    if (this.sf.value['departmentId']) {
      departmentIds = this.sf.value['departmentId'];
      this.http
        .get(`/service/emergency-base-config/admin/AdminShiftClassApi/getShiftName/` + values[0] + '/' + values[1] + '/' + departmentIds[0])
        .subscribe((res) => {
          // console.log("数据",res.data);
          this.shiftName = res.data;
        });
    } else {
      this.http
        .get(`/service/emergency-base-config/admin/AdminShiftClassApi/getShiftName/` + values[0] + '/' + values[1] + '/' + 'all')
        .subscribe((res) => {
          // console.log("数据",res.data);
          this.shiftName = res.data;
        });
    }

    // console.log("departmentId",this.sf.value['departmentId'][0]);
    this.http
      .post(`/service/emergency-base-config/admin/AdminShiftClassApi/findAllEmployeeShift`, {
        page: 0,
        pageSize: 20,
        departmentIds: departmentIds,
        workMonth: values[1],
        year: values[0],
      })
      .subscribe((res) => {
        console.log('数据', res.data);
        this.dataSet = res.data;
        // this.dataSet=this.res.
      });
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params:any) => {
      const employeeShiftFileId = params.employeeShiftFileId;
      const workMonth = params.workMonth;
      const year = params.year;
      if (employeeShiftFileId) {
        this.shiftName = params.shiftName;
        this.dynamicCreateTableHeader(year + '-' + workMonth);
        this.http
          .post(`/service/emergency-base-config/admin/AdminShiftClassApi/findAllEmployeeShift`, {
            employeeShiftFileId: employeeShiftFileId,
          })
          .subscribe((res) => {
            console.log('数据', res.data);
            this.dataSet = res.data;
          });
      }
    });
  }

  // 返回按钮
  back() {
    this.router.navigate(['../employee-shift'], { relativeTo: this.activeRoute }).then((res) => {
      console.log(res);
    });
  }

  dynamicCreateTableHeader(value: any) {
    if (value) {
      const values = value.split('-');
      const selectDate = new Date(values[0], values[1] - 1);
      const days = dateFns.getDaysInMonth(selectDate);
      const monthDays = Array.from({ length: days }, (v, k) => k + 1);
      this.monthDays = monthDays;
      this.weekDays = monthDays.map((item) => {
        const weekDay = dateFns.getISODay(new Date(values[0], values[1] - 1, item));
        return this.staticDayToChineseDay[weekDay];
      });
    }
  }

  // processScheduleData(data, shiftData) {
  //   const shiftContent = shiftData.map(item => {
  //     return `${item.name}(${item.effectiveWorkingHours}小时)${dateFns.format(item.startWorkTime, 'HH:mm:ss')}-${dateFns.format(item.endWorkTime, 'HH:mm:ss')}`;
  //   }).join('');
  //   const projectName = data[0].projectName;
  //   this.title = `${projectName} ${this.sf.value['date']}月排班表`;
  //   const classNames = [];
  //   data.forEach(item => {
  //     if (!classNames.includes(item.machineClassName)) {
  //       classNames.push(item.machineClassName);
  //     }
  //   });
  //   const result = [];
  //   classNames.forEach(item => {
  //     const classData = data.filter(element => {
  //       return element.machineClassName === item;
  //     });
  //
  //     const empNames = [];
  //     classData.forEach(element => {
  //       if (!empNames.includes(element.employeeName)) {
  //         empNames.push(element.employeeName);
  //       }
  //     });
  //     empNames.forEach((element, index) => {
  //       const empData = classData.filter(entry => entry.employeeName === element);
  //       const empScheduleData = empData.map(entry => entry.machineShiftShortName);
  //       const ids = empData.map(entry => entry.id);
  //       result.push({
  //         'projectName': projectName,
  //         'className': item,
  //         'shiftContent': shiftContent,
  //         'classSize': empNames.length,
  //         'show': index === 0,
  //         'name': element,
  //         'data': empScheduleData,
  //         'ids': ids,
  //       });
  //     });
  //   });
  //   return result;
  // }

  // modifyTable(projectName, shiftContent, className, name, index, id) {
  //   this.modal
  //     .createStatic(ScheduleMachineScheduleUploadComponent, {
  //       i: {
  //         projectName: projectName,
  //         shiftContent: shiftContent,
  //         className: className,
  //         name: name,
  //         index: index,
  //         id: id,
  //       },
  //     })
  //     .subscribe(() => this.searchSchedule());
  // }

  //选部门
  selectDepartmentName() {
    let mode = ['organization'];
    this.modal.createStatic(SetupContactSelectComponent, { selectedItems: [], mode: mode }).subscribe((res) => {
      let tagDepartmentId:any = []; //选中的部门数据
      let tagDepartmentNames = []; //选中的部门名称
      let tagDepartment:any = []; //选中的部门数据
      res.selectedItems.forEach(function (value:any, index:any, array:any) {
        tagDepartmentNames.push(value.name);
        tagDepartmentId.push(value.id);
        tagDepartment.push({ label: value.name, value: value.id });
      });
      if (tagDepartmentNames.length > 1) {
        this.msgSrv.error('不能同时选多个部门!');
      } else if (tagDepartmentNames.length == 1) {
        // this.sf.getProperty("departmentName").setValue(tagDepartmentNames[0],true);

        this.selectDepartmentData = tagDepartment;
        // console.log('tagEmployeeIds:', tagDepartment);
        // @ts-ignore
        this.searchSchema.properties.departmentId.enum = tagDepartment;
        // @ts-ignore
        this.searchSchema.properties.departmentId.default = tagDepartmentId[0];
        if (this.sf.value['date']) {
          // @ts-ignore
          this.searchSchema.properties.date.default = this.sf.value['date'];
        }
        console.log('data：', this.selectDepartmentData);
        this.sf.refreshSchema();
      }
    });
  }

  /**
   * 清空查询
   */
  reset() {
    // @ts-ignore
    this.searchSchema.properties.departmentId.enum = null;
    // @ts-ignore
    this.searchSchema.properties.departmentId.default = null;
    this.sf.reset();
    this.sf.refreshSchema();
  }
}
