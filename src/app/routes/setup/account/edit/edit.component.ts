/* eslint-disable */
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-setup-account-edit',
  templateUrl: './edit.component.html'
})
export class SetupAccountEditComponent implements OnInit {
  record: any = {};
  i: any;
  mode: any;
  attendanceGroupEmployeeData: any[] = []; // 考勤组人员信息

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      mobilePhone: { type: 'string', title: '手机号', format: 'mobile' },
      thirdPartyName: { type: 'string', title: '姓名' },
      password: { type: 'string', title: '密码' }
    },
    required: ['mobilePhone', 'thirdPartyName', 'password']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 }
    },
    $no: {
      widget: 'text'
    },
    $href: {
      widget: 'string'
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 }
    }
  };

  constructor(private modal: ModalHelper, private modalRef: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {
  }

  ngOnInit(): void {
    // if (this.record.id > 0) this.http.get(`/user/${this.record.id}`).subscribe((res) => (this.i = res));
  }


  save(value: any): void {
    let url = 'register';
    if (this.i.id) {
      url = 'update';
    }else {
      //注册的时候默认账号就是手机号
      value.account = value.mobilePhone;
    }
    this.http.post(`/org/service/organization/admin/account/` + url, value).subscribe((res) => {
      if (res.success) {
        this.msgSrv.success('保存成功');
        this.modalRef.close(true);
      } else {
        this.msgSrv.error(res.message);
      }
    });
  }

  selectUser(): void {
    console.log(this.mode);
    // 如果编辑窗口、就把区域或非区域对应的人信息赋值到控件中
    const selectedItems: any = [];
    // if (this.mode == 'edit') {
    //   let objArea = {};
    //   this.attendanceGroupEmployeeData.map(item => {
    //     objArea = item;
    //     objArea['id'] = item['key'];
    //     objArea['name'] = item['title'];
    //     delete objArea['key'];
    //     delete objArea['title'];
    //     selectedItems.push(objArea);
    //   });
    // }
    const mode = ['organization', 'post'];
    // this.modal
    //   .createStatic(SetupContactSelectComponent, {
    //     selectedItems: selectedItems,
    //     mode: mode
    //   })
    //   .subscribe((res) => {
    //     const tagEmployees: any = []; // 选中的用户数据
    //     const tagEmployeeIds: any = []; // 选中的用户id
    //
    //     // console.log('res：', res);
    //     res.selectedItems.forEach(function(value:any) {
    //       tagEmployees.push({ title: value.name, key: value.id, category: value.category });
    //       tagEmployeeIds.push(value.id);
    //     });
    //
    //     // console.log('tagEmployees:', tagEmployees);
    //
    //     // this.schema.properties.attendanceGroupEmployeeIds.enum = tagEmployees;
    //     // this.schema.properties.attendanceGroupEmployeeIds.default = tagEmployeeIds;
    //     this.attendanceGroupEmployeeData = tagEmployees;
    //     this.i.attendanceGroupEmployeeIds = tagEmployeeIds;
    //     this.sf.refreshSchema();
    //     Object.assign(this.i, this.sf.value);
    //   });
  }

  close() {
    this.modalRef.destroy();
  }
}
