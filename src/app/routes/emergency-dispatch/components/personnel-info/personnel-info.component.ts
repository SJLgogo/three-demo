import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Base } from '../../../../common/base';
import { EmergencyDispatchComponentsEditComponent } from './edit/edit.component';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'personnel-info',
  templateUrl: './personnel-info.component.html',
  styleUrls: ['./personnel-info.css'],
})
export class personnelInfoComponent extends Base implements OnInit {
  constructor(private http: _HttpClient, private modal: ModalHelper, private messageService: NzMessageService) {
    super();
  }
  @Input() personnelInfoData: any;
  editInfo: any = {};
  originData: any = {};
  changeEventCommandVO: any = {};
  editCommandDetail = true;
  changeDetail: any = {};

  deleteCommandUser() {
    this.personnelInfoData.delete = true;
  }
  addCheckUser() {
    this.modal.createStatic(EmergencyDispatchComponentsEditComponent, { i: {}, mode: 'add', isSingleSelect: true }).subscribe((value) => {
      this.editInfo.checkUsers = value.map((element: { icon: any; corpId: any; name: any; thirdPartyAccountUserId: any; }) => {
        return {
          avatar: element.icon,
          corpId: element.corpId,
          name: element.name,
          thirdPartyAccountUserId: element.thirdPartyAccountUserId,
        };
      });
      this.personnelInfoData.img = this.editInfo.checkUsers[0].avatar;
      this.personnelInfoData.name = this.editInfo.checkUsers[0].name;
      this.personnelInfoData.thirdPartyAccountUserId = this.editInfo.checkUsers[0].thirdPartyAccountUserId;
      this.changeEventCommandVO = this.editInfo.checkUsers[0];
      this.personnelInfoData.delete = false;
    });
  }
  edit() {
    this.personnelInfoData.isEdit = true;
    if (!this.personnelInfoData.name) {
      this.personnelInfoData.delete = true;
      this.originData.name = '';
    } else {
      this.originData.img = this.personnelInfoData.img;
      this.originData.name = this.personnelInfoData.name;
      this.originData.detail = this.personnelInfoData.detail;
      this.originData.thirdPartyAccountUserId = this.personnelInfoData.thirdPartyAccountUserId;
    }
    if (this.personnelInfoData.operationEmployeeId == this.personnelInfoData.thirdPartyAccountUserId) {
      this.editCommandDetail = false;
    }
    this.refresh(this.personnelInfoData.eventId);
  }

  cancelEdit() {
    this.personnelInfoData.img = this.originData.img;
    this.personnelInfoData.name = this.originData.name;
    this.personnelInfoData.detail = this.originData.detail;
    this.personnelInfoData.isEdit = false;
    this.personnelInfoData.delete = false;
    this.editCommandDetail = true;
  }

  confirm() {
    const postCfg = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    let url = `/service/emergency-event/wxcp/EventApi/change/onSiteCommand`;
    if (this.personnelInfoData.isDrill) {
      url = `/service/emergency-drill/admin/DrillApi/change/onSiteCommand`
    }
    if (
      this.personnelInfoData.thirdPartyAccountUserId != undefined &&
      this.originData.thirdPartyAccountUserId != this.personnelInfoData.thirdPartyAccountUserId
    ) {
      this.changeEventCommandVO.eventId = this.personnelInfoData.eventId;
      this.changeEventCommandVO.operationEmployeeId = this.personnelInfoData.operationEmployeeId;
      this.changeEventCommandVO.operationEmployeeName = this.personnelInfoData.operationEmployeeName;
      this.http.post(url, this.changeEventCommandVO).subscribe((res) => {
        if (res.success) {
          this.messageService.success('提示：更改成功');
          this.personnelInfoData.isEdit = false;
          this.refresh(this.personnelInfoData.eventId);
          this.originData = {};
        }
      });
    } else {
      this.messageService.warning('提示：未选择更改的应急指挥');
      this.personnelInfoData.img = this.originData.img;
      this.personnelInfoData.name = this.originData.name;
      this.personnelInfoData.isEdit = false;
      this.personnelInfoData.delete = false;
    }

    if (!this.editCommandDetail && this.originData.detail != this.personnelInfoData.detail) {
      this.changeDetail.eventId = this.personnelInfoData.eventId;
      this.changeDetail.content = this.personnelInfoData.detail;
      this.changeDetail.resources = '';
      this.changeDetail.onSiteCommandId = this.personnelInfoData.commandId;
      this.http.post(`/service/emergency-event/wxcp/EventApi/add/command/measure`, '', this.changeDetail, postCfg).subscribe((res) => {
        console.log(res);
        if (res.success) {
          this.messageService.success('提示：更改详情成功');
          this.editCommandDetail = true;
        }
      });
    } else {
      this.editCommandDetail = true;
    }
  }

  refresh(id: any) {
    this.http.get(`/service/emergency-event/wxcp/EventApi/getEventCommand/${id}`).subscribe((res) => {
      if (res.success && res.data != null) {
        this.personnelInfoData.commandId = res.data.id;
        this.personnelInfoData.detail = res.data.value;
      }
    });
  }

  ngAfterViewInit() {}

  ngOnInit() {}
}
