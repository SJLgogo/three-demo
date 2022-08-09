import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-st-ellipsis',
  templateUrl: './st-ellipsis.component.html'
})
export class StEllipsisComponent implements OnInit {
  static readonly KEY = 'ellipsis';
  length = 100;
  tooltip = true;
  value: any;

  constructor() {}

  ngOnInit(): void {}
}
