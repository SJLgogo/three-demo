import { ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { ControlWidget, SFComponent, SFItemComponent, SFValue } from '@delon/form';
import { SystemDictDataService } from '../../../api/system/system-dict-data.service';
import { NzSelectModeType } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-sf-dict',
  templateUrl: './sf-dict.component.html',
  styleUrls: []
})
export class SfDictComponent extends ControlWidget implements OnInit {
  static readonly KEY = 'dict';
  config: any;
  // @ts-ignore
  loadingTip: string;
  _value: any;
  // @ts-ignore
  placeholder: string;
  dictDisabled = false;
  typeValue = '';
  mode: NzSelectModeType = 'default';
  selectSources: any[] = [];

  constructor(
    @Inject(ChangeDetectorRef) public override readonly cd: ChangeDetectorRef,
    @Inject(Injector) public override readonly injector: Injector,
    @Inject(SFItemComponent) public override readonly sfItemComp?: SFItemComponent,
    @Inject(SFComponent) public override readonly sfComp?: SFComponent,
    @Inject(SystemDictDataService) private systemDictService?: SystemDictDataService
  ) {
    super(cd, injector, sfItemComp, sfComp);
  }

  ngOnInit(): void {
    this.loadingTip = this.ui['loadingTip'] || '加载中……';
    this.placeholder = this.ui['placeholder'] || '';
    this.typeValue = this.ui['typeValue'] || '';
    this.config = this.ui['config'] || {};
    this.mode = this.ui['mode'] || 'default';
    this.dictDisabled = this.ui['dictDisabled'] || false;
    this.systemDictService?.findAllTypeValue(this.typeValue).subscribe(res => {
      if (res.success) {
        this.selectSources = res.data;
        this.detectChanges(true);
      }
    });
  }

  getData = () => {
    return this._value;
  };
  // @ts-ignore
  setData = value => {
    if (value !== this._value) {
      this._value = value;
      this.detectChanges(true);
    }
  };

  override reset(value: SFValue): void {
    this.setData(value);
  }

  change(value: string): void {
    if (this.ui['change']) {
      this.ui['change'](value);
    }
    this.setValue(value);
  }
}
