import { AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import {
  isBlank,
  SFComponent,
  SFSchema, SFSchemaEnum, SFSchemaEnumType, SFSelectWidgetSchema,
  SFUISchema,
} from '@delon/form';
import { LineNetworkService } from '../../service/line-network.service';
import { DictionaryService } from '../../service/dictionary.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-emergency-dispatch-emergency-choose-role',
  templateUrl: './choose-role.component.html',
})
export class EmergencyDispatchChooseRoleComponent implements AfterViewInit,OnInit {
  record: any = {};
  i: any;
  mode: any;
  eventId:any;
  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      role:{
          type: 'string',
          title: '岗位名称',
          // tslint:disable-next-line:no-object-literal-type-assertion
          ui: {
            widget: 'select',
            asyncData: () => {
              return this.http.get("/service/emergency-base-config/admin/emergencyPointApi/getPointRoleList").pipe(
                map((item) => {
                  console.log(item);
                  const children = item.data.map((element:any) => {
                    return { label: element.name, value:element.id };
                  });
                  const type: SFSchemaEnumType = [
                    {
                      label: '岗位列表',
                      group: true,
                      children,
                    },
                  ];
                  return type;
                }),
              );
            },
            // change: (ngModel) => {
            //   /**
            //    * 需要刷新表单时设置当前的属性值
            //    */
            //   console.log(ngModel);
            //   const arr = [];
            //   for (let i = 0; i < ngModel.length; i++) {
            //     this.typeList.forEach(item=>{
            //       if(ngModel[i]==item.value){
            //         arr.push({id:item.value,tagName:item.label});
            //       }
            //     })
            //   }
            //   this.i.suppliesSceneTagVOS = arr;
            // },

          } as unknown as SFSelectWidgetSchema,
      }
    },
    required: ['role'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150,
      grid: { span: 12 },
    },
  };
  private employee: any;
  ngAfterViewInit(): void {

  }

  constructor(
    private modalRef: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private lineNetworkService: LineNetworkService,
    private dictionaryService: DictionaryService,
    private modal: ModalHelper,
  ) {}

  ngOnInit(): void {
    const value = JSON.parse(<string>window.localStorage.getItem('employee'));
    this.employee = value;
  }


  save(value: any):any {
    console.log(value);
    if(!value.role){
      this.msgSrv.error("请选择岗位");
    }else{
      const data = {
        employeeId: this.employee.thirdPartyAccountUserId,
        eventId: this.i.eventId,
        roleId: value.role,
      }
      console.log(data);
      console.log(this.eventId);
      this.http.post("/service/emergency-event/wxcp/EmergencyPointApi/saveEventRole",data).subscribe(res=>{
        if(res.success){
          this.modalRef.close(value);
        }else{
          this.msgSrv.error("后台错误");
        }
      })
    }
  }

  cancel(){

  }

  close() {

    this.modalRef.destroy();
  }
}
