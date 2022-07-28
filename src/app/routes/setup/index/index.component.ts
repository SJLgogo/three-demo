/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { _HttpClient, MenuService } from '@delon/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup-index',
  templateUrl: './index.component.html'
})
export class SetupIndexComponent implements OnInit {
  constructor(
    private menuService: MenuService,
    private http: _HttpClient,
    private router: Router
  ) {
  }

  goApp(url: string) {
    this.router.navigate([url], {
      queryParams: {}
    });
  }

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    this.menuService.clear();

    //系统设置菜单id 、数据从后台查询得来。第一次如果没有权限可以先把下面屏蔽的菜单数据打开授权
    // console.log(this.moduleMenuService.getMenuList("ff808081751a80fd01751aa0ae720012"))
    // this.menuService.add(this.moduleMenuService.getMenuList('ff808081751a80fd01751aa0ae720012'));

    this.menuService.add([
      {
        text: '用户授权',
        group: true,
        children: [
          {
            text: '组织机构',
            link: '/setup/security/contact'
            // icon: { type: 'icon', value: 'contacts' },
          },
          {
            text: '账号管理',
            link: '/setup/security/account'
            // icon: { type: 'icon', value: 'contacts' },
          },
          {
            text: '角色权限',
            link: '/setup/security/role-permission'
            // icon: { type: 'icon', value: 'contacts' },
          },
          {
            text: '路由网关',
            link: '/setup/microservice/gateway-route'
            // icon: { type: 'icon', value: 'contacts' },
          },
          {
            text: '菜单管理',
            link: '/setup/security/resource-menu'
            // icon: { type: 'icon', value: 'contacts' },
          }
        ]
      }
    ]);
  }

  add() {
  }
}
