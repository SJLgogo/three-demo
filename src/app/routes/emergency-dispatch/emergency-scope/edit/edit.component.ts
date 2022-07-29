import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFComponent, SFSchema, SFTreeSelectWidgetSchema, SFUISchema } from '@delon/form';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LineNetworkService } from '../../service/line-network.service';
import { DictionaryService } from '../../service/dictionary.service';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import {SetupContactSelectComponent} from "../../../../shared/components/contact-select/contact-select.component";

@Component({
  selector: 'app-emergency-dispatch-emergency-scope-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmergencyScopeEditComponent implements AfterViewInit {
  record: any = {};
  i: any;
  modalTitle = '';
  relevanceScope = [];
  checkScope = [];
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称', maxLength: 15 },
    },
    required: ['name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
  };
  @ViewChild('st', { static: false }) private st!: STComponent;
  relevanceScopeColumns: STColumn[] = [
    {
      title: '类型',
      index: 'type',
      width: 100,
      format: (item: any, col: STColumn, index: number) => {
        let category: any = '';
        if (item.type == 1) {
          category = '◇人员';
        } else {
          category = '◆部门';
        }
        return category;
      },
    },
    { title: '名称', index: 'name' },
  ];
  checkScopeColumns: STColumn[] = [
    {
      title: '类型',
      index: 'type',
      width: 100,
      format: (item: any, col: STColumn, index: number) => {
        console.log(item);
        let category: any = '';
        if (item.type == 1) {
          category = '◇人员';
        } else {
          category = '◆部门';
        }
        return category;
      },
    },
    { title: '名称', index: 'name' },
  ];

  constructor(
    private modalRef: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private lineNetworkService: LineNetworkService,
    private dictionaryService: DictionaryService,
    private modal: ModalHelper,
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    if (this.i.id == '') {
      this.modalTitle = '添加虚拟组织架构';
    } else {
      this.modalTitle = '编辑虚拟组织架构 [' + this.i.name + ']';
      console.log(this.i);
      this.relevanceScope = this.i.relevanceScopes;
      this.checkScope = this.i.checkScopes;
    }
  }

  selectUser(which:any) {
    //如果编辑窗口、就把对应的人信息赋值到控件中
    let selectedItems:any = [];
    if (this.i.id != '') {
      //编辑人员
      if (which == 1 && this.relevanceScope != null) {
        this.relevanceScope.map((item:any) => {
          let obj:any = {};
          if (item.type == 0) {
            //是组织
            obj['id'] = item['thirdId'];
            obj['category'] = 'organization';
          } else if (item.type == 1) {
            //是员工
            obj['id'] = item['employeeId'];
            obj['thirdPartyAccountUserId'] = item['thirdId'];
            obj['category'] = 'employee';
          }
          obj['corpId'] = item['corpId'];
          obj['companyName'] = item['name'].split('_')[0] + '_';
          obj['name'] = item['name'].split('_')[1];
          selectedItems.push(obj);
        });
      } else if (this.checkScope != null) {
        let obj = {};
        this.checkScope.map((item:any) => {
          let obj:any = {};
          if (item.type == 0) {
            //是组织
            obj['id'] = item['thirdId'];
            obj['category'] = 'organization';
          } else if (item.type == 1) {
            //是员工
            obj['id'] = item['employeeId'];
            obj['thirdPartyAccountUserId'] = item['thirdId'];
            obj['category'] = 'employee';
          }
          obj['corpId'] = item['corpId'];
          obj['companyName'] = item['name'].split('_')[0] + '_';
          obj['name'] = item['name'].split('_')[1];
          selectedItems.push(obj);
        });
      }
    }
    const mode = ['employee', 'organization'];
    this.modal.createStatic(SetupContactSelectComponent, { selectedItems: selectedItems, mode: mode }).subscribe((res) => {
      let Employees:any = []; //选中的用户数据
      console.log('res：', res);
      res.selectedItems.forEach(function (value:any, index:any, array:any) {
        if (value.category == 'employee') {
          Employees.push({
            name: value.companyName + value.name,
            corpId: value.corpId,
            employeeId: value.id,
            thirdId: value.thirdPartyAccountUserId,
            type: 1,
          });
        } else if (value.category == 'organization') {
          Employees.push({ name: value.companyName + '_' + value.name, corpId: value.corpId, thirdId: value.id, type: 0 });
        }
      });
      if (which == 1) {
        this.relevanceScope = Employees;
      } else {
        this.checkScope = Employees;
      }
    });
  }

  save(value: any):any {
    value.relevanceScopes = this.relevanceScope;
    value.checkScopes = this.checkScope;
    if (this.i.id == '') {
      console.log(value);
      this.http.post(`/service/emergency-base-config/admin/adminVirOrganizationApi/add`, value).subscribe((res) => {
        console.log(res);
        this.msgSrv.success('保存虚拟组织架构成功');
        this.modalRef.close(true);
      });
    } else {
      this.http.post(`/service/emergency-base-config/admin/adminVirOrganizationApi/change`, value).subscribe((res) => {
        this.msgSrv.success('保存虚拟组织架构成功');
        this.modalRef.close(true);
      });
    }
  }

  close() {
    this.modalRef.destroy();
  }
}
