import {NgModule} from '@angular/core';
import {SharedModule} from '@shared';
import {EmergencyDispatchRoutingModule} from './emergency-dispatch-routing.module';
import {EmergencyDispatchIndexComponent} from './index/index.component';
import {LayoutModule} from '../../layout/layout.module';
import {EmergencyDispatchEmergencyCategoryComponent} from './emergency-category/emergency-category.component';
import {EmergencyDispatchEmergencyCategoryEditComponent} from './emergency-category/edit/edit.component';
import {EmergencyDispatchEmergencyCategoryViewComponent} from './emergency-category/view/view.component';
import {EmergencyDispatchEmergencyLevelComponent} from './emergency-level/emergency-level.component';
import {EmergencyDispatchEmergencyLevelEditComponent} from './emergency-level/edit/edit.component';
import {EmergencyDispatchEmergencyLevelViewComponent} from './emergency-level/view/view.component';
import {EmergencyDispatchEmergencyBigCategoryComponent} from './emergency-big-category/emergency-big-category.component';
import {EmergencyDispatchEmergencyBigCategoryEditComponent} from './emergency-big-category/edit/edit.component';
import {EmergencyDispatchEmergencyBigCategoryViewComponent} from './emergency-big-category/view/view.component';
import {EmergencyDispatchEmergencyAreaComponent} from './emergency-area/emergency-area.component';
import {EmergencyDispatchEmergencyAreaEditComponent} from './emergency-area/edit/edit.component';
import {EmergencyDispatchEmergencyAreaViewComponent} from './emergency-area/view/view.component';
import {EmergencyDispatchLocationConfigComponent} from './location-config/location-config.component';
import {EmergencyDispatchLocationConfigEditComponent} from './location-config/edit/edit.component';
import {EmergencyDispatchLocationConfigViewComponent} from './location-config/view/view.component';
import {EmergencyDispatchEmergencyTagComponent} from './emergency-tag/emergency-tag.component';
import {EmergencyDispatchEmergencyTagEditComponent} from './emergency-tag/edit/edit.component';
import {EmergencyDispatchEmergencyTagViewComponent} from './emergency-tag/view/view.component';
import {EmergencyDispatchEmergencyScopeComponent} from './emergency-scope/emergency-scope.component';
import {EmergencyDispatchEmergencyScopeEditComponent} from './emergency-scope/edit/edit.component';
import {EmergencyDispatchEmergencyPlanFileComponent} from './emergency-plan-file/emergency-plan-file.component';
import {UploadEmergencyPlanFilesComponent} from './emergency-plan-file/upload-files/upload-file.component';
import {EmergencyDispatchEmergencyExercise} from './emergency-exercise/emergency-exercise.component';
import {EmergencyDispatchEmergencyExerciseEditComponent} from './emergency-exercise/edit/edit.component';
import {clickButtonComponent} from './components/click-button/click-button.component';
import {EmergencyDispatchEmployeeShiftComponent} from './employee-shift/employee-shift.component';
import {EmergencyDispatchEmployeeShiftCategoryComponent} from './employee-shift-category/employee-shift-category.component';
import {EmergencyDispatchEmployeeShiftEditComponent} from './employee-shift/edit/edit.component';
import {EmergencyDispatchEmployeeShiftCategoryEditComponent} from './employee-shift-category/edit/edit.component';
import {EmergencyDispatchEmployeeShiftViewComponent} from './employee-shift/view/view.component';
import {EmergencyDispatchEmployeeShiftCategoryViewComponent} from './employee-shift-category/view/view.component';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzTreeSelectModule} from 'ng-zorro-antd/tree-select';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzDescriptionsModule} from 'ng-zorro-antd/descriptions';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {G2BarModule} from '@delon/chart/bar';
import {NzImageModule} from 'ng-zorro-antd/image';
import {personnelInfoComponent} from './components/personnel-info/personnel-info.component';
import {categoryChooseComponent} from './components/category-choose/category-choose.component';
import {chartPieComponent} from './components/chart-pie/chart-pie.component';
import {emergencyItemComponent} from './components/emergency-item/emergency-item.component';
import {measureItemComponent} from './components/measure-item/measure-item.component';
import {G2PieModule} from '@delon/chart/pie';
import {EmergencyDispatchEmergencyHome} from './emergency-home/emergency-home.component';
import {EmergencyDispatchEmergencyOngoingEvent} from './emergency-ongoing-event/emergency-ongoing-event.component';
import {EmergencyDispatchEmergencyHistoryReport} from './emergency-history-report/emergency-history-report.component';
import {EmergencyDispatchEmergencyGoodsManage} from './emergency-goods-manage/emergency-goods-manage.component';
import {EmergencyDispatchEmergencyPlanManage} from './emergency-plan-manage/emergency-plan-managecomponent';
import {EmergencyDispatchEmergencyPointSet} from './emergency-point-set/emergency-point-set.conmponent';
import {EmergencyDispatchMapComponent} from './emergency-map/emergency-map.conmponent';
import {emergencyDispatchEmergencyRegulatoryFramework} from './emergency-regulatory-framework/emergency-regulatory-framework.component';
import {EmergencyDispatchEmergencyInformTagComponent} from './emergency-inform-tag/emergency-inform-tag.component';
import {EmergencyDispatchEmergencyTagInformEditComponent} from './emergency-inform-tag/edit/edit.component';
import {EmergencyDispatchEmergencyTagInformViewComponent} from './emergency-inform-tag/view/view.component';
import {EmergencyDispatchEmergencyTagInformRelatedPersonComponent} from './emergency-inform-tag/related-person/related-person.component';
import {EmergencyDispatchEmergencyWatchOverManagement} from './emergency-watch-over-management/emergency-watch-over-management';
import {EmergencyDispatchEmergencyWatchOverManagementEditComponent} from './emergency-watch-over-management/edit/edit.component';
import {EmergencyDispatchEmergencyMapEditComponent} from './emergency-map/edit/edit.component';
// import {G2SingleBarModule} from '@delon/chart';
import {ScheduleMachineScheduleViewComponent} from './machineSchedule/view/view.component';
import {ScheduleMachineScheduleEditComponent} from './machineSchedule/edit/edit.component';
import {ScheduleMachineScheduleUploadComponent} from './machineSchedule/upload/upload.component';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {EmergencyDispatchComponentsEditComponent} from './components/personnel-info/edit/edit.component';
import {NzListModule} from 'ng-zorro-antd/list';
import {DownFileModule} from '@delon/abc/down-file';
import {EmergencyDispatchEmergencyTagRelatedPersonComponent} from './emergency-tag/related-person/related-person.component';
import {EmergencyDispatchEmergencyRoleScopeComponent} from './emergency-role-scope/emergency-role-scope.component';
import {EmergencyDispatchEmergencyRoleScopeEditComponent} from './emergency-role-scope/edit/edit.component';
import {ModalTable} from './components/modal-table/modal-table.component';
import {EmergencyDispatchGoodsTagEditComponent} from './emergency-goods-manage/goods-tag/edit.component';
import {EmergencyDispatchSceneTagEditComponent} from './emergency-goods-manage/scene-tag/edit.component';
import {EmergencyDispatchEmergencyGoodsStore} from './emergency-goods-store/emergency-goods-store.component';
import {EmergencyDispatchGoodsListComponent} from './emergency-goods-store/goods-list/view.component';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {EmergencyDispatchEmergencyGoodsEditComponent} from './emergency-goods-manage/edit/edit.component';
import {EmergencyDispatchChooseRoleComponent} from './emergency-ongoing-event/chooseRole/choose-role.component';
import {FixPhoneInfoManagementComponent} from './fix-phone-info-management/fix-phone-info-management.component';
import {FixPhoneInfoManagementEditComponent} from './fix-phone-info-management/edit/edit.component';
import {EmergencyDispatchSystemLogComponent} from "./system-log/system-log.component";
import {PageHeaderModule} from '@delon/abc/page-header';
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";
import {STModule} from "@delon/abc/st";
import {SVModule} from "@delon/abc/sv";
import {NzTransferModule} from "ng-zorro-antd/transfer";
import {NzTreeViewModule} from "ng-zorro-antd/tree-view";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";


