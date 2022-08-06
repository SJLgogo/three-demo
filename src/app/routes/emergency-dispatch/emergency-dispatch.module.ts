import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EmergencyDispatchEmergencyAreaComponent} from "./emergency-area/emergency-area.component";
import {EmergencyDispatchEmergencyAreaEditComponent} from "./emergency-area/edit/edit.component";
import {EmergencyDispatchEmergencyAreaViewComponent} from "./emergency-area/view/view.component";
import {SharedModule} from "@shared";
import {G2PieModule} from "@delon/chart/pie";
import {G2BarModule} from "@delon/chart/bar";
import {DownFileModule} from "@delon/abc/down-file";
import {STModule} from "@delon/abc/st";
import {NzFormModule} from "ng-zorro-antd/form";
import {SVModule} from "@delon/abc/sv";
import {LayoutModule} from "../../layout/layout.module";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {PageHeaderModule} from "@delon/abc/page-header";
import {EmergencyDispatchRoutingModule} from "./emergency-dispatch-routing.module";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {EmergencyDispatchEmergencyBigCategoryComponent} from "./emergency-big-category/emergency-big-category.component";
import {EmergencyDispatchEmergencyBigCategoryEditComponent} from "./emergency-big-category/edit/edit.component";
import {EmergencyDispatchEmergencyBigCategoryViewComponent} from "./emergency-big-category/view/view.component";
import {EmergencyDispatchEmergencyCategoryComponent} from "./emergency-category/emergency-category.component";
import {EmergencyDispatchEmergencyCategoryEditComponent} from "./emergency-category/edit/edit.component";
import {EmergencyDispatchEmergencyCategoryViewComponent} from "./emergency-category/view/view.component";
import {EmergencyDispatchEmergencyGoodsManage} from "./emergency-goods-manage/emergency-goods-manage.component";
import {EmergencyDispatchSceneTagEditComponent} from "./emergency-goods-manage/scene-tag/edit.component";
import {EmergencyDispatchGoodsTagEditComponent} from "./emergency-goods-manage/goods-tag/edit.component";
import {EmergencyDispatchEmergencyGoodsEditComponent} from "./emergency-goods-manage/edit/edit.component";
import {EmergencyDispatchEmergencyGoodsStore} from "./emergency-goods-store/emergency-goods-store.component";
import {EmergencyDispatchGoodsListComponent} from "./emergency-goods-store/goods-list/view.component";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzListModule} from "ng-zorro-antd/list";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {G2SingleBarModule} from "@delon/chart/single-bar";
import {EmergencyDispatchEmergencyLevelComponent} from "./emergency-level/emergency-level.component";
import {EmergencyDispatchEmergencyLevelEditComponent} from "./emergency-level/edit/edit.component";
import {EmergencyDispatchEmergencyLevelViewComponent} from "./emergency-level/view/view.component";
import {EmergencyDispatchEmergencyPlanManage} from "./emergency-plan-manage/emergency-plan-managecomponent";
import { NzSelectModule } from 'ng-zorro-antd/select';
import {EmergencyDispatchEmergencyPointSet} from "./emergency-point-set/emergency-point-set.conmponent";
import {EmergencyDispatchEmergencyInformTagComponent} from "./emergency-inform-tag/emergency-inform-tag.component";
import {EmergencyDispatchEmergencyTagInformViewComponent} from "./emergency-inform-tag/view/view.component";
import {EmergencyDispatchEmergencyTagInformRelatedPersonComponent} from "./emergency-inform-tag/related-person/related-person.component";
import {EmergencyDispatchEmergencyTagInformEditComponent} from "./emergency-inform-tag/edit/edit.component";
import {EmergencyDispatchMapComponent} from "./emergency-map/emergency-map.conmponent";
import {EmergencyDispatchEmergencyMapEditComponent} from "./emergency-map/edit/edit.component";
import {EmergencyDispatchEmergencyPlanFileComponent} from "./emergency-plan-file/emergency-plan-file.component";
import {UploadEmergencyPlanFilesComponent} from "./emergency-plan-file/upload-files/upload-file.component";
import {emergencyDispatchEmergencyRegulatoryFramework} from "./emergency-regulatory-framework/emergency-regulatory-framework.component";
import {EmergencyDispatchEmergencyRoleScopeComponent} from "./emergency-role-scope/emergency-role-scope.component";
import {EmergencyDispatchEmergencyRoleScopeEditComponent} from "./emergency-role-scope/edit/edit.component";
import {EmergencyDispatchEmergencyScopeComponent} from "./emergency-scope/emergency-scope.component";
import {EmergencyDispatchEmergencyScopeEditComponent} from "./emergency-scope/edit/edit.component";
import {EmergencyDispatchEmergencyTagComponent} from "./emergency-tag/emergency-tag.component";
import {EmergencyDispatchEmergencyTagViewComponent} from "./emergency-tag/view/view.component";
import {EmergencyDispatchEmergencyTagRelatedPersonComponent} from "./emergency-tag/related-person/related-person.component";
import {EmergencyDispatchEmergencyTagEditComponent} from "./emergency-tag/edit/edit.component";
import {EmergencyDispatchEmergencyWatchOverManagement} from "./emergency-watch-over-management/emergency-watch-over-management";
import {EmergencyDispatchEmergencyWatchOverManagementEditComponent} from "./emergency-watch-over-management/edit/edit.component";
import {FixPhoneInfoManagementComponent} from "./fix-phone-info-management/fix-phone-info-management.component";
import {FixPhoneInfoManagementEditComponent} from "./fix-phone-info-management/edit/edit.component";
import {EmergencyDispatchLocationConfigComponent} from "./location-config/location-config.component";
import {EmergencyDispatchLocationConfigViewComponent} from "./location-config/view/view.component";
import {EmergencyDispatchLocationConfigEditComponent} from "./location-config/edit/edit.component";
import {EmergencyDispatchEmergencyExercise} from "./emergency-exercise/emergency-exercise.component";
import {EmergencyDispatchEmergencyExerciseEditComponent} from "./emergency-exercise/edit/edit.component";
import {EmergencyDispatchEmergencyHistoryReport} from "./emergency-history-report/emergency-history-report.component";
import {EmergencyDispatchEmergencyOngoingEvent} from "./emergency-ongoing-event/emergency-ongoing-event.component";
import {EmergencyDispatchChooseRoleComponent} from "./emergency-ongoing-event/chooseRole/choose-role.component";
import {EmergencyDispatchEmergencyHome} from "./emergency-home/emergency-home.component";
import {SelectPersonModule} from "../../hz/select-person/select-person.module";


