import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Base} from "../../../../api/common/base";

@Component({
  selector: 'category-choose',
  templateUrl: './category-choose.component.html',
  styleUrls: ['./category-choose.css'],
})
export class categoryChooseComponent extends Base implements OnInit {
  @Output() categoryStatus = new EventEmitter();
  showClassify: Boolean = true;
  ngOnInit() {}
  //将组件的状态传递给父组件
  classifyChoose() {
    this.showClassify = !this.showClassify;
    this.categoryStatus.emit(this.showClassify);
  }
}
