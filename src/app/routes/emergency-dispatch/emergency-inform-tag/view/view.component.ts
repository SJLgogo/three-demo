import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-emergency-dispatch-emergency-inform-tag-view',
  templateUrl: './view.component.html',
})
export class EmergencyDispatchEmergencyTagInformViewComponent implements OnInit {
  record: any = {};
  i: any;

  constructor(private modal: NzModalRef, public msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    this.http.get(`/user/${this.record.id}`).subscribe((res) => (this.i = res));
  }

  close() {
    this.modal.destroy();
  }
}
