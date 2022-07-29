import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { MessageService } from '../../service/message.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-emergency-dispatch-location-config-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchLocationConfigEditComponent implements OnInit {
  record: any = {};
  i: any;
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      scope: { type: 'number', title: '定位识别范围', maximum: 100000, minimum: 0, description: '只允许输入小于100000米以内正整数' },
      emergency: {
        type: 'number',
        title: '是否应急',
        enum: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
        default: true,
        ui: {
          widget: 'select',
        },
      },
    },
    required: ['scope'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $scope: {
      widget: 'number',
      unit: '米',
      class: 'customNumber',
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private messageService: MessageService, // private machineClassService: MachineClassService
  ) {}

  ngOnInit(): void {
    // if (this.record.id > 0) {
    //   this.machineClassService.findMachineClassById(this.record.id).subscribe(res => {
    //       this.i = res;
    //       if (this.i.lng && this.i.lat) {
    //         this.messageService.sendMessage({lng: this.i.lng, lat: this.i.lat, scope: this.i.scope});
    //       }
    //     }
    //   );
    // }
    // this.messageService.getMarkerMessage().subscribe(message => {
    //   this.i.address = message.address;
    //   this.i.lng = message.lng;
    //   this.i.lat = message.lat;
    //   this.sf.refreshSchema();
    // });
  }

  save(value: any):any {
    console.log(value);
    // this.machineClassService.saveMachineClass(value).subscribe(res => {
    //   this.msgSrv.success('保存成功');
    //   this.modal.close(true);
    // });

    this.http.post(`/service/emergency-base-config/admin/adminLocationConfigApi/add`, value).subscribe((res) => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close() {
    this.modal.destroy();
  }
}
