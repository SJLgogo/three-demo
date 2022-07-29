import { Component, OnInit, Input, Output } from '@angular/core';
import {Base} from "../../../../api/common/base";

@Component({
  selector: 'emergency-item',
  templateUrl: './emergency-item.component.html',
  styleUrls: ['./emergency-item.css'],
})
export class emergencyItemComponent extends Base implements OnInit {
  @Input() itemDetail: any;
  ngOnInit() {}
}
