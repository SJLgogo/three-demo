import { AfterViewInit, Component, OnInit } from '@angular/core';
import { _HttpClient, MenuService, ModalHelper, SettingsService, TitleService } from '@delon/theme';
import { NavigationCancel, NavigationEnd, NavigationError, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { PermissionService } from '../service/permission.service';
import { ACLService } from '@delon/acl';
import { Subject } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '@env/environment';
import {ModuleMenuService} from "../../../core/service/module-menu.service";



@Component({
  selector: 'app-emergency-dispatch-index',
  templateUrl: './index.component.html',
})
export class EmergencyDispatchIndexComponent implements AfterViewInit {
  isFetching = false;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private http: _HttpClient,
    _message: NzMessageService,
    private modal: ModalHelper,
    private titleService: TitleService,
    private router: Router,
    private settingsService: SettingsService,
    private permissionService: PermissionService,
    private aclService: ACLService,
    private menuService: MenuService,
    private moduleMenuService: ModuleMenuService,
  ) {
    router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((evt) => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        if (evt instanceof NavigationError) {
          _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        }
        return;
      }
      if (!(evt instanceof NavigationEnd || evt instanceof RouteConfigLoadEnd)) {
        return;
      }
      if (this.isFetching) {
        setTimeout(() => {
          this.isFetching = false;
        }, 100);
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.loadMenu();
    this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd)).subscribe(() => {
      this.titleService.setTitle('应急管理系统');
    });
  }

  menuJsonFilterPermission = [];
  loadMenu() {
    this.menuService.clear();
    // let menuJson = {
    //   text: '',
    //   group: true,
    //   hideInBreadcrumb: true, // 隐藏面包屑
    //   children: [],
    // };
    //
    // if (environment.isHsline) {
    //   //杭绍线
    //   menuJson.children = [
    //     {
    //       text: '首页',
    //       link: '/emergency-dispatch/emergency-home',
    //       icon: { type: 'icon', value: 'home' },
    //     },
    //     {
    //       text: '正在进行的事件',
    //       link: '/emergency-dispatch/emergency-ongoing-event',
    //       icon: { type: 'icon', value: 'file-text' },
    //     },
    //     {
    //       text: '应急事件历史报表',
    //       link: '/emergency-dispatch/emergency-history-report',
    //       icon: { type: 'icon', value: 'pie-chart' },
    //     },
    //     {
    //       text: '应急值守管理',
    //       link: '/emergency-dispatch/emergency-watch-over-management',
    //       identifiers: 'emergency-config:menu:view',
    //       shortcutRoot: true,
    //       icon: { type: 'icon', value: 'user' },
    //     },
    //     // {
    //     //   text: '应急物资管理',
    //     //   link: '/emergency-dispatch/emergency-goods-manage',
    //     //   icon: { type: 'icon', value: 'hdd' },
    //     // },
    //     {
    //       text: '应急规章制度管理',
    //       link: '/emergency-dispatch/emergency-plan-manage',
    //       icon: { type: 'icon', value: 'profile' },
    //     },
    //     {
    //       text: '应急GIS地图',
    //       link: '/emergency-dispatch/emergency-map/emergency-map',
    //       shortcutRoot: true,
    //       identifiers: 'emergency-config:menu:view',
    //       icon: { type: 'icon', value: 'global' },
    //     },
    //     {
    //       text: '基础数据管理',
    //       link: '',
    //       icon: { type: 'icon', value: 'database' },
    //       children: [
    //         {
    //           text: '事件大类型',
    //           link: '/emergency-dispatch/emergency-big-category',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-big-category:menu:view',
    //           nzSelectable: true,
    //           shortcutRoot: true,
    //         },
    //         {
    //           text: '事件类型设置',
    //           link: '/emergency-dispatch/emergency-category',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-category:menu:view',
    //           shortcutRoot: true,
    //         },
    //         {
    //           text: '事件等级设置',
    //           link: '/emergency-dispatch/emergency-level',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-level:menu:view',
    //         },
    //         {
    //           text: '应急区域设置',
    //           link: '/emergency-dispatch/emergency-area',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-area:menu:view',
    //         },
    //         {
    //           text: '应急规章制度类型设置',
    //           link: '/emergency-dispatch/emergency-regulatory-framework',
    //           icon: { type: 'icon', value: 'setting' },
    //           shortcutRoot: true,
    //           identifiers: 'emergency-level:menu:view',
    //         },
    //         {
    //           text: '应急处置要点设置',
    //           link: '/emergency-dispatch/emergency-point-set',
    //           icon: { type: 'icon', value: 'setting' },
    //         },
    //         {
    //           text: '应急标签设置',
    //           link: '/emergency-dispatch/emergency-tag',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-tag:menu:view',
    //         },
    //         {
    //           text: '应急通知标签组设置',
    //           link: '/emergency-dispatch/emergency-inform-tag',
    //           icon: { type: 'icon', value: 'setting' },
    //           shortcutRoot: true,
    //           identifiers: 'emergency-inform-tag:menu:view',
    //         },
    //         {
    //           text: '定位识别范围',
    //           link: '/emergency-dispatch/location-config',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-config:menu:view',
    //         },
    //         {
    //           text: '虚拟组织架构',
    //           link: '/emergency-dispatch/emergency-scope',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-scope:menu:view',
    //         },
    //       ],
    //     },
    //   ];
    // } else {
    //   // 三公司
    //   menuJson.children = [
    //     {
    //       text: '应急管理',
    //       link: '',
    //       icon: { type: 'icon', value: 'appstore' },
    //       children: [
    //         {
    //           text: '应急事件历史报表',
    //           link: '/emergency-dispatch/emergency-history-report',
    //         },
    //       ],
    //     },
    //     {
    //       text: '基础数据管理',
    //       link: '',
    //       icon: { type: 'icon', value: 'appstore' },
    //       children: [
    //         {
    //           text: '事件大类型',
    //           link: '/emergency-dispatch/emergency-big-category',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-big-category:menu:view',
    //           nzSelectable: true,
    //           shortcutRoot: true,
    //         },
    //         {
    //           text: '事件类型设置',
    //           link: '/emergency-dispatch/emergency-category',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-category:menu:view',
    //           shortcutRoot: true,
    //         },
    //         {
    //           text: '事件等级设置',
    //           link: '/emergency-dispatch/emergency-level',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-level:menu:view',
    //         },
    //         {
    //           text: '应急区域设置',
    //           link: '/emergency-dispatch/emergency-area',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-area:menu:view',
    //         },
    //         // {
    //         //   text: '应急站点设置',
    //         //   link: '/emergency-dispatch/emergency-station',
    //         //   icon: { type: 'icon', value: 'setting' },
    //         //   identifiers: 'emergency-station:menu:view',
    //         // },
    //         {
    //           text: '应急标签设置',
    //           link: '/emergency-dispatch/emergency-tag',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-tag:menu:view',
    //         },
    //         {
    //           text: '班次管理',
    //           link: '/emergency-dispatch/employee-shift-category',
    //           icon: { type: 'icon', value: 'setting' },
    //           shortcutRoot: true,
    //           identifiers: 'emergency-shift-category:menu:view',
    //         },
    //         {
    //           text: '班表信息管理',
    //           link: '/emergency-dispatch/employee-shift',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-shift:menu:view',
    //         },
    //         {
    //           text: '定位识别范围',
    //           link: '/emergency-dispatch/location-config',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-config:menu:view',
    //         },
    //         {
    //           text: '虚拟组织架构',
    //           link: '/emergency-dispatch/emergency-scope',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-scope:menu:view',
    //         },
    //         {
    //           text: '应急预案文件',
    //           link: '/emergency-dispatch/emergency-plan-file',
    //           icon: { type: 'icon', value: 'setting' },
    //           identifiers: 'emergency-plan-file:menu:view',
    //         },
    //       ],
    //     },
    //   ];
    // }
    // this.menuJsonFilterPermission = [
    //   {
    //     text: '',
    //     group: true,
    //     hideInBreadcrumb: true, // 隐藏面包屑
    //     children: menuJson.children,
    //   },
    // ];
    // this.menuService.add(this.menuJsonFilterPermission);

    console.log(this.moduleMenuService.getMenuList('2c9083e77e8cbc49017e8f4c9bc20029'), 'menuService');
    const menuJson = this.moduleMenuService.getMenuList('2c9083e77e8cbc49017e8f4c9bc20029');
    menuJson[0].text = '';
    this.menuService.add(menuJson);
    const value = JSON.parse(<string>localStorage.getItem('employee'));
    console.log(value);
    this.permissionService.loadPermission(value.employeeId);
    // 加载所有web权限
    // this.http.get(`/service/emergency-base-config/admin/role/findPermissionByRoles/`).subscribe(res => {
    //   if ( res.success ){
    //     let identifiers=[];
    //     res.data.forEach(function(value,index,array) {
    //       identifiers.push(value.identifier);
    //     });
    //     let menuJsonFilter=[];
    //     const app: any = {
    //       name: `HuizTech`,
    //       description: ``,
    //       identifiers:identifiers
    //     };
    //     this.settingsService.setApp(app);
    //     this.aclService.setFull(true);
    //     if(identifiers.length>0){
    //        menuJsonFilter= menuJson.children.filter((value) => identifiers.includes(value.identifiers));
    //        // menuJsonFilter= menuJson.children;
    //     }
    //     // 过滤后的权限
    //     this.menuJsonFilterPermission= [{
    //       text: '设置',
    //       group: true,
    //       hideInBreadcrumb:true,// 隐藏面包屑
    //       children:menuJsonFilter,
    //     }];
    //     console.log("设置:",this.menuJsonFilterPermission);
    //     this.menuService.add(this.menuJsonFilterPermission);
    //   }
    // });

    // let menuJsonFilter= menuJson.children;
    //  //过滤后的权限
    //   this.menuJsonFilterPermission= [{
    //      text: '应急调度系统',
    //      group: true,
    //      hideInBreadcrumb:true,//隐藏面包屑
    //     children:menuJsonFilter,
    //    }];
    //   console.log("设置:",this.menuJsonFilterPermission);
    //  this.menuService.add(this.menuJsonFilterPermission);
  }
}
