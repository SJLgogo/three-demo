import {Component, OnInit} from '@angular/core';
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-select-project-person',
  templateUrl: './select-project-person.component.html',
  styleUrls: ['./select-project-person.component.less']
})
export class SelectProjectPersonComponent implements OnInit {

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
  ) {
  }

  ngOnInit(): void {
  }


  close(): void {
    this.modal.destroy()
  }

  save(): void {
    this.modal.close(true)
  }

}
