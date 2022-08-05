import { Component, OnInit, ViewChild } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { STColumn, STComponent, STColumnButton } from '@delon/abc/st';
import { SFComponent, SFSchema, SFSelectWidgetSchema, SFTreeSelectWidgetSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmergencyDispatchGoodsListComponent } from './goods-list/view.component';
import {Base} from "../../../common/base";
import {SetupContactSelectComponent} from "../../../shared/components/contact-select/contact-select.component";
interface ItemData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-emergency-dispatch-emergency-goods-store',
  templateUrl: './emergency-goods-store.component.html',
  styleUrls: ['./emergency-goods-store.css'],
})

export class EmergencyDispatchEmergencyGoodsStore extends Base implements OnInit {
  visible: boolean = false;
  edit: boolean = false;
  i = 0;
  a = 0;
  deployNumber = 0; //调配总数量
  isEdit: boolean = true;
  storeValue = '姑娘桥A仓';
  remarkValue = '车站A出口出应急品备件箱';
  requireValue = '';
  numberValue = 0;
  url = `/service/supplies-system/admin/suppliesWarehouseAdminApi/getWarehouseList`;
  sfLineIds = [];
  eventLevelData = [
    { label: '一级事件', value: 'one' },
    { label: '二级事件', value: 'two' },
    { label: '三级事件', value: 'three' },
  ];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  editStoreCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listOfData: ItemData[] = [
    { id: '0', name: '防汛使用物资' },
    { id: '1', name: '暴恐使用物资' },
    { id: '2', name: '医疗使用物资' },
    { id: '3', name: '防火使用物资' },
  ];

