import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {SFComponent, SFSchema, SFSchemaEnumType, SFSelectWidgetSchema, SFUISchema,} from '@delon/form';
import {LineNetworkService} from '../../service/line-network.service';
import {DictionaryService} from '../../service/dictionary.service';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-emergency-dispatch-emergency-tag-edit',
  templateUrl: './edit.component.html',
})
export class EmergencyDispatchEmergencyGoodsEditComponent implements AfterViewInit,OnInit {
  record: any = {};
  i: any;
  mode: any;

  @ViewChild('sf', { static: false }) sf!: SFComponent;
  schema: SFSchema = {
    properties: {
      matName: { type: 'string', title: '物资名称', maxLength: 15 },
      matNo: { type: 'string', title: '物资编号', maxLength: 15 },
      matUnit: { type: 'string', title: '单位', maxLength: 15 },
      matSpec: { type: 'string', title: '规格型号', maxLength: 20 },
      tag:{
          type: 'string',
          title: '物资标签名称',
          // tslint:disable-next-line:no-object-literal-type-assertion
          ui: {
            widget: 'select',
            mode: 'tags',
            asyncData: () => {
              return this.http.get("/service/supplies-system/admin/SuppliesSceneTagAdminApi/getSuppliesSceneTagList").pipe(
                map((item) => {
                  console.log(item);
                  const children = item.data.map((element:any ) => {
                    return { label: element.tagName, value:element.id };
                  });
                  const type: SFSchemaEnumType = [
                    {
                      label: '应急物资标签列表',
                      group: true,
                      children,
                    },
                  ];
                  this.typeList = children;
                  return type;
                }),
              );
            },
            change: (ngModel:any ) => {
              /**
               * 需要刷新表单时设置当前的属性值
               */
              console.log(ngModel);
              const arr:any  = [];
              for (let i = 0; i < ngModel.length; i++) {
                this.typeList.forEach((item:any )=>{
                  if(ngModel[i]==item.value){
                    arr.push({id:item.value,tagName:item.label});
                  }
                })
              }
              this.i.suppliesSceneTagVOS = arr;
            },

          } as unknown as SFSelectWidgetSchema,
      }
    },
    required: ['matName', 'matUnit','matSpec'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 150,
      grid: { span: 12 },
    },
  };
  private typeList = [];
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
    if(this.mode === "edit" && this.i.suppliesSceneTagVOS){
      const arr:any  = [];
      this.i.suppliesSceneTagVOS.forEach((item:any )=>{
        arr.push(item.id)
      })
      this.i.tag = arr
      console.log(this.i);
    }
  }


  save(value: any):any {
    if(value.id == ''){
      delete value.id;
    }
    console.log(value);
    if(this.isBlank(value.matName)||this.isBlank(value.matUnit)||this.isBlank(value.matSpec)){
      this.msgSrv.error("请检查数据");
      return;
    }
    this.http.post(`/service/supplies-system/admin/SuppliesAdminApi/addSupplies`, value).subscribe((res) => {
      if(res.success){
        this.msgSrv.success('保存物资成功');
        this.modalRef.close(true);
      }else{
        this.msgSrv.error('保存物资失败'+res.message);
      }
    });

  }

  isBlank(value:any ){
    if(value === ""||value ===null||value === undefined){
      return true;
    }else {
      return false
    }
  }

  close() {
    this.modalRef.destroy();
  }
}
