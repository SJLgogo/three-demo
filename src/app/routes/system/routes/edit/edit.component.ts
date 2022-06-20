import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { omit } from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { SystemRoutesService } from '../../../../api/system/system-routes.service';

@Component({
  selector: 'app-system-routes-edit',
  templateUrl: './edit.component.html'
})
export class SystemRoutesEditComponent implements OnInit {
  record: any = {};
  i: any;
  public editorOptions: JsonEditorOptions;
  @ViewChild('jsonEditor')
  public jsonEditor!: JsonEditorComponent;

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private systemRoutesService: SystemRoutesService
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'tree', 'view'];
    this.editorOptions.expandAll = true;
  }

  ngOnInit(): void {
    if (this.record.id) {
      this.i = omit(this.record, ['_rowClassName', '_values']);
    }
  }

  save(): void {
    const value = this.jsonEditor.get();
    // @ts-ignore
    if (value.id) {
      this.systemRoutesService.updateRoute(value).subscribe(res => {
        // @ts-ignore
        if (res.success) {
          this.msgSrv.success('修改成功');
          this.modal.close(true);
        }
      });
    } else {
      this.systemRoutesService.addRoute(value).subscribe(res => {
        // @ts-ignore
        if (res.success) {
          this.msgSrv.success('添加成功');
          this.modal.close(true);
        }
      });
    }
  }

  close(): void {
    this.modal.destroy();
  }
}