  storeData: ItemData[] = [
    { id: '0', name: '姑娘桥仓库A' },
    { id: '1', name: '姑娘桥仓库B' },
    { id: '2', name: '姑娘桥仓库C' },
    { id: '3', name: '姑娘桥仓库D' },
  ];
  /* 场景属性标签 */
  editTagList = [
    { label: '水灾抢险类', value: '0' },
    { label: '火灾抢险类', value: '1' },
    { label: '水灾抢险类2', value: '2' },
  ];
  deploySetData = [
    {
      number: '0',
      destination: [
        { label: '姑娘桥', value: '0' },
        { label: '姑娘桥2', value: '1' },
        { label: '姑娘桥3', value: '2' },
      ],
    },
    {
      number: '7',
      destination: [
        { label: '姑娘桥', value: '0' },
        { label: '姑娘桥2', value: '1' },
        { label: '姑娘桥3', value: '2' },
      ],
    },
  ];
  chooseWarehouse = [
    { label: '姑娘桥A仓1', value: '0' },
    { label: '姑娘桥A仓2', value: '1' },
    { label: '姑娘桥A仓3', value: '2' },
  ];
  editStoreId: any;
  resourceCategoryList: any;
  selectResourceCategory: any;
  selectStation: any;
  newStoreName: any;
  keepers:any= [];
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private router: Router,
    private msgSrv: NzMessageService,
    public settingsService: SettingsService,
    private activeRoute: ActivatedRoute,
    private messageService: NzMessageService,
  ) {
    super();
  }
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      warehouseName: {
        type: 'string',
        title: '应急物资仓库名称',
      },
      stationId: {
        type: 'string',
        title: '所属站点',
        ui: {
          widget: 'tree-select',
          multiple: false,
          placeholder: '请选择',
          width: 270,
          allowClear: true,
          dropdownStyle: { 'max-height': '500px' },
        } as SFTreeSelectWidgetSchema,
      },
    },
  };

  @ViewChild('st', { static: false }) st!: STComponent;
  columns: STColumn[] = [
    { title: '资源类别', width: 150, index: 'resourceCategoryName' },
    { title: '所属站点', width: 135, index: 'stationName' },
    { title: '仓库名称', width: 150, index: 'name' },
    { title: '包含应急物资种类数量', width: 135, index: 'suppliesCount' },
    {
      title: '保管人员',
      width: 120,
      index: 'suppliesWarehouseKeepers',
      // @ts-ignore
      format: (item: any, col: any) => {
        const arr = [];
        if (item.suppliesWarehouseKeepers.length > 0) {
          for (const ele of item.suppliesWarehouseKeepers) {
            arr.push(ele.employeeName);
          }
          return arr.toString();
        }
      },
    },
    {
      title: '操作',
      width: 170,
      buttons: [
        {
          text: '物资详情',
          type: 'link',
          click: (item) => {
            console.log(123);
            this.openGoodsTag(item.id);
          },
        },
        {
          text: '编辑',
          type: 'link',
          click: (item) => {
            this.editStore(item);
          },
        },
      ],
    },
  ];
  selectLineData:any = []; // 线路数据
  selectSiteData:any  = []; // 站点数据
  /* 加载所有线路数据 */
  loadLineData() {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/findAllLine`).subscribe((res) => {
      if (res.success) {
        this.selectLineData = res.data.map((element:any) => {
          return { title: element.name, key: element.id };
        });
        // @ts-ignore
        this.searchSchema.properties.stationId.enum = this.selectLineData;
        for (let i = 0; i < this.selectLineData.length; i++) {
          this.loadSiteData(this.selectLineData[i].key, i);
        }
        this.sf.refreshSchema();
      }
    });
  }
  /* 根据线路ID获取相应的站点信息 */
  loadSiteData(lineId:any , index:any ) {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/getAllStationsByLineIds/${lineId}`).subscribe((res) => {
      if (res.success) {
        this.selectSiteData = res.data.map((element:any) => {
          return { title: element.name, key: element.id, isLeaf: true };
        });
        this.selectLineData[index].children = this.selectSiteData;
        this.sf.refreshSchema();
      }
    });
  }

  openGoodsTag(id:any ): void {
    this.modal.createStatic(EmergencyDispatchGoodsListComponent, { i: id }).subscribe();
  }

  /* 获取资源类别 */
  getResourceCategoryList() {
    this.http.get(`/service/supplies-system/admin/SuppliesAdminApi/getSuppliesResourceCategoryList`).subscribe((res) => {
      if (res.success) {
        this.resourceCategoryList = res.data;
      }
    });
  }

  /* 添加电话通知人员 */
  selectedItems:any  = [];
  addUser() {
    const mode = ['employee'];
    this.modal
      .createStatic(SetupContactSelectComponent, { selectedItems: this.selectedItems, mode: mode, isSingleSelect: true })
      .subscribe((res) => {
        this.selectedItems = res.selectedItems;
        this.keepers = res.selectedItems.map((element:any) => {
          return {
            avatar: element.icon,
            name: element.name,
            employeeName: element.name,
            employeeId: element.thirdPartyAccountUserId,
          };
        });
        console.log(this.keepers);
      });
  }

  addNewStore() {
    if (!this.isNotBlank(this.newStoreName)) {
      this.msgSrv.warning('名称不能为空');
      return;
    } else if (!this.isNotBlank(this.selectResourceCategory)) {
      this.msgSrv.warning('请选择资源类型');
      return;
    } else if (!this.isNotBlank(this.selectStation)) {
      this.msgSrv.warning('选择站点不能为空');
      return;
    } else if (!this.keepers || this.keepers.length == 0) {
      this.msgSrv.warning('保管人员不能为空');
      return;
    } else {
      let stationName = '';
      for (const line of this.selectLineData) {
        const stations = line.children;
        stationName = stations.filter((ele:any ) => ele.key === this.selectStation)[0].title;
      }
      if (!this.isNotBlank(stationName)) {
        this.msgSrv.warning('请勿选择线路');
        return;
      }
      const postData = {
        keepers: this.keepers,
        name: this.newStoreName,
        resourceCategoryId: this.selectResourceCategory,
        resourceCategoryName: this.resourceCategoryList.filter((ele:any ) => ele.id == this.selectResourceCategory)[0].name,
        stationId: this.selectStation,
        stationName,
      };
      this.http.post(`/service/supplies-system/admin/suppliesWarehouseAdminApi/addSuppliesWarehouse`, postData).subscribe((res) => {
        if (res.success) {
          this.close();
        } else {
          this.messageService.error(res.message);
        }
      });
    }
  }

  updataStore() {
    if (!this.isNotBlank(this.selectResourceCategory)) {
      this.msgSrv.warning('请选择资源类型');
      return;
    } else if (!this.keepers || this.keepers.length == 0) {
      this.msgSrv.warning('保管人员不能为空');
      return;
    } else {
      const postData = {
        id: this.editStoreId,
        keepers: this.keepers,
        resourceCategoryId: this.selectResourceCategory,
        resourceCategoryName: this.resourceCategoryList.filter((ele:any ) => ele.id == this.selectResourceCategory)[0].name,
      };
      this.http.post(`/service/supplies-system/admin/suppliesWarehouseAdminApi/addSuppliesWarehouse`, postData).subscribe((res) => {
        if (res.success) {
          this.close();
        }
      });
    }
  }

  isNotBlank(val:any ) {
    if (val !== undefined && val != null && val !== '') {
      return true;
    } else {
      return false;
    }
  }

  /* 删除保管人员 */
  phoneDelete(i:any ) {
    this.keepers.splice(i, 1);
  }

  clearMsg() {
    this.keepers = [];
    this.selectResourceCategory = '';
    this.selectStation = '';
    this.newStoreName = '';
    this.selectedItems = [];
  }

  /* 打开配置仓库信息 */
  openStore() {
    this.visible = true;
  }

  editStore(item:any ) {
    this.editStoreId = item.id;
    this.newStoreName = item.name;
    this.selectStation = item.stationId;
    this.selectResourceCategory = item.resourceCategoryId;
    this.keepers = item.suppliesWarehouseKeepers;
    for (const keeper of this.keepers) {
      // @ts-ignore
      const obj = { thirdPartyAccountUserId: keeper.employeeId, name: keeper.employeeName };
      this.selectedItems.push(obj);
    }
    this.visible = true;
    this.edit = true;
  }

  close(): void {
    this.clearMsg();
    this.st.reset();
    this.edit = false;
    this.visible = false;
  }
  closeEdit(): void {
    this.edit = false;
    this.clearMsg();
    this.st.reset();
    this.visible = false;
  }
  /* 编辑仓库名称 */
  editStoreName() {
    this.isEdit = !this.isEdit;
  }

  fromSearch() {
    this.st.reload(this.sf.value);
  }

  resetSearch() {
    this.sf.reset();
    this.st.reset({});
  }

  confirm() {
    if (this.edit) {
      this.updataStore();
    } else {
      this.addNewStore();
    }
    // this.visible = false;
  }

  additem() {
    this.deploySetData.push({
      number: '0',
      destination: [
        { label: '姑娘桥', value: '0' },
        { label: '姑娘桥2', value: '1' },
        { label: '姑娘桥3', value: '2' },
      ],
    });
  }
  deleteItem(i:any ) {
    this.deploySetData.splice(i, 1);
  }
  onValueChange() {
    let count = 0;
    for (let i = 0; i < this.deploySetData.length; i++) {
      if (this.deploySetData[i].number.length == 0) {
        count += 0;
      } else {
        count += parseInt(this.deploySetData[i].number);
      }
    }
    this.deployNumber = count;
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false,
    };
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }
  deleteRow(id:any ) {
    this.listOfData = this.listOfData.filter((d) => d.id !== id);
  }
  addRow() {
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        name: `新的标签 ${this.i}`,
      },
    ];
    this.i++;
    this.updateEditCache();
  }
  ngOnInit() {
    this.loadLineData();
    this.i = this.listOfData.length;
    this.a = this.storeData.length;
    this.storeData.forEach((item) => {
      this.editStoreCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
    this.updateEditCache();
    this.onValueChange();
    this.getResourceCategoryList();
    console.log(this.keepers);
  }
}
