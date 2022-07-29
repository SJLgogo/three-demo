import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient, ModalHelper, SettingsService} from '@delon/theme';
import {STColumn, STComponent} from '@delon/abc/st';
import {SFComponent, SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {EmergencyDispatchSceneTagEditComponent} from './scene-tag/edit.component';
import {EmergencyDispatchGoodsTagEditComponent} from './goods-tag/edit.component';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ActivatedRoute, Params} from '@angular/router';
import {EmergencyDispatchEmergencyGoodsEditComponent} from './edit/edit.component';
import {Base} from "../../../api/common/base";

interface ItemData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-emergency-dispatch-emergency-goods-manage',
  templateUrl: './emergency-goods-manage.component.html',
  styleUrls: ['./emergency-goods-manage.css', './emergency-goods-managen.component.less'],
})
export class EmergencyDispatchEmergencyGoodsManage extends Base implements OnInit, AfterViewInit {
  url = `/service/supplies-system/admin/SuppliesAdminApi/searchSuppliesListQuery`;
  tagList = [];
  goodsChildrenVisible: boolean = false;
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public settingsService: SettingsService,
    private msgSrv: NzMessageService,
    private route: ActivatedRoute,
    private messageService: NzMessageService,
  ) {
    super();
  }
  chooseGoods = {
    matName: undefined,
    matSpec: undefined,
    matUnit: undefined,
    residueCount: undefined,
    id: undefined,
  };
  // JSON.parse(<string>localStorage.getItem('employee')).thirdPartyAccountUserId
  employeeId = '';
  // JSON.parse(<string>localStorage.getItem('employee')).employeeName
  employeeName ='';
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      matName: {
        type: 'string',
        title: '物资名称',
      },
      sceneTagName: {
        type: 'string',
        title: '物资使用场景标签',
        enum: this.tagList,
        ui: {
          widget: 'select',
          placeholder: '请输入',
          width: 270,
        } as SFSelectWidgetSchema,
      },
    },
  };

  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '物资名称', width: 135, index: 'matName' },
    {
      title: '物资使用场景标签',
      width: 150,
      index: 'suppliesSceneTagVOS',
      // @ts-ignore
      format: (item: any, col: any) => {
        const arr = [];
        if (item.suppliesSceneTagVOS && item.suppliesSceneTagVOS.length > 0) {
          for (const suppliesSceneTagVO of item.suppliesSceneTagVOS) {
            arr.push(suppliesSceneTagVO.tagName);
          }
          return arr.toString();
        }
      },
    },
    { title: '规格型号', width: 150, index: 'matSpec' },
    { title: '单位', width: 120, index: 'matUnit' },
    {
      title: '操作',
      width: 170,
      buttons: [
        {
          text: '绑定标签',
          type: 'link',
          click: (record) => {
            this.openGoodsTag(record);
          },
        },
        {
          text: '编辑',
          type: 'link',
          click: (record) => {
            this.editGood(record);
          },
        },
        {
          text: '分配',
          type: 'link',
          click: (record) => {
            this.deployment(record);
          },
        },
      ],
    },
  ];

  deploymentList: { title: string; val: string }[] = [
    { title: '已选物资', val: '沙袋' },
    { title: '物资库存', val: '100' },
    { title: '保管人员', val: '王芳' },
    { title: '联系电话', val: '153252531' },
  ];
  woreHouseDetailData: any[] = [];
  provisioningSettings: ProvisioningSettingItem[] = [{ count: 0, warehouseId: '', remark: '' }];
  totalProvisioningCount:number = 0;
  woreHouseId: string | undefined;
  suppliesId: string | undefined;
  aimList: SelectItem[] = [];
  page = 0;
  totalPage = 0;
  totalPageSize = 0;
  /* 打开配置场景标签页面 */
  openSceneTag(): void {
    this.modal.createStatic(EmergencyDispatchSceneTagEditComponent).subscribe(() => this.st.reload());
  }
  /* 打开配置场景标签页面 */
  openGoodsTag(record:any): void {
    this.modal.createStatic(EmergencyDispatchGoodsTagEditComponent, { i: record }).subscribe(() => this.st.reload());
  }

  ngOnInit() {
    this.getAllGoodCategory();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['storeName']) {
        this.sf.setValue('matSpec', params['storeName']);
        this.sf.refreshSchema();
        this.st.reload();
      }
    });
  }

  getAllGoodCategory() {
    this.http.get(`/service/supplies-system/admin/SuppliesSceneTagAdminApi/getSuppliesSceneTagList`).subscribe((res) => {
      if (res.success) {
        const data:any = [];
        res.data.forEach((item:any) => {
          data.push({ label: item.tagName, value: item.tagName });
        });
        this.tagList = data;
        // @ts-ignore
        this.searchSchema.properties.sceneTagName.enum = this.tagList;
        this.sf.refreshSchema();
      }
    });
  }

  fromSearch() {
    console.log(this.sf);
    this.st.reload(this.sf.value);
  }

  resetSearch() {
    this.sf.reset(true);
    this.st.reset({});
  }

  goodsCloseDrawer(str: string): void {
    this.showOrClose(str);
  }

  showOrClose(str: string): void {
    // @ts-ignore
    this[str] = !this[str];
  }

  wareHouseDetail(): void {
    const postData = { page: this.page, pageSize: 10 };
    this.http
      .post(`/service/supplies-system/admin/SuppliesDistributionAdminApi/getSuppliesListByWarehouseId/${this.woreHouseId}`, postData)
      .subscribe((res) => {
        this.woreHouseDetailData = res.data.content;
        this.woreHouseDetailData.forEach((item:any) => {
          item.totalNum = item.originalCount + item.inCount - item.outCount;
          item.suppliesScenes = item.suppliesSceneTagVOS.length > 0 ? item.suppliesSceneTagVOS.map((i:any) => i.tagName).join(',') : '无';
        });
        this.totalPage = res.data.totalPages;
        this.totalPageSize = res.data.totalElements;
      });
  }

  // 调配操作
  deployment(data: any): void {
    console.log(data);
    this.chooseGoods = data;
    // this.totalProvisioningCount = this.chooseGoods.residueCount;
    this.showOrClose('goodsChildrenVisible');
    this.deploymentListObtain();
  }

  deploymentListObtain(): void {
    this.http.get('/service/supplies-system/admin/suppliesWarehouseAdminApi/getWarehouseAllList').subscribe((res) => {
      this.aimList = res.data
        .map((item:any) => {
          return { label: item.name, value: item.id };
        })
        .filter((item:any) => item.value != this.woreHouseId);
    });
  }

  newProvision(): void {
    this.provisioningSettings.push({ count: 0, warehouseId: '', remark: '' });
    this.calculateTotal();
  }

  delProvision(idx: number): void {
    if (this.provisioningSettings.length === 1) {
      return;
    }
    this.provisioningSettings.splice(idx, 1);
    // this.calculateTotal();
  }

  delShow(): string {
    return this.provisioningSettings.length === 1 ? 'none' : '';
  }

  calculateTotal(): void {
    queueMicrotask(() => {
      // @ts-ignore
      this.totalProvisioningCount = this.provisioningSettings.reduce((pre:any, cur:any) => {
        return pre - cur.count;
      }, this.chooseGoods.residueCount);
    });
  }

  delGoodsChildrenVisible(): void {
    this.goodsChildrenVisible = !this.goodsChildrenVisible;
    this.wareHouseDetail();
    this.provisioningSettings = [];
    this.st.reset();
  }

  initiateDeployment(): void {
    const postData: any = {};
    const suppliesVOS = [];
    for (let i = 0; i < this.provisioningSettings.length; i++) {
      if (this.provisioningSettings[i].count === 0) {
        this.msgSrv.warning('分配数量不能为0');
        return;
      }
      if (!this.provisioningSettings[i].count) {
        this.msgSrv.warning('分配数量不能为空');
        return;
      }
      if (!this.provisioningSettings[i].warehouseId) {
        this.msgSrv.warning('分配地点不能为空');
        return;
      }
      const obj = {
        id: this.chooseGoods.id,
        employeeId: this.employeeId,
        employeeName: this.employeeName,
        matCount: this.provisioningSettings[i].count,
        remarks: this.provisioningSettings[i].remark,
        suppliesWarehouseId: this.provisioningSettings[i].warehouseId,
      };
      suppliesVOS.push(obj);
    }
    // if (this.totalProvisioningCount < 0) {
    //   this.msgSrv.warning('分配数量超过可分配数量');
    //   return;
    // }
    postData.suppliesVOS = suppliesVOS;
    console.log(postData);
    this.http
      .post('/service/supplies-system/admin/suppliesWarehouseAdminApi/distributionSuppliesToWarehouse', postData)
      .subscribe((res) => {
        if (res.success) {
          this.msgSrv.success(res.message);
          this.delGoodsChildrenVisible();
        } else {
          this.msgSrv.error(res.message);
        }
      });
  }

  newGood(){
      this.modal.createStatic(EmergencyDispatchEmergencyGoodsEditComponent, {i: { id: '' }, mode:"add" }).subscribe(()=>{
        this.resetSearch();
      });
  }

  editGood(item:any){
    this.modal.createStatic(EmergencyDispatchEmergencyGoodsEditComponent, { i: item, mode:"edit" }).subscribe(()=>{
      this.resetSearch();
    });
  }
}

interface GoodsItem {
  coordinate: number[];
  count: number;
  picImg: string;
  name: string;
  paintPoint: number[];
  projectId?: string;
  metroLineId?: string;
  type: string;
  id: string;
  selected?: boolean;
}

interface SelectItem {
  label: string;
  value: string;
}

interface TabItem {
  name: string;
  id: string;
  checked: boolean;
  haveSupplies: boolean;
}

interface ProvisioningSettingItem {
  count: number;
  warehouseId: string;
  remark: string;
}
