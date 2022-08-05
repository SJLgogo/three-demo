import {AfterViewInit, Component, OnInit} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Base} from "../../../../common/base";

interface ItemData {
  id: string;
  tagName: string;
}


@Component({
  selector: 'app-emergency-dispatch-emergency-scene-tag-edit',
  templateUrl: './edit.component.html',
  styles:[`
      .add-row {
          color: #2c99ff;
          margin-left: 5px;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
      }
  `]
})
export class EmergencyDispatchSceneTagEditComponent extends Base implements OnInit, AfterViewInit {
  constructor(private http: _HttpClient, private messageService: NzMessageService) {
    super();
  }

  listOfData: any[] = [];
  editCache: any = {};

  ngOnInit(): void {
    this.getAllSceneTag();
  }

  ngAfterViewInit(): void {
    this.getAllSceneTag();
  }

  getAllSceneTag() {
    this.http.get(`/service/supplies-system/admin/SuppliesSceneTagAdminApi/getSuppliesSceneTagList`).subscribe((res) => {
      if (res.success) {
        this.listOfData = res.data;
        this.updateEditCache();
      }
    });
  }

  startEdit(id: string): any {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex((item: any) => item.id === id);
    if (id === 'new') {
      this.deleteRow(id);
    } else {
      this.editCache[id] = {
        data: {...this.listOfData[index]},
        edit: false,
      };
    }
  }

  deleteRow(id: any): void {
    if (id === 'new') {
      this.listOfData = this.listOfData.filter((d: any) => d.id !== id);
      delete this.editCache.new;
    } else {
      this.http.get(`/service/supplies-system/admin/SuppliesSceneTagAdminApi/deleteSceneTag/` + id).subscribe((res) => {
        if (res.success) {
          this.listOfData = this.listOfData.filter((d: any) => d.id !== id);
          delete this.editCache.new;
        } else {
          this.messageService.error(res.message);
        }
      });
    }
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex((item: any) => item.id === id);
    if (this.editCache[this.listOfData[index].id].data.tagName == '') {
      this.messageService.warning('标签名称不能为空');
      return;
    }
    const data: any = {id: this.listOfData[index].id, tagName: this.editCache[this.listOfData[index].id].data.tagName};
    if (id === 'new') {
      delete data.id;
    }
    this.http.post(`/service/supplies-system/admin/SuppliesSceneTagAdminApi/newSuppliesSceneTag`, data).subscribe((res) => {
      if (res.success) {
        this.getAllSceneTag();
        console.log(this.editCache);
        this.deleteRow('new');
      } else {
        this.messageService.error(res.message);
      }
    });
  }

  updateEditCache(): void {
    this.listOfData.forEach((item: any) => {
      this.editCache[item.id] = {
        edit: false,
        data: {...item},
      };
    });
  }

  addRow(): void {
    console.log(this.editCache);
    if (!this.editCache.hasOwnProperty('new')) {
      this.listOfData = [
        ...this.listOfData,
        {
          id: `new`,
          tagName: ``,
        },
      ];
      this.editCache.new = {
        data: {id: `new`, tagName: ``},
        edit: true,
      };
    }
  }

}
