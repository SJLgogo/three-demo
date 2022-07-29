import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFSchemaEnumType, SFSelectWidgetSchema, SFTransferWidgetSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-schedule-machineSchedule-upload',
  templateUrl: './upload.component.html',
  styles: [],
})
export class ScheduleMachineScheduleUploadComponent implements OnInit {
  scheduleMachines:any = [];
  record: any = {};
  i: any;

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '换班选项',
        ui: {
          allowClear: true,
          widget: 'select',
          // asyncData: () => {
          //   return this.cityService.changeShiftsList(this.i.projectName).pipe(map(item => {
          //     this.scheduleMachines=item;
          //     const children = item.map(element => {
          //       return { label: element.name, value: element.name };
          //     });
          //     const properties: SFSchemaEnumType = [
          //       {
          //         label: '所有班次',
          //         group: true,
          //         children,
          //       },
          //     ];
          //     return properties;
          //   }));
          // },
        } as SFSelectWidgetSchema,
      },
    },
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150,
      grid: { span: 12 },
    },
  };
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) // private stationService: StationService,
  // private cityService: CityService,
  // private projectService: ProjectService,
  {}

  ngOnInit(): void {}

  save(value: any):any {
    const MachineClassScheduleDTO = {
      projectName: this.i.projectName,
      employeeName: this.i.name,
      machineClassName: this.i.className,
      day: this.i.index + 1,
      id: this.i.id,
      machineShiftId: null,
    };
    for (let j = 0; j < this.scheduleMachines.length; j++) {
      if (this.scheduleMachines[j].name === value.name) {
        MachineClassScheduleDTO.machineShiftId = this.scheduleMachines[j].id;
      }
    }
    // this.cityService.saveShifts(MachineClassScheduleDTO).subscribe(res => {
    //   this.msgSrv.success('保存成功');
    //   this.modal.close(true);
    // });
  }

  close() {
    this.modal.destroy();
  }
}
