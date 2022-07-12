import {Component, OnInit} from '@angular/core';
import {NzFormatEmitEvent} from "ng-zorro-antd/tree";
import {_HttpClient, ModalHelper} from "@delon/theme";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {DepartmentInterface, fn, TreeNode} from "./department.interface";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.less']
})
export class DepartmentComponent extends DepartmentInterface implements OnInit {

  constructor(
    public http: _HttpClient,
    private modal: ModalHelper,
    private modalRef: NzModalRef,
    private msgSrv: NzModalService,
  ) {
    super()
  }

  orgTreeLoading = true
  orgNodes: TreeNode[] = [];
  activeNode: any; // 编译报错补充，未测试
  initList: fn[] = [this.loadOrgTree]

  ngOnInit(): void {
    // Promise.all()
  }

  orgEvent(event: NzFormatEmitEvent): void {

  }


  loadOrgTree(): void {
    this.orgTreeLoading = true;
    this.http.get(`/service/support/admin/outsourceApi/findChildTree`).subscribe((res) => {
      if (res.success) {
        this.orgNodes = res.data;
        this.orgTreeLoading = false;
      } else {
        this.orgTreeLoading = false;
        this.msgSrv.warning(res.message);
      }
    });
  }

}
