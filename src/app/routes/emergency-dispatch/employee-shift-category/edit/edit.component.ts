import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFTimeWidgetSchema, SFUISchema } from '@delon/form';
import { environment } from '@env/environment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageData, NzMessageService, NzMessageServiceModule } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-emergency-dispatch-employee-shift-category-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmployeeShiftCategoryEditComponent implements OnInit {
  // schema: SFSchema = {
  //   properties: {
  //     category: { type: 'string', title: '班次类型名称', maxLength: 4 },
  //     isAcross: {
  //       type: 'number', title: '是否跨天', enum: [
  //         { label: '是', value: 1 },
  //         { label: '否', value: 0 },
  //       ],
  //       default: 0,
  //       ui: {
  //         widget: 'select',
  //         change: ngModel => {
  //         },
  //       },
  //     },
  //     startTime: {
  //       type: 'string',
  //       title: '开始时间',
  //       ui: { widget: 'time', format: `HH:mm:00` } as SFTimeWidgetSchema,
  //     },
  //     endTime: {
  //       type: 'string',
  //       title: '结束时间',
  //       ui: { widget: 'time', format: `HH:mm:00` } as SFTimeWidgetSchema,
  //     },
  //   },
  //   required: ['category', 'isAcross', 'startTime', 'endTime'],
  // };
  // ui: SFUISchema = {
  //   '*': {
  //     spanLabelFixed: 100,
  //     grid: { span: 12 },
  //   },
  //   $no: {
  //     widget: 'text',
  //   },
  //   $href: {
  //     widget: 'string',
  //   },
  //   $description: {
  //     widget: 'textarea',
  //     grid: { span: 24 },
  //   },
  // };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient, private fb: FormBuilder) {}
  record: any = {};
  i: any;
  editable: any = false;
  dateFormat = 'yyyy-MM-dd';
  timeFormat = 'HH:mm';
  isAcrossDefault = 'true';
  validFormat: any = true;

  validateForm: FormGroup | any;
  controlArray: Array<{ id: number; controlInstance: string }> = [];

  ngOnInit(): void {
    if (this.record.id > 0) this.http.get(`/user/${this.record.id}`).subscribe((res) => (this.i = res));

    this.validateForm = this.fb.group({});
    this.addField();

    // this.validateForm = this.fb.group({
    //   // id: [''],
    //   category: ['', [Validators.required]],
    // });
    this.validateForm.addControl('category', new FormControl(null, Validators.required));
  }

  /**
   * 时间换算成秒
   * @param time
   */
  // makeDurationToSeconds(time) {
  //   let str = time;
  //   let arr = str.split(':');
  //   let hs = parseInt(String(arr[0] * 3600));
  //   let ms = parseInt(String(arr[1] * 60));
  //   let ss = parseInt(arr[2]);
  //   let seconds = hs + ms + ss;
  //   return seconds;
  // }

  // save(value: any):any {
  //   console.log('value:', value);
  //   let startTimeSS = this.makeDurationToSeconds(value.startTime);
  //   let endTimeSS = this.makeDurationToSeconds(value.endTime);
  //   if (value.isAcross == false && startTimeSS > endTimeSS) {
  //     return this.msgSrv.error('上班时间必须大于下班时间！');
  //   }
  //
  //   this.http.get(`/service/emergency-dispatch/admin/adminShiftCategoryApi/getEmployeeShiftCategoryByName/` + value.category).subscribe(res => {
  //     console.log('res:', res);
  //     if (res.success) {
  //       if (res.data != null) {
  //         this.msgSrv.error('已经有' + value.category + '班次,不能重复,请重新录入！');
  //       } else {
  //         this.http.post(`/service/emergency-dispatch/admin/adminShiftCategoryApi/add`, value).subscribe(res => {
  //           this.msgSrv.success('保存班次成功');
  //           this.modal.close(true);
  //         });
  //       }
  //     } else {
  //       this.msgSrv.error('查询错误,请重试！');
  //     }
  //   });
  // }

  close() {
    this.modal.destroy();
  }

  addField(e?: MouseEvent): any {
    if (e) {
      e.preventDefault();
    }
    const id = this.controlArray.length > 0 ? this.controlArray[this.controlArray.length - 1].id + 1 : 0;
    if (id > 2) {
      return this.msgSrv.error('最大只能添加3组时间！');
    }

    const control = {
      id,
      controlInstance: `${id}`,
    };
    const index = this.controlArray.push(control);
    console.log(this.controlArray[this.controlArray.length - 1]);
    this.validateForm.addControl('isAcross_' + this.controlArray[index - 1].controlInstance, new FormControl(null, Validators.required));
    this.validateForm.addControl('startTime_' + this.controlArray[index - 1].controlInstance, new FormControl(null, Validators.required));
    this.validateForm.addControl('endTime_' + this.controlArray[index - 1].controlInstance, new FormControl(null, Validators.required));
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.controlArray.length > 1) {
      const index = this.controlArray.indexOf(i);
      this.controlArray.splice(index, 1);
      console.log(this.controlArray);
      this.validateForm.removeControl('isAcross_' + i.controlInstance);
      this.validateForm.removeControl('startTime_' + i.controlInstance);
      this.validateForm.removeControl('endTime_' + i.controlInstance);
    }
  }

  getFormControl(name: string): AbstractControl {
    return this.validateForm.controls[name];
  }

  endTimeValid(endTime: Date, startTime: Date, isAcross:any,controlInstance:any): void {
    console.log(endTime && endTime.toTimeString());
    const dp = new DatePipe(navigator.language);
    const p = 'HH:mm'; //

    // @ts-ignore
    if (isAcross == 'false' && dp.transform(startTime, p) > dp.transform(endTime, p)) {
      this.msgSrv.error('结束时间要大于开始时间!');
      this.validateForm.controls['endTime_' + controlInstance].reset();
      this.validFormat = false;
    } else {
      this.validFormat = true;
    }
  }

  startTimeValid(startTime: Date, index: string, isAcross:any): void {
    const formData = this.validateForm.value;
    const dp = new DatePipe(navigator.language);
    const p = 'HH:mm';
    const endTimeIndex = Number(index) - 1;
    const endTimePrevious:any = dp.transform(formData['endTime_' + endTimeIndex], p);

    // console.log("endTimePrevious:",endTimePrevious);
    // console.log("index:",Number(index));
    // console.log("isAcross:",isAcross);

    // @ts-ignore
    if (Number(index) > 0 && isAcross == 'false' && endTimePrevious > dp.transform(startTime, p)) {
      this.msgSrv.error('开始时间要大于上一组的结束时间!');
      this.validFormat = false;
    } else {
      this.validFormat = true;
    }
  }

  submitForm():any {
    const formData = this.validateForm.value;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();

      // console.log('test2:', i);

      // if (i.includes('isAcross') && formData[i] == true) {
      //   // console.log('log:', formData[i]);
      //
      // }

      const dp = new DatePipe(navigator.language);
      const p = 'HH:mm'; //
      if (i.includes('startTime') || i.includes('endTime')) {
        formData[i] = dp.transform(formData[i], p);
      }
    }

    let workTimeArray = [];
    const id = this.controlArray.length > 0 ? this.controlArray[this.controlArray.length - 1].id + 1 : 0;
    for (let i = 0; i < id; i++) {
      if (formData['isAcross_' + i] == 'false') {
        if (formData['startTime_' + i] > formData['endTime_' + i]) {
          return this.msgSrv.error('第' + (i + 1) + '组时间开始时间要小于结束时间!');
        }
      }

      workTimeArray.push({
        isAcross: formData['isAcross_' + i],
        startTime: formData['startTime_' + i],
        endTime: formData['endTime_' + i],
      });
    }

    let employeeShiftCategory = { category: formData['category'], shiftCategoryAndWorkTimeDTOS: workTimeArray };

    console.log('employeeShiftCategory:', employeeShiftCategory);

    this.http
      .get(
        `/service/emergency-base-config/admin/adminShiftCategoryApi/getEmployeeShiftCategoryByName/` +
          formData.category,
      )
      .subscribe((res) => {
        console.log('res:', res);
        if (res.success) {
          if (res.data != null) {
            this.msgSrv.error('已经有' + formData.category + '班次,不能重复,请重新录入！');
          } else {
            this.http.post(`/service/emergency-base-config/admin/adminShiftCategoryApi/add`, employeeShiftCategory).subscribe((res) => {
              this.msgSrv.success('保存班次成功');
              this.modal.close(true);
            });
          }
        } else {
          this.msgSrv.error('查询错误,请重试！');
        }
      });

    console.log(formData);
  }
}