const COMPONENTS = [
  EmergencyDispatchEmergencyCategoryComponent,
  EmergencyDispatchEmergencyBigCategoryComponent,
  EmergencyDispatchEmergencyAreaComponent,
  EmergencyDispatchEmergencyGoodsManage,
  EmergencyDispatchEmergencyGoodsStore,
  EmergencyDispatchEmergencyLevelComponent,
  EmergencyDispatchEmergencyPlanManage,
  EmergencyDispatchEmergencyPointSet,
  EmergencyDispatchEmergencyInformTagComponent,
  EmergencyDispatchMapComponent,
  EmergencyDispatchEmergencyPlanFileComponent,
  emergencyDispatchEmergencyRegulatoryFramework,
  EmergencyDispatchEmergencyRoleScopeComponent,
  EmergencyDispatchEmergencyScopeComponent,
  EmergencyDispatchEmergencyTagComponent,
  EmergencyDispatchEmergencyWatchOverManagement,
  FixPhoneInfoManagementComponent,
  EmergencyDispatchLocationConfigComponent,
  EmergencyDispatchEmergencyExercise,
  EmergencyDispatchEmergencyHistoryReport,
  EmergencyDispatchEmergencyOngoingEvent,
  EmergencyDispatchEmergencyHome,
];
const COMPONENTS_NOROUNT: any = [
  EmergencyDispatchEmergencyCategoryEditComponent,
  EmergencyDispatchEmergencyCategoryViewComponent,
  EmergencyDispatchEmergencyBigCategoryEditComponent,
  EmergencyDispatchEmergencyBigCategoryViewComponent,
  EmergencyDispatchEmergencyAreaEditComponent,
  EmergencyDispatchEmergencyAreaViewComponent,
  EmergencyDispatchSceneTagEditComponent,
  EmergencyDispatchGoodsTagEditComponent,
  EmergencyDispatchEmergencyGoodsEditComponent,
  EmergencyDispatchGoodsListComponent,
  EmergencyDispatchEmergencyLevelEditComponent,
  EmergencyDispatchEmergencyLevelViewComponent,
  EmergencyDispatchEmergencyTagInformViewComponent,
  EmergencyDispatchEmergencyTagInformRelatedPersonComponent,
  EmergencyDispatchEmergencyTagInformEditComponent,
  EmergencyDispatchEmergencyMapEditComponent,
  UploadEmergencyPlanFilesComponent,
  EmergencyDispatchEmergencyRoleScopeEditComponent,
  EmergencyDispatchEmergencyScopeEditComponent,
  EmergencyDispatchEmergencyTagViewComponent,
  EmergencyDispatchEmergencyTagRelatedPersonComponent,
  EmergencyDispatchEmergencyTagEditComponent,
  EmergencyDispatchEmergencyWatchOverManagementEditComponent,
  FixPhoneInfoManagementEditComponent,
  EmergencyDispatchLocationConfigViewComponent,
  EmergencyDispatchLocationConfigEditComponent,
  EmergencyDispatchEmergencyExerciseEditComponent,
  EmergencyDispatchChooseRoleComponent,
];
@NgModule({
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
  imports: [
    NzTreeModule,
    NzDropDownModule,
    CommonModule,
    // G2SingleBarModule,
    PageHeaderModule,
    SVModule,
    STModule,
    NzFormModule,
    NzPopconfirmModule,
    NzTableModule,
    SharedModule,
    EmergencyDispatchRoutingModule,
    LayoutModule,
    NzTimePickerModule,
    NzDividerModule,
    NzSwitchModule,
    NzTreeSelectModule,
    NzTagModule,
    NzCollapseModule,
    G2PieModule,
    NzDescriptionsModule,
    NzIconModule,
    G2BarModule,
    G2SingleBarModule,
    NzEmptyModule,
    NzListModule,
    NzImageModule,
    DownFileModule,
    NzPaginationModule,
    NzSelectModule,
    SelectPersonModule,
  ]
})
export class EmergencyDispatchModule { }
