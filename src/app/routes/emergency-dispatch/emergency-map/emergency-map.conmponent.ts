import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormBuilder} from '@angular/forms';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {dateTimePickerUtil} from '@delon/util';
import {SFComponent, SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {EmergencyDispatchEmergencyMapEditComponent} from './edit/edit.component';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {STComponent} from '@delon/abc/st';
import {Base} from "../../../common/base";

declare var AMap: any;
declare var window: any;

interface ItemData {
  icon: '';
  name: '';
  phoneNumber: '';
  position: '';
  thirdPartyId: '';
}

@Component({
  selector: 'app-emergency-dispatch-emergency-map',
  templateUrl: './emergency-map.component.html',
  styleUrls: ['./emergency-map.component.less'],
})
export class EmergencyDispatchMapComponent extends Base implements OnInit {
  private thirdId: any;

  virOrgIds: any = [];
  switchValue = false;
  punchCard = false;
  watchOverCenterData = {
    id: '',
    name: '全部',
  };
  private punchCardList: any;
  workStationlist: any;
  workSectionlist: any;
  workStationChangeData: any;
  sectionPolylineDatas: any = [];
  onGoingEventList: any;
  selectEvent: any = {};
  @ViewChild('st') private readonly st!: STComponent;
  employeeName: any;

  constructor(
    private nzMessageService: NzMessageService,
    private fb: FormBuilder,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private cdr: ChangeDetectorRef,
    private messageService: NzMessageService,
    private NzNotificationService: NzNotificationService,
  ) {
    super();
  }

  private lng: any;
  private lat: any;
  private map: any;
  visible = false; // 物资抽屉
  childrenVisible = false; // 物资子抽屉
  groupVisible = false; // 工班详情抽屉
  addGroupVisible = false; // 新增工班抽屉
  goodsVisible = false;
  goodsChildrenVisible = false;
  // 当前时间
  nowDate = dateTimePickerUtil.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  nowDateWeather = dateTimePickerUtil.format(new Date(), 'yyyy-MM-dd');
  // 模式默认选择
  radioValue = 'emergencyPattern';
  punchCardValue = 'A';
  emergencyMarkerArr: any = []; // 应急模式点位
  goodsMarkerArr: any = []; // 物资模式点位
  gangMarkerArr: any = []; // 工班模式点位
  listMarkerArr: any = [];
  punchCardMarkerArr: any = []; // 打卡点位
  marker: any;
  text: any;
  // 某个调配数据
  deployData = {
    id: '',
    name: '',
    number: '',
    keeper: '',
    phone: '',
  };
  // 工班详情查询数据
  workShiftQuery = {
    page: 0,
    pageSize: 5,
    stationName: '',
    leaderName: '',
    name: '',
  };
  workShiftQueryForMap:any = {
    page: 0,
    pageSize: 0,
    stationName: '',
    leaderName: '',
    name: '',
  };
  // 某个工班列表数据
  groupListOfData: any = [];
  // 查询的站点数据
  groupListOfDataForMap: any = [];
  // 某个工班详情数据
  groupData = {
    detailAddress: '',
    id: '',
    leaderId: '',
    leaderName: '',
    lineId: '',
    lineName: '',
    name: '',
    phoneNumber: '',
    remark: '',
    stationId: '',
    stationName: '',
    talkieId: '',
    telPhoneNumber: '',
    updateUserId: '',
    updateUserName: '',
    employeeNumber: null,
  };
  // 坐标点列表
  emergencylist: any = [];
  totalProvisioningCount = 0;

  filterStationIds = new Set();
  goodsAttribute = '';
  goodsAttributeList: SelectItem[] = [];
  goodsList: GoodsItem[] = [
    // {
    //   coordinate: [120.489641, 30.082084],
    //   count: 1,
    //   picImg: this.stationGoodsImg(1),
    //   name: '中国轻纺城',
    //   paintPoint: [120.489641, 30.082084],
    //   projectId: '2c9180897955e3a901795969fd090011',
    //   type: 'goods',
    //   id: '1',
    // },
    // {
    //   coordinate: [120.479685, 30.087877],
    //   count: 1,
    //   picImg: this.stationGoodsImg(1),
    //   name: '越州大道',
    //   paintPoint: [120.479685, 30.087877],
    //   projectId: '2c9180897955e3a901795969fd090011',
    //   type: 'goods',
    //   id: '2',
    // },
    // {
    //   coordinate: [120.457069, 30.098682],
    //   count: 1,
    //   picImg: this.stationGoodsImg(1),
    //   name: '鉴水路',
    //   paintPoint: [120.457069, 30.098682],
    //   projectId: '2c9180897955e3a901795969fd090011',
    //   type: 'goods',
    //   id: '3',
    // },
    // {
    //   coordinate: [120.439473, 30.110971],
    //   count: 1,
    //   picImg: this.stationGoodsImg(1),
    //   name: '临航大道',
    //   paintPoint: [120.439473, 30.110971],
    //   projectId: '2c9180897955e3a90179596b71130018',
    //   type: 'goods',
    //   id: '4',
    // },
    // {
    //   coordinate: [120.424281, 30.118173],
    //   count: 1,
    //   picImg: this.stationGoodsImg(1),
    //   name: '西沙路',
    //   paintPoint: [120.424281, 30.118173],
    //   projectId: '2c9180897955e3a90179596cf45a001d',
    //   type: 'goods',
    //   id: '5',
    // },
    // {
    //   coordinate: [120.405978, 30.123333],
    //   count: 1,
    //   picImg: this.stationGoodsImg(1),
    //   name: '钱清',
    //   paintPoint: [120.405978, 30.123333],
    //   projectId: '2c9180897955e3a90179596cf45a001d',
    //   type: 'goods',
    //   id: '6',
    // },
    // {
    //   coordinate: [120.394289, 30.12399],
    //   count: 1,
    //   picImg: this.stationGoodsImg(1),
    //   name: '前梅',
    //   paintPoint: [120.394289, 30.12399],
    //   projectId: '2c9180897955e3a90179596d69c00020',
    //   type: 'goods',
    //   id: '7',
    // },
    // {
    //   coordinate: [120.365412, 30.144255],
    //   count: 1,
    //   picImg: this.stationGoodsImg(1),
    //   name: '杨讯桥',
    //   paintPoint: [120.365412, 30.144255],
    //   projectId: '2c9180897955e3a90179596d69c00020',
    //   type: 'goods',
    //   id: '8',
    // },
    // {
    //   coordinate: [120.360412, 30.163152],
    //   count: 6,
    //   picImg: this.stationGoodsImg(6),
    //   name: '衙前',
    //   paintPoint: [120.360412, 30.163152],
    //   projectId: '2c9180897955e3a90179596dde460024',
    //   type: 'goods',
    //   id: '9',
    // },
    // {
    //   coordinate: [120.330457, 30.175897],
    //   count: 2,
    //   picImg: this.stationGoodsImg(2),
    //   name: '姑娘桥',
    //   paintPoint: [120.330457, 30.175897],
    //   projectId: '2c9180897955e3a90179596dde460024',
    //   type: 'goods',
    //   id: '10',
    // },
  ];
  list = [
    // { coordinate: [120.489641,30.082084], count: 0, picImg: "assets/yuand.png", name: '笛场主所', paintPoint: [120.489641,30.082084], projectId: "2c9180897955e3a90179596dde460024"},
    // { coordinate: [120.426957,30.116913], count: 0, picImg: "assets/yuand.png", name: '万绣路主所', paintPoint: [120.426957,30.116913], projectId: "2c9180897955e3a90179596dde460024"},
    // { coordinate: [120.431571,30.11489], count: 0, picImg: "assets/yuand.png", name: '万绣路控制中心', paintPoint: [120.431571,30.11489], projectId: "2c9180897955e3a90179596dde460024"},
    // { coordinate: [120.435218,30.113312], count: 0, picImg: "assets/yuand.png", name: '万绣路车辆段', paintPoint: [120.435218,30.113312], projectId: "2c9180897955e3a90179596dde460024"},
  ];

  tabs: TabItem[] = [];

  deploymentList: { title: string; val: string }[] = [
    {title: '已选物资', val: '沙袋'},
    {title: '物资库存', val: '100'},
    {title: '保管人员', val: '王芳'},
    {title: '联系电话', val: '153252531'},
  ];

  selectLineData: any = []; // 线路数据
  selectSiteData: any = []; // 站点数据
  drawerLineData: any = []; // 抽屉页面站点数据
  drawerSiteData: any = []; // 抽屉页面站点数据

  // 工班新增数据data
  workShiftVo: any = {
    detailAddress: '',
    id: '',
    leaderId: '',
    leaderName: '',
    lineId: '',
    lineName: '',
    name: '',
    phoneNumber: '',
    remark: '',
    stationId: '',
    stationName: '',
    talkieId: '',
    telPhoneNumber: '',
    updateUserId: '',
    updateUserName: '',
    workShiftPeople: [],
  };

  // 头部数据
  headData = {
    underway: '',
    completedToday: '',
    temperature: '',
    weather: '',
  };

  // 应急事件详情数据
  emergencyEventData = {
    areaName: null,
    batchAccept: '',
    bigCategoryName: '',
    categoryName: '',
    closeEmployeeId: null,
    closePartyInEmployeeSize: null,
    closePartyInOrganizationSize: null,
    closeProcessingTime: null,
    closeResult: null,
    closeTime: null,
    createdBy: '',
    createdDate: '',
    createdTime: '',
    eventName: '',
    eventProcess: '',
    eventTime: '',
    fullPushStatus: false,
    id: '',
    isAreaEmergency: false,
    isDel: -1,
    lastModifiedBy: '',
    lastModifiedDate: '',
    levelName: '',
    openTheTrajectory: false,
    overviewAndRequirements: '',
    professionName: '',
    queryTagMethod: 0,
    remark: null,
    siteName: '',
    submitEmployeeId: '',
    submitEmployeeName: '',
    version: 0,
  };

  woreHouseDetailData: any[] = [];
  woreHouseId: string | undefined;
  suppliesId: string | undefined;
  aimList: SelectItem[] = [];
  page = 0;
  totalPage = 0;
  totalPageSize = 0;

  // 头像
  avatar: any;
  @ViewChild('sf3', {static: false}) sf3!: SFComponent;
  drawerSearchSchema: SFSchema = {
    properties: {
      site: {
        type: 'string',
        title: '站点',
        enum: this.selectLineData,
        ui: {
          widget: 'tree-select',
          multiple: true,
          placeholder: '请选择',
          change: (ngModel) => {
            let names = [];
            let ids: any = [];
            let stations: any = [];
            let siteName = [];
            let siteId = [];
            for (let i = 0; i < ngModel.length; i++) {
              /* 获取所有选择的线路名称 */
              let lineName = this.drawerLineData.filter((item: any) => item.key == ngModel[i]).map((item: any) => item.title);
              if (lineName.length != 0) {
                names.push(lineName.toString());
              }

              /* 获取所有选择的站点信息 */
              this.selectLineData.forEach((value: any) => {
                let station = value.children.filter((item: any) => {
                  return item.key == ngModel[i];
                });
                if (station.length != 0) {
                  stations.push(station[0]);
                }
              });
            }
            siteName = stations.map((item: any) => item.title);
            siteId = stations.map((item: any) => item.key);
            siteName.forEach((value: any) => names.push(value));
            siteId.forEach((value: any) => ids.push(value));
            this.workShiftVo.stationName = names.toString();
            this.workShiftVo.stationId = ids.toString();
            // console.log(this.drillListQuery);
          },
          width: 300,
          allowClear: true,
          dropdownStyle: {'max-height': '400px'},
        } as SFSelectWidgetSchema,
      },
    },
  };

  // 物资名称数据
  goodsNameList: SelectItem[] = [
    {label: '应急资源库', value: '应急资源库'},
    {label: '消防资源库', value: '消防资源库'},
    {label: '医疗资源库', value: '医疗资源库'},
  ];
  goodsName = '';
  provisioningSettings: ProvisioningSettingItem[] = [{count: 0, warehouseId: '', remark: ''}];

  ngOnInit() {
    this.loadLineInfo();
    // this.addRow();
    this.findAllOnGoingEvent();
    this.loadLineData();
    this.getLocalStorage();
    // setTimeout(() => {
    //   this.initAMap();
    // }, 2000);
    this.getWeatherForMap();
    this.getCountForMap();
    this.findAllWithOutPage();
    // this.findNowWorkNumByStation();
  }

  findAllOnGoingEvent() {
    this.http.get(`/service/emergency-event/admin/AdminEventApi/findAllOnGoingEventList`).subscribe((res) => {
      if (res.success) {
        this.onGoingEventList = res.data;
      }
    });
  }

  initAMap() {
    // let centerPoint = [104.04, 30.40];
    // let centerPoint = [120.405978, 30.123333];
    let centerPoint = [120.480651, 30.049586];
    if (this.lat && this.lng) {
      centerPoint = [this.lng, this.lat];
    }
    this.map = new AMap.Map('map', {
      zoom: 12,
      center: centerPoint,
      // mapStyle: 'amap://styles/8f813ea7e9995dbd40ee0e593215edbc',
      zooms: [9, 18], // 设置地图级别范围
      zoomEnable: true,
      scrollWheel: true,
    });
    this.map.setMapStyle('amap://styles/8f813ea7e9995dbd40ee0e593215edbc');

    // 区间线路
    for (let i = 0; i < this.selectLineData.length; i++) {
      this.getSectionsByLineId(this.selectLineData[i].key, this.selectLineData[i].title, this.selectLineData[i].color);
    }

    for (let i = 0; i < this.emergencylist.length; i++) {
      this.incidentList.push.apply(this.incidentList, this.emergencylist[i].eventList);
      if (this.emergencylist[i].station !== null) {
        // 站点信息
        if (this.emergencylist[i].station.category == 'station') {
          this.paintPoint([this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], i);
        } else if (this.emergencylist[i].station.category == 'mainOffice') {
          const text = new AMap.Text({
            text: "<img src='assets/icon-main-place.png'>" + this.emergencylist[i].station.name, // 自定义点标记
            position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
            offset: new AMap.Pixel(20, -5), // 设置点标记偏移量
            anchor: 'bottom-left', // 设置锚点方位
            style: {
              border: '0',
            },
          });
          text.setMap(this.map);
        } else if (this.emergencylist[i].station.category == 'controlCenter') {
          const text = new AMap.Text({
            text: "<img src='assets/icon-control-center.png'>" + this.emergencylist[i].station.name, // 自定义点标记
            position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
            offset: new AMap.Pixel(20, -5), // 设置点标记偏移量
            anchor: 'bottom-left', // 设置锚点方位
            style: {
              border: '0',
            },
          });
          text.setMap(this.map);
        } else if (this.emergencylist[i].station.category == 'depot') {
          const text = new AMap.Text({
            text: "<img src='assets/icon-car-depot.png'>" + this.emergencylist[i].station.name, // 自定义点标记
            position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
            offset: new AMap.Pixel(20, -5), // 设置点标记偏移量
            anchor: 'bottom-left', // 设置锚点方位
            style: {
              border: '0',
            },
          });
          text.setMap(this.map);
        } else if (this.emergencylist[i].station.category == 'follow') {
          const text = new AMap.Text({
            text: '姑娘桥至衙前区间风井跟随所', // 自定义点标记
            position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
            offset: new AMap.Pixel(20, -5), // 设置点标记偏移量
            anchor: 'bottom-left', // 设置锚点方位
            style: {
              border: '0',
            },
          });
          text.setMap(this.map);
          const substationMarker = new AMap.Marker({
            icon: 'assets/icon-substation2.png', // 自定义点标记
            position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
            offset: new AMap.Pixel(0, 0), // 设置点标记偏移量
            anchor: 'center', // 设置锚点方位
            imageSize: new AMap.Size(22, 22),
            fontSize: 12,
            fillColor: '#000000',
          });
          this.map.add(substationMarker);
        } else if (this.emergencylist[i].station.category == 'park') {
          const text = new AMap.Text({
            text: "<img src='assets/icon-main-place.png'>" + this.emergencylist[i].station.name, // 自定义点标记
            position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
            offset: new AMap.Pixel(20, -5), // 设置点标记偏移量
            anchor: 'bottom-left', // 设置锚点方位
            style: {
              border: '0',
            },
          });
          text.setMap(this.map);
        } else if (this.emergencylist[i].eventList.length > 0) {
          this.drawEmergencyStation(
            this.emergencylist[i].station.longitude,
            this.emergencylist[i].station.latitude,
            this.emergencylist[i].station.id,
            this.emergencylist[i].eventList,
          );
        }
      }
    }
    this.unique(this.incidentList);
    this.incidentList.sort(function (a: any, b: any) {
      return b.createdTime < a.createdTime ? -1 : 1;
    });
    if (this.incidentList.length > 0) {
      this.emergencyEventData = this.incidentList[0];
      this.getFullView(this.incidentList[0].id);
      this.findMeasureByEventId(this.incidentList[0].id);
    }

    this.getMarker1();

    // for (var i = 0; i < this.list.length; i++) {
    //   this.marker1 = new AMap.Marker({
    //     icon: this.list[i].picImg, // 自定义点标记
    //     position: this.list[i].coordinate, // 基点位置
    //     offset: new AMap.Pixel(0, 0), // 设置点标记偏移量
    //     anchor: 'center', // 设置锚点方位
    //     imageSize: new AMap.Size(22, 22),
    //     fontSize: 12,
    //     fillColor: '#000000'
    //   });
    //   this.listMarkerArr.push(this.marker1);
    // }
    // this.map.add(this.listMarkerArr);
  }

  // 设置普通区间
  setInterval(startLng: any, endLng: any, id: any, sectionId: any, color: any) {
    const path = [startLng, endLng];
    const polylineData = {
      path,
      isOutline: true,
      outlineColor: '#ffeeff',
      borderWeight: 1,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 8,
      // 折线样式还支持 'dashed'
      strokeStyle: 'solid',
      // strokeStyle是dashed时有效
      strokeDasharray: [10, 5],
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 5,
      id,
      sectionId,
    };

    this.sectionPolylineDatas.push(polylineData);
    const polyline = new AMap.Polyline(polylineData);
    polyline.content = id;
    this.map.add([polyline]);
    return polyline;
  }

  // 设置有应急区间
  setEventInterval(startLng: any, endLng: any, id: any, sectionId: any, color: any, eventList: any) {
    const path = [startLng, endLng];
    const polylineData = {
      path,
      isOutline: true,
      outlineColor: '#ffeeff',
      borderWeight: 1,
      strokeColor: '#2FA5FF',
      strokeOpacity: 1,
      strokeWeight: 8,
      strokeStyle: 'solid',
      // strokeStyle是dashed时有效
      strokeDasharray: [10, 5],
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 5,
      id,
      sectionId,
    };

    this.sectionPolylineDatas.push(polylineData);
    const polyline = new AMap.Polyline(polylineData);
    polyline.content = sectionId;
    polyline.eventList = eventList;
    polyline.on('click', (e: any) => {
      var text = '您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ] 的位置点击了圆！';
      this.incidentList = e.target.eventList;
      this.emergencyEventData = this.incidentList[0];
      this.getFullView(this.incidentList[0].id);
      this.findMeasureByEventId(this.incidentList[0].id);
      this.pattern = true;
      this.emergencyEvents = true;
    });
    this.map.add([polyline]);
    return polyline;
  }

  unique(arr: any) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i].eventName == arr[j].eventName) {
          // 第一个等同于第二个，splice方法删除第二个
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  }

  // 应急模式自定义标记点
  getMarker1() {
    for (var i = 0; i < this.emergencylist.length; i++) {
      if (this.emergencylist[i].station !== null) {
        this.marker = new AMap.Marker({
          icon: 'assets/yuand.png', // 自定义点标记
          position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
          offset: new AMap.Pixel(0, 0), // 设置点标记偏移量
          anchor: 'center', // 设置锚点方位
          imageSize: new AMap.Size(22, 22),
          fontSize: 12,
          fillColor: '#000000',
        });
        if (this.emergencylist[i].station.category != 'follow') {
          this.emergencyMarkerArr.push(this.marker);
        }
        this.text = new AMap.Text({
          text: this.emergencylist[i].station.name, // 自定义点标记
          position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
          offset: new AMap.Pixel(20, -5), // 设置点标记偏移量
          anchor: 'bottom-left', // 设置锚点方位
          style: {
            border: '0',
            background: '#F28897',
            color: '#ffffff',
          },
        });
        if (this.emergencylist[i].station.category == 'station') {
          this.text.setMap(this.map);
        }
        // 循环获取应急事件发生地点
        if (this.emergencylist[i].eventList.length > 0) {
          this.drawEmergencyStation(
            this.emergencylist[i].station.longitude,
            this.emergencylist[i].station.latitude,
            this.emergencylist[i].station.id,
            this.emergencylist[i].eventList,
          );
        }
      }
    }
    this.map.add(this.emergencyMarkerArr);
  }

  // 物资模式自定义标记点
  getMarker2(goodList: GoodsItem[]) {
    this.goodsMarkerArr = [];
    console.log(this.goodsMarkerArr);
    this.map.remove(this.goodsMarkerArr);
    this.map.remove(this.gangMarkerArr);
    console.log(this.goodsMarkerArr);
    for (var i = 0; i < goodList.length; i++) {
      this.marker = new AMap.Marker({
        icon: goodList[i].picImg, // 自定义点标记
        position: goodList[i].coordinate, // 基点位置
        offset: new AMap.Pixel(0, 0), // 设置点标记偏移量
        anchor: 'center', // 设置锚点方位
        imageSize: new AMap.Size(22, 22),
        fontSize: 12,
        fillColor: '#000000',
        event: goodList[i],

      });
      this.goodsMarkerArr.push(this.marker);
      this.text = new AMap.Text({
        text: goodList[i].name, // 自定义点标记
        position: goodList[i].coordinate, // 基点位置
        offset: new AMap.Pixel(20, -5), // 设置点标记偏移量
        anchor: 'bottom-left', // 设置锚点方位
        style: {
          border: '0',
          background: '#F28897',
          color: '#ffffff',
        },
      });
      this.text.setMap(this.map);
      this.marker.on('click', (ev: any) => {
        // 触发事件的对象 带点击按钮跳转都下一个页面操作
        var target = ev.target;
        const lnglat = ev.lnglat;
        if (target.Ce && target.Ce.icon == 'assets/icon-goodsbig.png') {
          this.openGoodsDrawer();
        }
        if (target.w && target.w.event.type === 'goods') {
          // 弹窗
          // 触发事件的地理坐标，AMap.LngLat 类型
          const obj = target.w.event;
          // 打开信息窗体
          this.openInfo(target, lnglat, obj);


        }
      });
    }
    this.map.add(this.goodsMarkerArr);
    console.log(this.map);
  }

  // 获取站点下面的仓库
  getStationInWoreHouse(stationId: string): Promise<string> {
    return new Promise<string>((resolve) => {
      const postData = {
        suppliesId: this.goodsName,
        suppliesTagId: this.goodsAttribute,
      };
      this.http
        .post(`/service/supplies-system/admin/SuppliesDistributionAdminApi/getWarehouseListByStationId/${stationId}`, postData)
        .subscribe((res) => {
          this.tabs = res.data.map((item: any) => {
            return {
              name: item.name,
              id: item.id,
              haveSupplies: item.haveSupplies,
              checked: false,
              keeper: item.suppliesWarehouseKeepers[0],
            };
          });
          resolve('');
        });
    });
  }

  openInfo(target: any, lnglat: any, obj: any) {
    if (!window._hz) {
      window._hz = {} as any;
    }
    window._hz.showDrawer = {
      showDrawer: (id: any) => {
        this.goodsCloseDrawer('goodsVisible');
        this.getStationInWoreHouse(target.w.event.id).then((res) => {
          this.checkWoreHouse(0);
        });
      },
    };
    console.log(obj);
    // 获取数据
    this.getStationInWoreHouse(target.w.event.id).then((res) => {
      this.http.get("/service/supplies-system/admin/SuppliesDistributionAdminApi/getSuppliesListByStationId/" + target.w.event.id).subscribe(res => {
        console.log(res);
        const woreHouseList = res.data;
        let stationFirstNum = 0;
        let stationSecondNum = 0;
        let stationThirdNum = 0;
        let stationFourNum = 0;
        let workSpaceFirstNum = 0;
        let workSpaceSecondNum = 0;
        let workSpaceThirdNum = 0;
        let workSpaceFourNum = 0;
        for (let i = 0; i < woreHouseList.length; i++) {
          if (woreHouseList[i].name.indexOf("车站物资") != -1 && woreHouseList[i].suppliesVOS != null) {
            for (let j = 0; j < woreHouseList[i].suppliesVOS.length; j++) {
              if (woreHouseList[i].suppliesVOS[j].matName == "防汛沙袋") {
                stationFirstNum += woreHouseList[i].suppliesVOS[j].matCount;
              } else if (woreHouseList[i].suppliesVOS[j].matName == "吸水膨胀带") {
                stationSecondNum += woreHouseList[i].suppliesVOS[j].matCount;
              } else if (woreHouseList[i].suppliesVOS[j].matName == "固定式防洪挡板") {
                stationThirdNum += woreHouseList[i].suppliesVOS[j].matCount;
              } else if (woreHouseList[i].suppliesVOS[j].matName == "便携式防洪挡板") {
                stationFourNum += woreHouseList[i].suppliesVOS[j].matCount;
              }
            }
          } else if (woreHouseList[i].name.indexOf("设备工区物资") != -1 && woreHouseList[i].suppliesVOS != null) {
            for (let j = 0; j < woreHouseList[i].suppliesVOS.length; j++) {
              if (woreHouseList[i].suppliesVOS[j].matName == "防汛沙袋") {
                workSpaceFirstNum += woreHouseList[i].suppliesVOS[j].matCount;
              } else if (woreHouseList[i].suppliesVOS[j].matName == "雨鞋") {
                workSpaceSecondNum += woreHouseList[i].suppliesVOS[j].matCount;
              } else if (woreHouseList[i].suppliesVOS[j].matName == "潜污泵") {
                workSpaceThirdNum += woreHouseList[i].suppliesVOS[j].matCount;
              } else if (woreHouseList[i].suppliesVOS[j].matName == "下水裤") {
                workSpaceFourNum += woreHouseList[i].suppliesVOS[j].matCount;
              }
            }

          }
        }
        const content = `<div class='text-center' id='stationName' style='padding: 10px 25px 20px;'>
            <div style='width: 300px;'>
              <div style='display:flex;border-bottom: 1px solid #EEEEEE;'>
                 <div style='width:150px;min-height:185px;display: flex;align-items: center;justify-content: flex-start;flex-direction: column;padding: 10px;border-right: 1px solid #EEEEEE;'>
                    <div style='border-bottom: 1px solid #EEEEEE;padding: 5px;text-align: left;'>车站物资</div>
                    <div>
                      <p>防汛沙袋: ${stationFirstNum}</p>
                      <p>吸水膨胀带: ${stationSecondNum}</p>
                      <p>固定式防洪挡板: ${stationThirdNum}</p>
                      <p>便携式防洪挡板: ${stationFourNum}</p>
                    </div>
                 </div>
                 <div style='width:150px;min-height:185px;display: flex;align-items: center;justify-content: flex-start;flex-direction: column;padding: 10px;'>
                    <div style='border-bottom: 1px solid #EEEEEE;padding: 5px;text-align: left;'>设备工区物资</div>
                    <div>
                      <p>防汛沙袋: ${workSpaceFirstNum}</p>
                      <p>雨鞋: ${workSpaceSecondNum}</p>
                      <p>潜污泵: ${workSpaceThirdNum}</p>
                      <p>下水裤: ${workSpaceFourNum}</p>
                    </div>
                 </div>
              </div>
            </div>
            <span onclick="window._hz.showDrawer.showDrawer('${obj.id}')" style='padding:5px 35px;top: 10px;background: #1890FF;
            position:relative;border-radius: 5px;color: #FFFFFF;cursor:pointer;'>查看详情</span>
        </div>`;
        const infoWindow = new AMap.InfoWindow({
          // 传入 dom 对象，或者 html 字符串
          content,
        });
        infoWindow.open(this.map, lnglat);
      })
    });


  }


  checkWoreHouse(idx: any): void {
    this.tabsItemClick(idx);
    this.woreHouseId = this.tabs[idx].id;
    this.wareHouseDetail();
  }

  getAllWareHouseDetailListByEventId(id: any) {

  }

  wareHouseDetail(): void {
    const postData = {page: this.page, pageSize: 10};
    this.http
      .post(`/service/supplies-system/admin/SuppliesDistributionAdminApi/getSuppliesListByWarehouseId/${this.woreHouseId}`, postData)
      .subscribe((res) => {
        this.woreHouseDetailData = res.data.content;
        this.woreHouseDetailData.forEach((item) => {
          item.totalNum = item.matCount;
          item.keeper = this.tabs.filter((ele) => {
            return ele.id == this.woreHouseId;
          })[0].keeper;
          console.log(item.keeper, "item.keeper");
          item.suppliesScenes = item.suppliesSceneTagVOS.length > 0 ? item.suppliesSceneTagVOS.map((i: any) => i.tagName).join(',') : '无';
        });
        this.totalPage = res.data.totalPages;
        this.totalPageSize = res.data.totalElements;
      });
  }

  pageChange(page: number): void {
    this.page = page;
    this.wareHouseDetail();
  }

  // 工班模式自定义标记点
  getMarker3() {
    let groupInfoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, 0)});
    for (var i = 0; i < this.emergencylist.length; i++) {
      this.marker = new AMap.Marker({
        icon: 'assets/icon-work1.png', // 自定义点标记
        position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
        offset: new AMap.Pixel(0, 0), // 设置点标记偏移量
        anchor: 'center', // 设置锚点方位
        imageSize: new AMap.Size(22, 22),
        fontSize: 12,
        fillColor: '#000000',
      });
      this.marker.extData = {
        id: this.emergencylist[i].station.id,
        name: this.emergencylist[i].station.name,
      };
      if (this.groupListOfDataForMap.length > 0) {
        for (var j = 0; j < this.groupListOfDataForMap.length; j++) {
          if (this.emergencylist[i].station.id == this.groupListOfDataForMap[j]) {
            this.gangMarkerArr.splice(i, 1);
            this.marker.setIcon('assets/work-big1.png');
          }
        }
      }
      this.text = new AMap.Text({
        text: this.emergencylist[i].name, // 自定义点标记
        position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
        offset: new AMap.Pixel(20, -5), // 设置点标记偏移量
        anchor: 'bottom-left', // 设置锚点方位
        style: {
          border: '0',
          background: '#F28897',
          color: '#ffffff',
        },
      });
      this.marker.content = document.getElementById('groupDetail');
      this.marker.on('click', (e: any) => {
        this.workShiftQuery.stationName = e.target.extData.name;
        this.workShiftVo.stationName = e.target.extData.name;
        this.workShiftVo.stationId = e.target.extData.id;
        // this.workShiftQuery.stationName = '五根松';
        this.findByPage();
        groupInfoWindow.setContent(e.target.content);
        groupInfoWindow.open(this.map, e.target.getPosition());
      });
      // this.marker.emit('click', {target: this.marker});
      if (this.emergencylist[i].station.category == 'station') {
        this.gangMarkerArr.push(this.marker);
      }
      this.text.setMap(this.map);
    }
    this.map.add(this.gangMarkerArr);
  }

  // 打卡信息自定义标记点
  punchCardStationName: any;
  punchCardPeople: any;
  stationId: any;

  getMarker4() {
    this.punchCardMarkerArr = [];
    var punchCardInfoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, 0)});
    for (var i = 0; i < this.emergencylist.length; i++) {
      this.marker = new AMap.Marker({
        icon: 'assets/0-10.png', // 自定义点标记
        position: [this.emergencylist[i].station.longitude, this.emergencylist[i].station.latitude], // 基点位置
        offset: new AMap.Pixel(0, 0), // 设置点标记偏移量
        anchor: 'bottom-center', // 设置锚点方位
        imageSize: new AMap.Size(5, 5),
        fontSize: 12,
        fillColor: '#000000',
      });
      this.marker.extData = {
        id: this.emergencylist[i].station.id,
        name: this.emergencylist[i].station.name,
      };
      this.marker.content = document.getElementById('punchCard');
      this.marker.on('click', (e: any) => {
        this.showList = false;
        if (this.watchOverCenterData.name != '全部') {
          this.itemVirOrgIds = [];
          this.itemVirOrgIds.push(this.watchOverCenterData.id);
          this.findNowWorkNumByStationAndVirOrg();
          this.showList = true;
        }
        this.punchCardStationName = e.target.extData.name;
        this.stationId = e.target.extData.id;
        this.punchCardPeople = this.punchCardList[e.target.extData.id];
        punchCardInfoWindow.setContent(e.target.content);
        punchCardInfoWindow.open(this.map, e.target.getPosition());
      });
      if (this.punchCardList[this.emergencylist[i].station.id] > 0) {
        this.marker.setLabel({
          offset: new AMap.Pixel(8, -20), //设置文本标注偏移量
          content: "<div class='info'>" + this.punchCardList[this.emergencylist[i].station.id] + '人' + '</div>', //设置文本标注内容
          direction: 'bottom-center', //设置文本标注方位
        });
        this.punchCardMarkerArr.push(this.marker);
        // this.text.setMap(this.map);
      }
    }
    this.map.add(this.punchCardMarkerArr);
  }

  // 事件数据
  incidentList: any = [];
  circle: any;
  CanvasLayer: any;
  circles: any = [];
  CanvasLayers: any = [];

  drawEmergencyStation(longitude: any, latitude: any, id: any, eventList: any) {
    // 构造矢量圆形
    this.circle = new AMap.Circle({
      center: new AMap.LngLat(longitude, latitude), // 圆心位置
      radius: 300, //半径
      strokeColor: '#F33', //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 3, //线粗细度
      fillColor: '#ee2200', //填充颜色
      fillOpacity: 0.35, //填充透明度
    });
    this.circle.content = id;
    this.circle.eventList = eventList;
    this.circle.on('click', (e: any) => {
      console.log(e);
      var text = '您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ] 的位置点击了圆！';
      console.log(text);
      this.incidentList = e.target.eventList;
      this.emergencyEventData = this.incidentList[0];
      this.getFullView(this.incidentList[0].id);
      this.findMeasureByEventId(this.incidentList[0].id);
      this.pattern = true;
      this.emergencyEvents = true;
      console.log(this.incidentList);
    });
    this.circles.push(this.circle);
    this.map.add(this.circles);

    /*
     * 添加Canvas图层
     */
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 200;

    var context: any = canvas.getContext('2d');
    context.fillStyle = 'red';
    context.strokeStyle = 'white';
    context.globalAlpha = 1;
    context.lineWidth = 2;

    var lngLog = new AMap.LngLat(longitude, latitude, true);
    var lngLogLeft = lngLog.offset(-600, -600);
    var lngLogRight = lngLog.offset(600, 600);
    console.log(lngLogLeft);
    console.log(lngLogRight);
    var startLng = [];
    var endLng = [];
    startLng.push(lngLogLeft.lng);
    startLng.push(lngLogLeft.lat);
    endLng.push(lngLogRight.lng);
    endLng.push(lngLogRight.lat);
    this.CanvasLayer = new AMap.CanvasLayer({
      canvas: canvas,
      bounds: new AMap.Bounds(startLng, endLng),
      zooms: [3, 18],
      zIndex: 10,
    });
    this.CanvasLayers.push(this.CanvasLayer);
    this.map.add(this.CanvasLayers);

    var radious = 0;
    var canvasLayer = this.CanvasLayer;
    console.log(context);
    var draw = function () {
      context.clearRect(0, 0, 200, 200);
      context.globalAlpha = (context.globalAlpha - 0.01 + 1) % 1;
      radious = (radious + 1) % 100;

      context.beginPath();
      context.arc(100, 100, radious, 0, 2 * Math.PI);
      context.fill();
      context.stroke();

      // 刷新渲染图层
      canvasLayer.reFresh();

      AMap.Util.requestAnimFrame(draw);
    };
    draw();
  }

  // 点击应急地点
  // showInfoC(e) {
  //   console.log(e);
  //   console.log(e.target.content);
  //   var text = '您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ' ] 的位置点击了圆！'
  //   console.log(text);
  //   // this.incidentList = e.target.eventList.map((element) => {
  //   //   return {
  //   //     label: element.eventName,
  //   //     value: 1
  //   //   };
  //   // });
  //   console.log(this.incidentList);
  //   this.incidentList = e.target.eventList;
  //   // this.sf.refreshSchema();
  //
  // }

  // 圆形点位
  paintPoint(listArr: any, idx: any) {
    let paintPointArr = [];
    let circleMarker = new AMap.CircleMarker({
      center: new AMap.LngLat(listArr[0], listArr[1]),
      radius: 6, // 3D视图下，CircleMarker半径不要超过64px
      strokeColor: '#979797',
      strokeWeight: 5,
      strokeOpacity: 0.2,
      fillColor: '#ffffff',
      // fillOpacity:0.3,
      zIndex: 10,
      bubble: true,
      cursor: 'pointer',
      extData: '',
      clickable: true,
    });
    circleMarker.on('click', function (ev: any) {
      // 触发事件的对象 带点击按钮跳转都下一个页面操作
      var target = ev.target;
      var lnglat = ev.lnglat;
    });
    this.map.add(circleMarker);
    paintPointArr.push(circleMarker);
  }

  paintPoint1(listArr: any, idx: any) {
    let paintPointArr1 = [];
    let circleMarker = new AMap.CircleMarker({
      center: new AMap.LngLat(listArr[0], listArr[1]),
      radius: 6, // 3D视图下，CircleMarker半径不要超过64px
      strokeColor: '#979797',
      strokeWeight: 5,
      strokeOpacity: 0.2,
      fillColor: '#ffffff',
      // fillOpacity:0.3,
      zIndex: 10,
      bubble: true,
      cursor: 'pointer',
      extData: '',
      clickable: true,
    });
    circleMarker.on('click', function (ev: any) {
      // 触发事件的对象 带点击按钮跳转都下一个页面操作
      var target = ev.target;
      var lnglat = ev.lnglat;
    });
    this.map.add(circleMarker);
    paintPointArr1.push(circleMarker);
  }

  // 应急事件展开
  emergencyEvents = false;

  unfoldEmergencyEvents() {
    if (this.emergencyEvents == false) {
      this.emergencyEvents = true;
    } else {
      this.emergencyEvents = false;
    }
  }

  // 模式展开
  pattern = false;

  unfoldPattern() {
    if (this.pattern == false) {
      this.pattern = true;
    } else {
      this.pattern = false;
    }
  }

  // 值守中心数据
  watchOverCenterList: any = [];

  // 模式选择事件
  patternChoose() {
    setTimeout(() => {
      if (this.radioValue == 'emergencyPattern') {
        this.map.remove(this.goodsMarkerArr);
        this.map.remove(this.gangMarkerArr);
        this.circles = [];
        this.CanvasLayers = [];
        this.getMarker1();
        this.workShiftQueryForMap = {
          page: 0,
          pageSize: 0,
          stationName: '',
          leaderName: '',
          name: '',
        };
      } else if (this.radioValue == 'goodsPattern') {
        // this.NzNotificationService.create('info', '消息提示', '物资数据对接中');
        this.map.remove(this.emergencyMarkerArr);
        this.map.remove(this.gangMarkerArr);
        this.map.remove(this.circles);
        this.map.remove(this.CanvasLayers);
        this.map.remove(this.punchCardMarkerArr);
        this.switchValue = false;
        this.punchCard = false;
        this.workShiftQueryForMap = {
          page: 0,
          pageSize: 0,
          stationName: '',
          leaderName: '',
          name: '',
        };
        this.goodsHttp();
      } else if (this.radioValue == 'groupPattern') {
        this.map.remove(this.goodsMarkerArr);
        this.map.remove(this.emergencyMarkerArr);
        this.map.remove(this.circles);
        this.map.remove(this.CanvasLayers);
        this.map.remove(this.punchCardMarkerArr);
        this.switchValue = false;
        this.punchCard = false;
        this.getMarker3();
      }
    }, 1000);
  }

  // 物资调配抽屉
  openGoodsDrawer(): void {
    this.visible = true;
  }

  closeGoodsDrawer(): void {
    this.visible = false;
  }

  openChildren(data: any): void {
    this.deployData = data;
    this.childrenVisible = true;
  }

  closeChildren(): void {
    this.childrenVisible = false;
  }

  // 物资详情数据
  listOfData = [
    {
      id: '1',
      name: '沙袋',
      number: 32,
      keeper: '王芳',
      phone: '13456324565',
    },
    {
      id: '2',
      name: '灭火器',
      number: 52,
      keeper: '王芳',
      phone: '13456324565',
    },
    {
      id: '3',
      name: '沙袋',
      number: 12,
      keeper: '王芳',
      phone: '13456324565',
    },
    {
      id: '4',
      name: '灭火器',
      number: 32,
      keeper: '王芳',
      phone: '13456324565',
    },
    {
      id: '5',
      name: '沙袋',
      number: 100,
      keeper: '王芳',
      phone: '13456324565',
    },
  ];

  // 调配设置
  login: any = [];
  deployNumber: any; // 调配数量
  deployPlace: any; // 调配目的地
  allDeploy = 0; // 调配总量
  // 新增调配设置
  addDeploy() {
    this.login.push({deployNumber: 0, deployPlace: ''});
  }

  // 删除调配设置
  removeDeploy(item: any) {
    let i = this.login.indexOf(item);
    this.login.splice(i, 1);
    this.allDeploy = 0;
    setTimeout(() => {
      for (let i = 0; i < this.login.length; i++) {
        this.allDeploy += this.login[i].deployNumber;
      }
    }, 1000);
  }

  // 调配数量变化时
  onChangeNumber() {
    this.allDeploy = 0;
    setTimeout(() => {
      for (let i = 0; i < this.login.length; i++) {
        this.allDeploy += this.login[i].deployNumber;
      }
    }, 1000);
  }

  // 工班详情抽屉打开
  workShiftPeople: any;

  openGroupDrawer(data: any): void {
    this.groupData = data;
    this.findByWorkShiftId(data.id);
    this.groupVisible = true;
  }

  // 工班详情关闭
  closeGroupDrawer(): void {
    this.groupVisible = false;
  }

  // 工班新增抽屉打开
  openAddGroupDrawer(): void {
    this.getLocalStorage();
    // @ts-ignore
    this.drawerSearchSchema.properties.site.default = this.workShiftVo.stationId;
    this.addGroupVisible = true;
    this.sf3.refreshSchema();
  }

  // 工班新增关闭
  closeAddGroupDrawer(): void {
    this.addGroupVisible = false;
    this.login = [];
    this.workShiftVo = {
      detailAddress: '',
      id: '',
      leaderId: '',
      leaderName: '',
      lineId: '',
      lineName: '',
      name: '',
      phoneNumber: '',
      remark: '',
      stationId: '',
      stationName: '',
      talkieId: '',
      telPhoneNumber: '',
      updateUserId: '',
      updateUserName: '',
      workShiftPeople: [],
    };
  }

  // 工班详情收起明细
  nzActive = true;

  openAndClose(): void {
    if (this.nzActive == true) {
      this.nzActive = false;
    } else if (this.nzActive == false) {
      this.nzActive = true;
    }
  }

  // 新增工班人数操作
  i = 0;
  editId: string | undefined | null;
  addListOfData: ItemData[] = [];
  @ViewChild(NzInputDirective, {static: false, read: ElementRef}) inputElement!: ElementRef;

  @HostListener('window:dblclick', ['$event'])
  handleClick(e: MouseEvent): void {
    if (this.editId && this.inputElement && this.inputElement.nativeElement !== e.target) {
      this.editId = null;
    }
  }

  startEdit(id: string, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editId = id;
  }

  // 分页获取班表信息
  findByPage() {
    this.http.post(`/service/emergency-hsLine/admin/WorkShift/findByPage`, this.workShiftQuery).subscribe((res) => {
      if (res.success) {
        this.groupListOfData = res.data.content;
      }
    });
  }

  // 查询地图获取班表信息
  findStationFromMap() {
    if (this.workStationChangeData != null) {
      this.groupListOfDataForMap = [];
      this.map.remove(this.gangMarkerArr);
      this.groupListOfDataForMap.push(this.workStationChangeData.id);
      this.gangMarkerArr = [];
      this.getMarker3();
    } else {
      this.http.post(`/service/emergency-hsLine/admin/WorkShift/findStationFromMap`, this.workShiftQueryForMap).subscribe((res) => {
        if (res.success) {
          if (res.data.length > 0) {
            this.groupListOfDataForMap = res.data;
            this.map.remove(this.gangMarkerArr);
            this.gangMarkerArr = [];
            this.getMarker3();
          } else {
            this.groupListOfDataForMap = [];
            this.map.remove(this.gangMarkerArr);
            this.gangMarkerArr = [];
            this.getMarker3();
          }
        } else {
          this.groupListOfDataForMap = [];
          this.map.remove(this.gangMarkerArr);
          this.gangMarkerArr = [];
          this.getMarker3();
        }
      });
    }
  }

  // 获取班表人员信息列表
  findByWorkShiftId(workShiftId: any) {
    this.http.get(`/service/emergency-hsLine/admin/WorkShift/workShiftPeople/` + workShiftId).subscribe((res) => {
      if (res.success) {
        this.workShiftPeople = res.data;
      }
    });
  }

  // 增加班表信息
  addWorkShift() {
    this.http.post(`/service/emergency-hsLine/admin/WorkShift/add`, this.workShiftVo).subscribe((res) => {
      if (res.success) {
        this.messageService.success('保存成功');
        this.closeAddGroupDrawer();
        this.findByPage();
      } else {
        this.messageService.error('保存失败，请检查数据');
      }
    });
  }

  //删除班组信息
  workDelete(workShiftId: any) {
    this.http.get(`/service/emergency-hsLine/admin/WorkShift/delete/` + workShiftId).subscribe((res) => {
      if (res.success) {
        this.messageService.success('删除成功');
        this.closeAddGroupDrawer();
        this.findByPage();
      }
    });
  }

  lineId = '40289f557c6e39b0017c6e3a850102b7';

  // 加载线路信息
  loadLineInfo() {
    this.http.get(`/service/emergency-event/admin/AdminEventApi/findAllLineEventForMap/` + this.lineId).subscribe((res) => {
      if (res.success) {
        this.emergencylist = res.data;
        console.log(this.emergencylist);
        this.workStationlist = [];
        this.workSectionlist = [];
        for (const element of res.data) {
          if (element.station !== null) {
            this.workStationlist.push({name: element.station.name, id: element.station.id});
          } else if (element.section !== null) {
            this.workSectionlist.push({
              name: element.section.name,
              id: element.section.id,
              eventList: element.eventList,
            });
          }
        }

        console.log(this.workStationlist, 'stationList');
        console.log(this.workSectionlist, 'sectionList');
        this.initAMap();
      }
    });
  }

  /* 加载所有线路数据 */
  loadLineData() {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/findAllLine`).subscribe((res) => {
      if (res.success) {
        this.selectLineData = res.data.map((element: any) => {
          return {title: element.name, key: element.id, color: element.color};
        });
        this.drawerLineData = res.data.map((element: any) => {
          return {title: element.name, key: element.id};
        });
        // @ts-ignore
        this.drawerSearchSchema.properties.site.enum = this.selectLineData;
        for (let i = 0; i < this.selectLineData.length; i++) {
          this.loadSiteData(this.selectLineData[i].key, i);
          this.loadSiteData(this.drawerLineData[i].key, i);
        }
        // this.sf1.refreshSchema();
        this.sf3.refreshSchema();
      }
    });
  }

  /* 根据线路ID获取相应的站点信息 */
  loadSiteData(lineId: any, index: any) {
    this.http.get(`/service/emergency-base-config/admin/adminMetroLineApi/getAllStationsByLineIds/${lineId}`).subscribe((res) => {
      if (res.success) {
        this.selectSiteData = res.data.map((element: any) => {
          return {title: element.name, key: element.id, isLeaf: true};
        });
        this.drawerSiteData = res.data.map((element: any) => {
          return {title: element.name, key: element.id, isLeaf: true};
        });
        this.selectLineData[index].children = this.selectSiteData;
        this.drawerLineData[index].children = this.drawerSiteData;
        // this.sf1.refreshSchema();
        this.sf3.refreshSchema();
      }
    });
  }

  getSectionsByLineId(lineId: any, lineName: any, lineColor: any) {
    this.http.get(`/service/emergency-base-config/metroLineApi/getMetroSectionByLineId/${lineId}`).subscribe((res) => {
      if (res.success) {
        const sectionDataList = res.data;
        const polylineList = [];
        for (let i = 0; i < sectionDataList.length; i++) {
          let hasEvent = false;
          const sectionData = sectionDataList[i];
          const startLng = [sectionData.startLongitude, sectionData.startLatitude];
          const endLng = [sectionData.endLongitude, sectionData.endLatitude];
          for (let j = 0; j < this.workSectionlist.length; j++) {
            if (this.workSectionlist[j].id === sectionData.id) {
              hasEvent = true;
              const polyline = this.setEventInterval(
                startLng,
                endLng,
                lineId,
                sectionData.id,
                lineColor,
                this.workSectionlist[j].eventList,
              );
              polylineList.push(polyline);
            }
          }
          if (!hasEvent) {
            const polyline = this.setInterval(startLng, endLng, lineId, sectionData.id, lineColor);
            polylineList.push(polyline);
          }
        }
        this.map.set(lineId, polylineList);
      }
    });
  }

  getLocalStorage() {
    let value = JSON.parse(window.localStorage.getItem('employee'));
    this.avatar = value.avatar;
    this.workShiftVo.updateUserName = value.employeeName;
    this.workShiftVo.updateUserId = value.thirdPartyAccountUserId;
    this.thirdId = value.thirdPartyAccountUserId;
    this.employeeName = value.employeeName
  }

  /* 添加工班长 */
  addLeader() {
    this.modal
      .createStatic(EmergencyDispatchEmergencyMapEditComponent, {i: {}, mode: 'add', isSingleSelect: false})
      .subscribe((value) => {
        this.workShiftVo.leaderId = value[0].thirdPartyAccountUserId;
        this.workShiftVo.leaderName = value[0].name;
      });
  }

  /* 添加人员 */
  addUser() {
    this.modal
      .createStatic(EmergencyDispatchEmergencyMapEditComponent, {i: {}, mode: 'add', isSingleSelect: false})
      .subscribe((value) => {
        this.workShiftVo.workShiftPeople = value.map((element: any) => {
          return {
            avatar: element.icon,
            corpId: element.corpId,
            companyName: element.companyName,
            name: element.name,
            thirdPartyId: element.thirdPartyAccountUserId,
          };
        });
      });
  }

  /* 删除人员 */
  userDelete(i: any, id: any) {
    console.log(i);
    this.workShiftVo.workShiftPeople.splice(i, 1);
    this.workShiftVo.workShiftPeople = this.workShiftVo.workShiftPeople.filter((d: any) => d.thirdPartyId !== id);
  }

  // 事件全貌
  fullViewNumber = {
    read: 0,
    notRead: 0,
    sign: 0,
    notSign: 0,
    call: 0,
    notCall: 0,
  };

  fullViewList: any = [];
  // 事件变更
  eventChange($event: any) {
    console.log($event);
    this.emergencyEventData = $event;
    this.getFullView($event.id);
    this.findMeasureByEventId($event.id);
    this.emergencyEvents = true;
  }

  // 获取事件全貌
  getFullView(eventId: any) {
    this.fullViewNumber = {
      read: 0,
      notRead: 0,
      sign: 0,
      notSign: 0,
      call: 0,
      notCall: 0,
    };
    let value = JSON.parse(window.localStorage.getItem('employee'));
    var data = {
      eventId: eventId,
      thirdId: value.thirdPartyAccountUserId,
      avatar: value.avatar,
      name: value.employeeName,
    };

    this.http.post(`/service/emergency-event/wxcp/EventApi/getEventFullView`, data).subscribe((res) => {
      if (res.success) {
        this.fullViewList = res.data;
        for (var i = 0; i < this.fullViewList.length; i++) {
          this.fullViewNumber.call = this.fullViewNumber.call + this.fullViewList[i].call;
          this.fullViewNumber.notCall = this.fullViewNumber.notCall + this.fullViewList[i].notCall;
          this.fullViewNumber.read = this.fullViewNumber.read + this.fullViewList[i].read;
          this.fullViewNumber.notRead = this.fullViewNumber.notRead + this.fullViewList[i].notRead;
          this.fullViewNumber.sign = this.fullViewNumber.sign + this.fullViewList[i].sign;
          this.fullViewNumber.notSign = this.fullViewNumber.notSign + this.fullViewList[i].notSign;
        }
      }
    });
  }

  //处置措施列表
  measureList: any;
  URL = ``;

  // 获取最新处置措施
  findMeasureByEventId(eventId: any) {
    this.http.get('/service/emergency-measures/measure/find/measureByEventId/' + eventId).subscribe((res) => {
      if (res.success) {
        this.measureList = res.data;
        for (var i = 0; i < this.measureList.length; i++) {
          if (this.measureList[i].resources != null || this.measureList[i].resources != '') {
            this.measureList[i].resourceList = this.measureList[i].resources.split(',');
          } else {
            this.measureList[i].resourceList = [];
          }
        }
        console.log(this.measureList);
      }
    });
  }

  // 获取进行和完成数字
  getCountForMap() {
    this.http.get('/service/emergency-event/admin/AdminEventApi/countForMap').subscribe((res) => {
      if (res.success) {
        this.headData.underway = res.data.ongoing;
        this.headData.completedToday = res.data.todayFinish;
      }
    });
  }

  // 获取天气
  getWeatherForMap() {
    this.http.get('/service/emergency-base-config/admin/adminTagGroupApi/weather/' + this.nowDateWeather + '/杭州市').subscribe((res) => {
      if (res.success) {
        this.headData.temperature = res.data.temperature;
        this.headData.weather = res.data.weather;
      }
    });
  }

  // 获取全部虚拟组织信息
  findAllWithOutPage() {
    this.http.get('/service/emergency-base-config/admin/adminVirOrganizationApi/findAllWithOutPage/' + this.thirdId).subscribe((res) => {
      if (res.success) {
        this.watchOverCenterList = res.data.map((element: any) => {
          return {
            id: element.id,
            name: element.name,
          };
        });
        this.watchOverCenterList.push({id: '', name: '全部'});
        for (var i = 0; i < res.data.length; i++) {
          this.virOrgIds.push(res.data[i].id);
        }
      }
    });
  }

  // 获取应急打卡站点打卡数量
  findNowWorkNumByStation() {
    this.punchCardList = [];
    if (this.punchCardValue == 'A') {
      this.http.post('/service/emergency-measures/locationLogApi/findNowWorkNumByStation', this.virOrgIds).subscribe((res) => {
        if (res.success) {
          this.punchCardList = res.data;
        }
        this.map.remove(this.punchCardMarkerArr);
        this.getMarker4();
      });
    } else if (this.punchCardValue == 'B') {
      this.http.post('/service/emergency-hsLine/OnDutySignApi/get/findNowWorkNumByStation', this.virOrgIds).subscribe((res) => {
        if (res.success) {
          this.punchCardList = res.data;
        }
        this.map.remove(this.punchCardMarkerArr);
        this.getMarker4();
      });
    } else if (this.punchCardValue == 'C') {
      this.http.post('/service/emergency-measures/punch/in/sign/get/findNowWorkNumByStation', this.virOrgIds).subscribe((res) => {
        if (res.success) {
          this.punchCardList = res.data;
        }
        this.map.remove(this.punchCardMarkerArr);
        this.getMarker4();
      });
    }
  }

  // 根据站点获取人员打卡数量
  itemVirOrgIds: any;
  watchOverCenterDataList: any;
  StationPunchCardPeople: any;

  findNowWorkNumByStationAndVirOrg() {
    if (this.punchCardValue == 'A') {
      this.http
        .post('/service/emergency-measures/locationLogApi/get/stationAndVirOrg/' + this.stationId, this.itemVirOrgIds)
        .subscribe((res) => {
          if (res.success) {
            this.watchOverCenterDataList = res.data;
            this.StationPunchCardPeople = this.watchOverCenterDataList.length;
          }
        });
    } else if (this.punchCardValue == 'B') {
      this.http
        .post('/service/emergency-hsLine/OnDutySignApi/get/sign/in/stationAndVirOrg/' + this.stationId, this.itemVirOrgIds)
        .subscribe((res) => {
          if (res.success) {
            this.watchOverCenterDataList = res.data;
            this.StationPunchCardPeople = this.watchOverCenterDataList.length;
          }
        });
    } else if (this.punchCardValue == 'C') {
      this.http
        .post('/service/emergency-measures/punch/in/sign/get/sign/in/stationAndVirOrg/' + this.stationId, this.itemVirOrgIds)
        .subscribe((res) => {
          if (res.success) {
            this.watchOverCenterDataList = res.data;
            this.StationPunchCardPeople = this.watchOverCenterDataList.length;
          }
        });
    }
  }

  // 打卡信息开关
  isDisabled = true;

  switchChange() {
    if (this.switchValue == true) {
      this.punchCard = true;
      this.isDisabled = false;
      this.findNowWorkNumByStation();
    } else {
      this.punchCard = false;
      this.isDisabled = true;
      this.map.remove(this.punchCardMarkerArr);
    }
  }

  // 打卡类型选择
  punchCardValueChange() {
    this.findNowWorkNumByStation();
  }

  // 值守中心选择
  watchOverCenterChange($event: any) {
    this.showList = false;
    this.virOrgIds = [];
    this.virOrgIds.push($event.id);
    this.findNowWorkNumByStation();
  }

  // 点击获取人数详情
  showList = false;
  employeeDeptName: any;

  onClick(item: any) {
    this.employeeDeptName = item.name;
    this.itemVirOrgIds = [];
    this.itemVirOrgIds.push(item.id);
    this.findNowWorkNumByStationAndVirOrg();
    this.showList = true;
  }

  // 返回上一级
  back() {
    this.showList = false;
  }

  // 工班模式查询
  getWorkShiftQuery() {
    this.groupListOfDataForMap = [];
    this.map.remove(this.gangMarkerArr);
    setTimeout(() => {
      this.findStationFromMap();
    }, 1000);
  }

  // 查询-关联站点选择
  workStationChange($event: any) {
  }

  /**
   * 站点的物资图片
   */
  stationGoodsImg(count: number, id?: string): string {
    let imgUrl = '';
    if (count === 1) {
      imgUrl = 'assets/icon-goods3.png';
      if (id && this.filterStationIds.has(id)) {
        imgUrl = 'assets/icon-goodsbig.png';
      }
    }
    if (count > 5) {
      imgUrl = 'assets/icon-goods1.png';
      if (id && this.filterStationIds.has(id)) {
        imgUrl = 'assets/big_5.png';
      }
    }
    if (count > 1 && count <= 5) {
      imgUrl = 'assets/icon-goods5.png';
      if (id && this.filterStationIds.has(id)) {
        imgUrl = 'assets/big_3.png';
      }
    }
    return imgUrl;
  }

  goodsCloseDrawer(str: string): void {
    this.showOrClose(str);
  }

  showOrClose(str: string): void {
    // @ts-ignore
    this[str] = !this[str];
  }

  /**
   * 调配操作
   **/
  deployment(data: any, idx: number): void {
    this.showOrClose('goodsChildrenVisible');
    this.suppliesId = this.woreHouseDetailData[idx].id;
    const list = [data.matName, data.totalNum, data.keeper.employeeName, data.keeper.mobile];
    list.forEach((i, index) => this.deploymentListRender(index, i));
    console.log(this.woreHouseId);
    this.deploymentListObtain();
    this.selectEvent = {id: null, eventName: null};
  }

  deploymentListObtain(): void {
    this.http.get('/service/supplies-system/admin/suppliesWarehouseAdminApi/getWarehouseAllList').subscribe((res) => {
      this.aimList = res.data
        .map((item: any) => {
          return {label: item.name, value: item.id};
        })
        .filter((item: any) => item.value != this.woreHouseId);
    });
  }

  deploymentListRender(idx: number, val: any): void {
    this.deploymentList[idx].val = val;
  }

  goodsNameChange(): void {
  }

  stationsSet(ids: string[]): void {
    this.filterStationIds.clear();
    ids.forEach((item) => this.filterStationIds.add(item));
  }

  findFilterStation(status: number = 1): Promise<string[]> {
    return new Promise((resolve) => {
      const postData = {
        suppliesId: this.goodsName,
        suppliesTagId: this.goodsAttribute,
        displayStatus: status,
      };
      this.http.post('/service/supplies-system/admin/SuppliesDistributionAdminApi/getSuppliesStationList', postData).subscribe((res) => {
        resolve(res.data.filter((item: any) => item.displayStatus === 2).map((item: any) => item.id));
      });
    });
  }

  changeGoodsList(): void {
    this.goodsList.forEach((item) => (item.picImg = this.stationGoodsImg(item.count, item.id)));
  }

  tabChange(e: any): void {
  }

  idxChange(str: string): void {
    // if (str === 'add' && this.tabIdx < this.tabs.length - 1) {
    //   this.tabIdx++;
    // }
    // if (str === 'del' && this.tabIdx > 0) {
    //   this.tabIdx--;
    // }
  }

  tabsItemClick(idx: number): void {
    this.tabs.forEach((item) => (item.checked = false));
    this.tabs[idx].checked = true;
    this.woreHouseId = this.tabs[idx].id;
    this.wareHouseDetail();
  }

  spanStyleChecked(idx: number): string {
    let res = this.tabs[idx].checked ? 'border' : '';
    return res;
  }

  newProvision(): void {
    this.provisioningSettings.push({count: 0, warehouseId: '', remark: ''});
    this.calculateTotal();
  }

  delProvision(idx: number): void {
    if (this.provisioningSettings.length === 1) {
      return;
    }
    this.provisioningSettings.splice(idx, 1);
    this.calculateTotal();
  }

  delShow(): string {
    return this.provisioningSettings.length === 1 ? 'none' : '';
  }

  async goodsHttp(): Promise<any> {
    Promise.all([this.woreHouseNameObtain(), this.woreHouseUseObtain(), this.clearSearch()]);
    const goodList = await this.findHasEmergencyWarehouseStation();
    await this.getMarker2(goodList);
  }

  clearSearch(): void {
    this.goodsName = '';
    this.goodsAttribute = '';
  }

  woreHouseNameObtain(): void {
    this.http.get('/service/supplies-system/admin/SuppliesAdminApi/getSuppliesList').subscribe((res) => {
      this.goodsNameList = res.data.map((item: any) => {
        return {label: item.matName, value: item.id};
      });
    });
  }

  woreHouseUseObtain(): void {
    this.http.get('/service/supplies-system/admin/SuppliesSceneTagAdminApi/getSuppliesSceneTagList').subscribe((res) => {
      this.goodsAttributeList = res.data.map((item: any) => {
        return {label: item.tagName, value: item.id};
      });
    });
  }

  /** 查询有应急仓库的站点 */
  findHasEmergencyWarehouseStation(): Promise<GoodsItem[]> {
    return new Promise<GoodsItem[]>((resolve) => {
      const postData = {
        suppliesId: '',
        suppliesTagId: '',
        displayStatus: 1,
      };
      this.goodsList = [];
      this.http.post('/service/supplies-system/admin/SuppliesDistributionAdminApi/getSuppliesStationList', postData).subscribe((res) => {
        const hasWareHouseList = res.data.filter((item: any) => item.displayStatus === 1);
        hasWareHouseList.forEach((item: any) =>
          this.goodsList.push({
            id: item.id,
            count: item.warehouseNumber,
            name: item.name,
            type: 'goods',
            metroLineId: item.metroLineId,
            coordinate: [item.longitude, item.latitude],
            paintPoint: [item.longitude, item.latitude],
            picImg: this.stationGoodsImg(item.warehouseNumber),
          }),
        );
        resolve(this.goodsList);
      });
    });
  }

  calculateTotal(): void {
    queueMicrotask(() => {
      this.totalProvisioningCount = this.provisioningSettings.reduce((pre, cur) => {
        return pre + cur.count;
      }, 0);
    });
  }

  delGoodsChildrenVisible(): void {
    this.goodsChildrenVisible = !this.goodsChildrenVisible;
    this.wareHouseDetail();
    this.provisioningSettings = [];
  }

  initiateDeployment(): void {
    const postData: any = {};
    postData.sourceWarehouseId = this.woreHouseId;
    postData.suppliesId = this.suppliesId;
    postData.distributionWarehouseSuppliesVOS = this.provisioningSettings;
    for (let i = 0; i < this.provisioningSettings.length; i++) {
      if (this.provisioningSettings[i].count === 0) {
        this.msgSrv.warning('调配数量不能为0');
        return;
      }
      if (!this.provisioningSettings[i].count) {
        this.msgSrv.warning('调配数量不能为空');
        return;
      }
      if (!this.provisioningSettings[i].warehouseId) {
        this.msgSrv.warning('调配地点不能为空');
        return;
      }
      if (!this.provisioningSettings[i].remark) {
        this.msgSrv.warning('备注不能为空');
        return;
      }
    }
    if (!this.selectEvent.id) {
      this.msgSrv.warning("选择的应急事件不能为空");
      return;
    } else {
      postData.eventId = this.selectEvent.id;
      postData.eventName = this.selectEvent.eventName;
      postData.submitEmployeeId = this.thirdId;
      postData.submitEmployeeName = this.employeeName;
    }
    if (this.totalProvisioningCount > +this.deploymentList[1].val) {
      this.msgSrv.warning('调配数量不能大于库存物资');
      return;
    }
    this.http
      .post('/service/supplies-system/admin/SuppliesDistributionAdminApi/distributionWarehouseSupplies', postData)
      .subscribe((res) => {
        if (res.success) {
          this.msgSrv.success(res.message);
          this.delGoodsChildrenVisible();
        } else {
          this.msgSrv.error(res.message);
        }
      });
  }

  searchGoods(): void {
    Promise.resolve(this.findFilterStation(2)).then((res: string[]) => {
      const operationList = [
        this.stationsSet.bind(this, res),
        this.changeGoodsList.bind(this, res),
        this.getMarker2.bind(this, this.goodsList),
      ];
      Promise.all(operationList.map((fn) => fn()));
    });
  }

  clearGoods(): void {
    this.map.remove(this.goodsMarkerArr);
    this.goodsName = '';
    this.goodsAttribute = '';
    this.searchGoods();
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
  keeper: any;
}

interface ProvisioningSettingItem {
  count: number;
  warehouseId: string;
  remark: string;
}
