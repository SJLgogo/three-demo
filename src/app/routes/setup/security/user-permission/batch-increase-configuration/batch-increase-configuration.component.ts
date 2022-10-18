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
import {STChange, STClickRowClassNameType, STColumn, STComponent} from '@delon/abc/st';
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
  confirmModal?: NzModalRef; // For testing by now
  @Input() role: any;
  userId: string = '';
  @Output() permission = new EventEmitter<string>();
  //获取角色下的人信息
  url = `/org/service/organization/admin/account/getUserIdsByRole`;
  @ViewChild('sf', {static: false}) sf!: SFComponent;

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
    {title: '选择',render: 'checkedTrue', width: '60px'},
    {title: '名称', index: 'thirdPartyName', width: 100},
    {title: '登陆账号', index: 'account', width: 100},
    {title: '邮箱', index: 'user.email', width: 100},
    {title: '手机号', index: 'mobilePhone', width: 100},
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
    // this.st.req.body = {id: this.role.id}; // 给body赋值
    // this.st.reload();
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
    // console.log('点击进来:', this.role);
    // this.customRequest.body = {
    //   roleId: this.role.id,
    // };
    // this.st.reload({roleId:this.role.id});
    this.reloadTable();
  }

  /**
   * 刷新表格数据
   */
  reloadTable() {
    if (this.role.index === 1) {
      // this.st.reload(this.customRequest.body);
      this.st.req.body = {roleId: this.role.id}; // 给body赋值
      this.st.reload();
    }
  }

  selectChange:any=[];
  clickContent(e: any): void {
    if(e.target){
      console.log(e.target,'ASWQ',e.target.value);
      this.selectChange.push(e.target.value);
      console.log(this.selectChange,'SDFGHJK');
    }

    // if (e.checkbox) {
    //   this.selcectAll = e.checkbox.map((item: any) => item.id);
    //   console.log(this.selcectAll,'AA');
    // }
  }


  dataProcess(data: any): any {
    console.log(data, 'ASDFGHJKL');
    return data.map((i: any, index: any) => {
      if (index === 1) i.checked = true;
      return i;
    });
  }
}
