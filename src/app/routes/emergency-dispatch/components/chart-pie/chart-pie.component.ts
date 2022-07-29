import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {Base} from "../../../../api/common/base";

@Component({
  selector: 'chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.css'],
})
export class chartPieComponent extends Base implements OnInit {
  value: false | undefined;
  @Input() chartPieData: any;
  @Input() color: any;
  // @ts-ignore
  percent:any = null;
  ngOnInit() {
    this.computePercent();
  }
  //计算应急响应情况百分比方法
  computePercent() {
    let a: any;
    let c: any;
    if (this.chartPieData[0] != 0 || this.chartPieData[1] != 0) {
      a = this.chartPieData[0] / this.chartPieData[1];
      c = Math.floor(a * 100);
    } else {
      c = 0;
    }
    this.percent = c;
  }
}
