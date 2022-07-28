import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';
import { STChange, STColumn, STComponent } from '@delon/abc/st';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-system-contact-tag-employee',
  templateUrl: './tag-employee.component.html',
})
export class SystemContactTagEmployeeComponent  implements OnInit {
  selectedEmployeeId = '';
  tagId = '';
  //表格
  url = `/service/contact/admin/employee/organization`;
  employeeTableRequest: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize',
    },
    params: {
      orgId: 'root',
      isRecursive: 'true',
    },
  };
  @ViewChild('st', { static: false }) st!: STComponent;

  columns: STColumn[] = [
    { title: '编号', index: 'id', type: 'radio' },
    { title: '头像', type: 'img', width: 60, index: 'wxAvatar' },
    { title: '姓名', index: 'name' },
    { title: '工号', index: 'wxUserId' },
    {
      title: '部门',
      index: 'orgInfo',
      format: (item: any) => {
        let pathName = '';
        for (let org of item.orgInfoList) {
          pathName = org.path + '\n';
        }
        return pathName;
      },
    },
    {
      title: '岗位',
      index: 'postInfo',
      format: (item: any) => {
        let postNames = '';
        for (let post of item.postInfoList) {
          postNames = post.name + '\n';
        }
        return postNames;
      },
    },
    {
      title: '职务',
      index: 'jobInfo',
      format: (item: any) => {
        let jobNames = '';
        for (let job of item.jobInfoList) {
          jobNames = job.name + '\n';
        }
        return jobNames;
      },
    },
    { title: '状态', index: 'employeeEnum', type: 'badge' },
  ];
  //表格
  constructor(private activeRoute: ActivatedRoute, private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {
  }

  ngOnInit(): void {
    console.log(this.tagId);
  }

  save() {
    let params = {
      employeeId: this.selectedEmployeeId,
      tagId: this.tagId,
    };
    this.http.post(`/service/contact/admin/tag/assign/employee`, params).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      }
    });
  }

  change(ret: STChange) {
    this.selectedEmployeeId = ret.radio.id;
  }

  close() {
    this.modal.destroy();
  }
}