const COMPONENTS = [
  EmergencyDispatchIndexComponent,
  EmergencyDispatchEmergencyCategoryComponent,
  EmergencyDispatchEmergencyLevelComponent,
  EmergencyDispatchEmergencyBigCategoryComponent,
  EmergencyDispatchEmergencyAreaComponent,
  EmergencyDispatchLocationConfigComponent,
  EmergencyDispatchEmergencyTagComponent,
  EmergencyDispatchEmergencyScopeComponent,
  EmergencyDispatchEmergencyPlanFileComponent,
  EmergencyDispatchEmergencyExercise,
  EmergencyDispatchEmployeeShiftComponent,
  EmergencyDispatchEmployeeShiftCategoryComponent,
  clickButtonComponent,
  personnelInfoComponent,
  categoryChooseComponent,
  chartPieComponent,
  emergencyItemComponent,
  measureItemComponent,
  ModalTable,
  EmergencyDispatchEmergencyHome,
  EmergencyDispatchMapComponent,
  emergencyDispatchEmergencyRegulatoryFramework,
  EmergencyDispatchEmergencyInformTagComponent,
  EmergencyDispatchEmergencyWatchOverManagement,
  EmergencyDispatchEmergencyOngoingEvent,
  EmergencyDispatchEmergencyHistoryReport,
  EmergencyDispatchEmergencyGoodsManage,
  EmergencyDispatchEmergencyGoodsStore,
  EmergencyDispatchEmergencyPlanManage,
  EmergencyDispatchEmergencyPointSet,
  EmergencyDispatchEmergencyRoleScopeComponent,
  EmergencyDispatchSystemLogComponent,
];
const COMPONENTS_NOROUNT: any = [
  EmergencyDispatchEmergencyCategoryEditComponent,
  EmergencyDispatchEmergencyCategoryViewComponent,
  EmergencyDispatchEmergencyLevelEditComponent,
  EmergencyDispatchEmergencyLevelViewComponent,
  EmergencyDispatchEmergencyBigCategoryEditComponent,
  EmergencyDispatchEmergencyBigCategoryViewComponent,
  EmergencyDispatchEmergencyAreaEditComponent,
  EmergencyDispatchEmergencyAreaViewComponent,
  EmergencyDispatchEmergencyTagEditComponent,
  EmergencyDispatchEmergencyTagViewComponent,
  EmergencyDispatchLocationConfigEditComponent,
  EmergencyDispatchLocationConfigViewComponent,
  EmergencyDispatchEmergencyScopeEditComponent,
  UploadEmergencyPlanFilesComponent,
  ScheduleMachineScheduleViewComponent,
  ScheduleMachineScheduleUploadComponent,
  ScheduleMachineScheduleEditComponent,
  EmergencyDispatchEmergencyExerciseEditComponent,
  EmergencyDispatchEmployeeShiftEditComponent,
  EmergencyDispatchEmployeeShiftViewComponent,
  EmergencyDispatchEmployeeShiftCategoryEditComponent,
  EmergencyDispatchEmployeeShiftCategoryViewComponent,
  EmergencyDispatchEmergencyTagInformEditComponent,
  EmergencyDispatchEmergencyTagInformViewComponent,
  EmergencyDispatchEmergencyTagInformRelatedPersonComponent,
  EmergencyDispatchEmergencyWatchOverManagementEditComponent,
  EmergencyDispatchEmergencyMapEditComponent,
  EmergencyDispatchComponentsEditComponent,
  EmergencyDispatchEmergencyTagRelatedPersonComponent,
  EmergencyDispatchEmergencyRoleScopeEditComponent,
  EmergencyDispatchGoodsTagEditComponent,
  EmergencyDispatchSceneTagEditComponent,
  EmergencyDispatchGoodsListComponent,
  EmergencyDispatchEmergencyGoodsEditComponent,
  EmergencyDispatchChooseRoleComponent,
  FixPhoneInfoManagementComponent,
  FixPhoneInfoManagementEditComponent
];

@NgModule({
  imports: [
    SharedModule,
    EmergencyDispatchRoutingModule,
    G2PieModule,
    G2BarModule,
    // G2SingleBarModule,
    DownFileModule,
    PageHeaderModule,
    LayoutModule,
    SVModule,
    STModule,
    NzFormModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzTableModule
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class EmergencyDispatchModule {
}
