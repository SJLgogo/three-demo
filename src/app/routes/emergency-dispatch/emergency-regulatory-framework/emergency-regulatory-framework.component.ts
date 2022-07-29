import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STColumnButton } from '@delon/abc/st';
import {
  SFComponent,
  SFSchema,
  SFStringWidgetSchema,
  SFSelectWidgetSchema,
  SFDateWidgetSchema,
  SFRadioWidgetSchema,
  SFUISchema,
} from '@delon/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timeout } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { dateTimePickerUtil } from '@delon/util';
import {Base} from "../../../api/common/base";
export interface TreeNodeInterface {
  id: string;
  name: string;
  level?: number;
  expand?: boolean;
  child?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
@Component({
  selector: 'app-emergency-dispatch-emergency-regulatory-framework',
  templateUrl: './emergency-regulatory-framework.component.html',
  styleUrls: [],
})
export class emergencyDispatchEmergencyRegulatoryFramework extends Base implements OnInit {
  constructor(
    private nzMessageService: NzMessageService,
    private fb: FormBuilder,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
  ) {
    super();
  }
  // 添加数据
  dto:any = {
    createdBy: '',
    createdDate: '',
    id: '',
    isDel: -1,
    lastModifiedBy: '',
    lastModifiedDate: '',
    level: null,
    name: '',
    parentId: '',
    parentName: '',
    remark: '',
    version: 0,
  };
  // 查询数据
  emergencyPlanCategoryQuery = {
    categoryName: '',
    level: 0,
    page: 0,
    pageSize: 1000,
    typeName: '',
  };
  validateForm: FormGroup | any;
  showModalLabel = '规章制度类型';
  title = ''; //标题
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      frameworkType: {
        type: 'string',
        title: '规章制度类型',
        ui: {
          placeholder: '请输入',
          change: (ngModel:any) => {
            this.emergencyPlanCategoryQuery.categoryName = ngModel;
          },
        },
      },
      frameworkCategory: {
        type: 'string',
        title: '二级分类',
        ui: {
          placeholder: '请输入',
          change: (ngModel:any) => {
            this.emergencyPlanCategoryQuery.typeName = ngModel;
          },
        },
      },
    },
  };
  listOfMapData: any = [
    // {
    //   id: '1',
    //   name: 'John Brown sr',
    // },
    // {
    //   id: '2',
    //   name: 'Joe Black',
    // }
  ];
  mapOfExpandedData:any = {};


  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.child) {
        data.child.forEach((d) => {
          const target = array.find((a) => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.child) {
        for (let i = node.child.length - 1; i >= 0; i--) {
          stack.push({ ...node.child[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  ngOnInit(): void {
    this.findAllData();
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  //对话框
  isVisible = false;
  showModal(data:any, num:any): void {
    if (num == 0) {
      this.title = '新增';
      if (data == null) {
        this.showModalLabel = '规章制度类型';
        this.dto.level = 1;
        this.dto.createdDate = dateTimePickerUtil.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.getLocalStorage();
      } else if (data.level == 0) {
        this.showModalLabel = '二级分类';
        this.dto.level = 2;
        this.dto.parentId = data.id;
        this.dto.parentName = data.name;
        this.dto.createdDate = dateTimePickerUtil.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.getLocalStorage();
      } else if (data.level == 1) {
        this.showModalLabel = '三级分类';
        this.dto.level = 3;
        this.dto.parentId = data.id;
        this.dto.parentName = data.name;
        this.dto.createdDate = dateTimePickerUtil.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.getLocalStorage();
      }
    } else if (num == 1) {
      this.title = '编辑';
      if (data.level == 0) {
        this.showModalLabel = '规章制度类型';
        this.getLocalStorage();
      } else if (data.level == 1) {
        this.showModalLabel = '二级分类';
        this.getLocalStorage();
      } else if (data.level == 2) {
        this.showModalLabel = '三级分类';
      }
      this.dto.name = data.name;
      this.dto.createdBy = data.createdBy;
      this.dto.createdDate = data.createdDate;
      this.dto.id = data.id;
      this.dto.isDel = data.isDel;
      this.dto.lastModifiedDate = dateTimePickerUtil.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.dto.level = data.level + 1;
      this.dto.parentId = data.parentId;
      this.dto.parentName = data.parentName;
      this.dto.remark = data.remark;
    }
    this.isVisible = true;
  }
  //保存
  handleOk(title:any): void {
    console.log('Button ok clicked!');
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm.value.name);
    if (this.validateForm.value.name == null) {
    } else {
      if (title == '新增') {
        this.add();
      } else {
        this.update();
      }
      this.isVisible = false;
    }
  }
  //取消
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.dto = {
      createdBy: '',
      createdDate: '',
      id: '',
      isDel: -1,
      lastModifiedBy: '',
      lastModifiedDate: '',
      level: null,
      name: '',
      parentId: '',
      parentName: '',
      remark: '',
      version: 0,
    };
  }

  //删除取消
  cancel(): void {
    this.nzMessageService.info('取消删除');
  }
  //删除确定
  confirm(id:any): void {
    this.delete(id);
    // this.nzMessageService.info('删除成功');
  }

  /* 获取列表数据 */
  findAllData() {
    this.http
      .post(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/findAllTree`, this.emergencyPlanCategoryQuery)
      .subscribe((res) => {
        if (res.success) {
          this.listOfMapData = res.data.content;
          this.listOfMapData.forEach((item:any) => {
            this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
          });
        }
      });
  }

  // 新增类型
  add() {
    this.http.post(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/add`, this.dto).subscribe((res) => {
      if (res.success) {
        this.messageService.success('保存成功');
        this.findAllData();
        this.dto = {
          createdBy: '',
          createdDate: '',
          id: '',
          isDel: -1,
          lastModifiedBy: '',
          lastModifiedDate: '',
          level: null,
          name: '',
          parentId: '',
          parentName: '',
          remark: '',
          version: 0,
        };
      }
    });
  }

  // 修改类型
  update() {
    this.http.post(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/update`, this.dto).subscribe((res) => {
      if (res.success) {
        this.messageService.success('修改成功');
        this.findAllData();
        this.dto = {
          createdBy: '',
          createdDate: '',
          id: '',
          isDel: -1,
          lastModifiedBy: '',
          lastModifiedDate: '',
          level: null,
          name: '',
          parentId: '',
          parentName: '',
          remark: '',
          version: 0,
        };
      }
    });
  }

  // 修改类型
  delete(id:any) {
    this.http.get(`/service/emergency-base-config/admin/adminEmergencyPlanFileCategoryApi/delete/` + id).subscribe((res) => {
      if (res.success) {
        this.messageService.success('删除成功');
        this.findAllData();
      }
    });
  }

  getLocalStorage() {
    let value = JSON.parse(<string>window.localStorage.getItem('employee'));
    this.dto.lastModifiedBy = value.thirdPartyAccountUserId;
    this.dto.createdBy = value.employeeName;
  }

  /* 表单重置 */
  resetSearch(e:any) {
    this.sf.reset(true);
    this.emergencyPlanCategoryQuery.categoryName = '';
    this.emergencyPlanCategoryQuery.typeName = '';
    this.findAllData();
  }
}
