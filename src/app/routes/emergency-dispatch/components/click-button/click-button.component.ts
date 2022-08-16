import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Base } from '../../../../common/base';

@Component({
  selector: 'click-button',
  templateUrl: './click-button.component.html',
  styleUrls: ['./click-button.css'],
})
export class clickButtonComponent extends Base implements OnInit {
  ngOnInit() {}
}
