/* eslint-disable */
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {STClickRowClassNameType, STColumn, STComponent, STData} from '@delon/abc/st';
import {SFComponent, SFSchema} from '@delon/form';
import {_HttpClient, ModalHelper, SettingsService} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-batch-increase-configuration-component',
  templateUrl: './batch-increase-configuration.component.html',
})
export class BatchIncreaseConfigurationComponent implements AfterViewInit, OnChanges {
  record: any = {};
  dataAll = [];
  confirmModal?: NzModalRef; // For testing by now
  @Input() role: any;
  userId: string = '';
  @Output() permission = new EventEmitter<string>();
  //获取角色下的人信息
  url = `/org/service/organization/admin/account/getUserIdsByRole`;
  @ViewChild('sf', {static: false}) sf!: SFComponent;
  @ViewChild("increase") increase: any;
  //选中的按钮权限id
  checkedButtonPermissionIds: any = [];
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '用户名称',
      },
    },
  };
  @ViewChild('st', {static: false}) st!: STComponent;
  clickRowClassName: STClickRowClassNameType = {exclusive: true, fn: () => 'text-processing'};
  columns: STColumn[] = [
    {title: '选择', index: 'permissionId', type: 'checkbox', width: '60px'},
    {title: '名称', index: 'thirdPartyName', width: 100},
    {title: '登陆账号', index: 'account', width: 100},
    {title: '邮箱', index: 'user.email', width: 100},
    {title: '手机号', index: 'mobilePhone', width: 100},
    {title: '公司', index: 'companyName', width: 100},
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public settingsService: SettingsService,
    private messageService: NzMessageService,
    private nzModal: NzModalService,
  ) {
  }


  ngAfterViewInit(): void {
    // @ts-ignore
    this.increase.role = {id: this['i']['roleId']};
  }

  searchName() {
    this.st.req.body = {roleId: this.role.id}; // 给body赋值
    this.st.reload();
  }


  /**
   * 清空查询
   */
  reset() {
    this.sf.reset();
    this.sf.refreshSchema();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadTable();
  }

  /**
   * 刷新表格数据
   */
  reloadTable() {
    // if (this.role.index === 1) {
    //   // this.st.reload(this.customRequest.body);
    //   this.st.req.body = {roleId: this.role.id}; // 给body赋值
    //   this.st.reload();
    // }
  }


  // 数据前端再处理一次
  dataProcess = (data: STData[]): STData[] => {
    return data.map((i: any, index) => {
      if (this.checkedButtonPermissionIds != null && this.checkedButtonPermissionIds.includes(i.id)) {
        i.checked = true;
      }
      return i;
    });
  };

  // 表格点击事件
  permissionTableChange(e: any): void {
    let repetition: any = [];
    if (e.type === 'checkbox') {
      //点击一行的数据
      for (const permission of e.checkbox) {
        console.log(permission,'SWQAD');
        this.checkedButtonPermissionIds.push(permission.id);
      }
      repetition = Array.from(new Set(this.checkedButtonPermissionIds));
      this.increase.checkedButtonAll = repetition;
    }

  }


}
