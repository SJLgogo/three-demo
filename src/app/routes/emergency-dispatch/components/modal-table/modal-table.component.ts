import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STColumnButton } from '@delon/abc/st';
import { Base } from 'src/app/common/base';

@Component({
  selector: 'app-modal-table',
  templateUrl: './modal-table.component.html',
})
export class ModalTable extends Base implements OnInit {
  i: any = {};
  url!: string;
  override customRequest: any = {
    allInBody: true,
    method: 'POST',
    reName: {
      pi: 'page',
      ps: 'pageSize',
    },
    lazyLoad: true,
  };

  constructor(private http: _HttpClient, private modal: ModalHelper) {
    super();
  }

  @ViewChild('st', { static: false }) st: STComponent | undefined;
  columns: STColumn[] = [
    {
      title: '头像',
      type: 'img',
      index: 'employeeAvatar',
    },
    {
      title: '姓名',
      index: 'employeeName',
    },
    {
      title: '部门',
      index: 'employeeDeptName',
    },
  ];

  ngAfterViewInit(): void {
    delete this.i.page;
    delete this.i.pageSize;
    // @ts-ignore
    this.st.load(1, this.i);
  }

  ngOnInit(): void {}
}
