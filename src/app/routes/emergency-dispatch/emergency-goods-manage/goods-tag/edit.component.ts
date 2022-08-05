import {AfterViewInit, Component, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {Base} from "../../../../common/base";

@Component({
  selector: 'app-emergency-dispatch-emergency-goods-tag-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchGoodsTagEditComponent extends Base implements OnInit, AfterViewInit {
  i: any;
  constructor(private modal: NzModalRef, private http: _HttpClient, private messageService: NzMessageService) {
    super();
  }
  listOfSelectedTag:any = [];
  tagList:any= [];
  ngOnInit(): void {
    this.getAllSceneTag();
    console.log(this.i);
    for (const ele of this.i.suppliesSceneTagVOS) {
      this.listOfSelectedTag.push(ele.id);
    }
  }

  ngAfterViewInit(): void {}

  getAllSceneTag() {
    this.http.get(`/service/supplies-system/admin/SuppliesSceneTagAdminApi/getSuppliesSceneTagList`).subscribe((res) => {
      if (res.success) {
        console.log(res.data);
        this.tagList = res.data;
      }
    });
  }

  bandTag() {
    console.log(this.listOfSelectedTag);
    const suppliesSceneTagVOS = [];
    for (const ele of this.listOfSelectedTag) {
      // @ts-ignore
      const index = this.tagList.findIndex((item) => item.id === ele);
      suppliesSceneTagVOS.push(this.tagList[index]);
    }
    const req = { suppliesId: this.i.id, suppliesSceneTagVOS };
    console.log(req);
    this.http.post(`/service/supplies-system/admin/SuppliesSceneTagAdminApi/bindSuppliesSceneTag`, req).subscribe((res) => {
      if (res.success) {
        this.modal.close(true);
      }
    });
  }

  cancel() {
    this.listOfSelectedTag = [];
    this.modal.close(true);
  }
}
