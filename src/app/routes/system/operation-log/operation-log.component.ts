import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { Constant } from '../../../common/constant';

@Component({
  selector: 'app-system-operation-log',
  templateUrl: './operation-log.component.html'
})
export class SystemOperationLogComponent implements OnInit {
  url = `/service/system/system-operation-log/page-all`;
  searchSchema: SFSchema = {
    properties: {
      param: {
        type: 'string',
        title: '查询参数',
        ui: {
          width: 300,
          placeholder: '请输入调用方法、请求url、ip'
        }
      }
    }
  };
  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '序号', type: 'no' },
    { title: '模块', index: 'title' },
    { title: '请求ip', index: 'operationIp' },
    {
      title: '调用方法',
      index: 'method',
      type: 'widget',
      widget: {
        type: 'ellipsis',
        params: ({ record }) => ({
          value: record.method,
          length: 50
        })
      }
    },
    { title: '请求url', index: 'operationUrl' },
    {
      title: '请求参数',
      index: 'requestParam',
      type: 'widget',
      widget: {
        type: 'ellipsis',
        params: ({ record }) => ({
          value: record.requestParam,
          length: 50
        })
      }
    },
    { title: '状态', index: 'status', type: 'tag', tag: Constant.successOrFailureTag },
    {
      title: '返回结果',
      index: 'jsonResult',
      type: 'widget',
      widget: {
        type: 'ellipsis',
        params: ({ record }) => ({
          value: record.jsonResult,
          length: 50
        })
      }
    },
    { title: '操作时间', index: 'createTime', type: 'date' },
    {
      title: '错误信息',
      index: 'errorMsg',
      type: 'widget',
      widget: {
        type: 'ellipsis',
        params: ({ record }) => ({
          value: record.errorMsg,
          length: 50
        })
      }
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) {}

  ngOnInit(): void {}

  add(): void {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }

  refresh(): void {
    this.st.reload();
  }
}
