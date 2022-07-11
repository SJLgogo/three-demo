/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
  selector: 'app-select-employee-button',
  templateUrl: './select-employee-button.component.html',
  styles: [],
})
export class SelectEmployeeButtonComponent extends ControlWidget implements OnInit {
  ngOnInit(): void {}
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'range-input';

  // 价格区间
  from: any;
  to: any;

  getRange = () => {
    return {
      from: this.from,
      to: this.to,
    };
  };

  // 点击button按钮设置ui change值
  onChange() {
    if (this.ui['change']) this.ui['change'](1);
  }


  // reset 可以更好的解决表单重置过程中所需要的新数据问题
  // reset(value: any) {}
}
