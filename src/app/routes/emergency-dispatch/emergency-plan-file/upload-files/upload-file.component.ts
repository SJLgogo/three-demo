import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { _HttpClient } from '@delon/theme';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { SFComponent, SFSchema } from '@delon/form';
import { environment } from '@env/environment';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styles: [],
})
export class UploadEmergencyPlanFilesComponent implements OnInit {
  constructor(private modal: NzModalRef, private http: _HttpClient, private httpClient: HttpClient, private msg: NzMessageService) {}

  projectId: string | undefined;

  /**
   * 文件上传
   */
  uploading = false;
  fileList: NzUploadFile[] = [];

  @ViewChild('sf', { static: false }) private sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      myCustomWidget: {
        type: 'string',
        title: '项目',
        ui: {
          widget: 'custom',
        },
        default: 'test',
      },
    },
  };

  ngOnInit(): void {}

  /**
   * 点击取消
   */
  del(): void {
    this.modal.destroy();
  }

  /**
   * 点击确定
   */
  sure(): void {
    this.modal.destroy();
  }

  /**
   * 文件上传
   */
  beforeUpload = (file: NzUploadFile): boolean => {
    console.log(1234);
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    console.log(this.fileList);
    const postData: any = {};
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    console.log(formData);
    this.uploading = true;
    this.http.post(`/api/upload`, formData).subscribe((res) => {
      postData.url = res.data.url;
      postData.name = res.data.fileName + '.' + res.data.suffix;
      this.http.post('/service/emergency-base-config/admin/adminEmergencyPlanFileApi/add', postData).subscribe((value) => {
        if (value.success) {
          this.msg.success('上传成功');
          this.modal.close(true);
        } else {
          this.msg.error('上传失败');
        }
      });
    });
  }
}
