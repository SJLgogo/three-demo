import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';

import { Base } from '../../../../api/common/base';

@Component({
  selector: 'measure-item',
  templateUrl: './measure-item.component.html',
  styleUrls: ['./measure-item.css']
})
export class measureItemComponent extends Base implements OnInit {
  constructor(private http: _HttpClient, private messageService: NzMessageService) {
    super();
  }
  @Input() itemDetail: any;
  @Output() deleteItem = new EventEmitter();
  downloadUrl = '';
  isEdit = false;
  fileList: NzUploadFile[] = []; //上传文件列表
  uploading = false;
  changeMeasure: any = {}; //编辑处置措施
  postCfg = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  };
  originData: any = {};
  isAddImg: any = true;

  editDetail() {
    if (this.itemDetail.employeeId == this.itemDetail.thirdId) {
      this.originData.resources = JSON.stringify(this.itemDetail.resources);
      this.originData.description = this.itemDetail.description;
      this.isEdit = true;
    } else {
      this.messageService.warning('提示：您无更改权限');
    }
  }

  cancel() {
    this.itemDetail.resources = JSON.parse(this.originData.resources);
    this.itemDetail.description = this.originData.description;
    this.isEdit = false;
  }

  save() {
    this.changeMeasure.id = this.itemDetail.id;
    this.changeMeasure.description = this.itemDetail.description;
    this.changeMeasure.resources = this.itemDetail.resources;
    this.http.post(`/service/emergency-measures/measure/change/measure`, '', this.changeMeasure, this.postCfg).subscribe(res => {
      if (res.success) {
        this.messageService.success('提示：更改成功');
        this.isEdit = false;
      }
    });
  }
  delete() {
    if (this.itemDetail.employeeId == this.itemDetail.thirdId) {
      this.http
        .get(`/service/emergency-measures/measure/delete/measure/${this.itemDetail.id}/${this.itemDetail.eventId}`)
        .subscribe(res => {
          if (res.success) {
            const status = true;
            this.deleteItem.emit(status);
            this.messageService.success('提示：删除成功');
          } else {
            this.messageService.warning('提示：删除失败');
          }
        });
    } else {
      this.messageService.warning('提示：您无删除权限');
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    this.handleUpload();
    return false;
  };

  /* 上传附件 */
  handleUpload() {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    this.uploading = true;
    this.http.post(`/api/upload`, formData).subscribe(res => {
      if (res.success) {
        this.itemDetail.resources.push(res.data.url);
      }
    });
    if (this.itemDetail.resources.length == 5) {
      this.isAddImg = false;
    } else {
      this.isAddImg = true;
    }
  }

  /* 删除图片 */
  deleteImg(i: any) {
    this.itemDetail.resources.splice(i, 1);
    console.log(this.isEdit);
    if (this.itemDetail.resources.length == 6) {
      this.isAddImg = false;
    } else {
      this.isAddImg = true;
    }
  }
  ngOnInit() {}
}
