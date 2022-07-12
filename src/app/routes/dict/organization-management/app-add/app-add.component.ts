import {Component, OnInit, ViewChild} from '@angular/core';
import {SFComponent, SFSchema, SFUISchema} from "@delon/form";
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-app-add',
  templateUrl: './app-add.component.html',
  styleUrls: ['./app-add.component.less']
})
export class AppAddComponent implements OnInit {
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
  ) {
  }

  i: any;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '应用名称', maxLength: 100 },
      description: { type: 'string', title: '应用描述', maxLength: 140 }
    },
    required: ['name']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 }
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
      autosize: { minRows: 4, maxRows: 6 }
    }
  };


  ngOnInit(): void {
  }

  save(value: any): void {

  }

  close(): void {
    this.modal.destroy();
  }
}
