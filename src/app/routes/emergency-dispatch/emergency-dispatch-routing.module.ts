import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmergencyDispatchIndexComponent } from './index/index.component';
import { SimpleGuard } from '@delon/auth';
import { EmergencyDispatchEmergencyCategoryComponent } from './emergency-category/emergency-category.component';
import { EmergencyDispatchEmergencyLevelComponent } from './emergency-level/emergency-level.component';
import { EmergencyDispatchEmergencyBigCategoryComponent } from './emergency-big-category/emergency-big-category.component';
import { EmergencyDispatchEmergencyAreaComponent } from './emergency-area/emergency-area.component';
import { EmergencyDispatchLocationConfigComponent } from './location-config/location-config.component';
import { EmergencyDispatchEmergencyTagComponent } from './emergency-tag/emergency-tag.component';
import { EmergencyDispatchEmergencyScopeComponent } from './emergency-scope/emergency-scope.component';
import { EmergencyDispatchEmergencyPlanFileComponent } from './emergency-plan-file/emergency-plan-file.component';
import { EmergencyDispatchEmergencyExercise } from './emergency-exercise/emergency-exercise.component';
import { EmergencyDispatchEmployeeShiftComponent } from './employee-shift/employee-shift.component';
import { EmergencyDispatchEmployeeShiftCategoryComponent } from './employee-shift-category/employee-shift-category.component';

import { EmergencyDispatchEmergencyHome } from './emergency-home/emergency-home.component';
import { EmergencyDispatchEmergencyOngoingEvent } from './emergency-ongoing-event/emergency-ongoing-event.component';
import { EmergencyDispatchEmergencyHistoryReport } from './emergency-history-report/emergency-history-report.component';
import { EmergencyDispatchEmergencyGoodsManage } from './emergency-goods-manage/emergency-goods-manage.component';
import { EmergencyDispatchEmergencyPlanManage } from './emergency-plan-manage/emergency-plan-managecomponent';
import { EmergencyDispatchEmergencyPointSet } from './emergency-point-set/emergency-point-set.conmponent';

import { EmergencyDispatchMapComponent } from './emergency-map/emergency-map.conmponent';
import { emergencyDispatchEmergencyRegulatoryFramework } from './emergency-regulatory-framework/emergency-regulatory-framework.component';
import { EmergencyDispatchEmergencyInformTagComponent } from './emergency-inform-tag/emergency-inform-tag.component';
import { EmergencyDispatchEmergencyWatchOverManagement } from './emergency-watch-over-management/emergency-watch-over-management';
import { ScheduleMachineScheduleViewComponent } from './machineSchedule/view/view.component';
import { EmergencyDispatchEmergencyRoleScopeComponent } from './emergency-role-scope/emergency-role-scope.component';
import { EmergencyDispatchEmergencyGoodsStore } from './emergency-goods-store/emergency-goods-store.component';
import { FixPhoneInfoManagementComponent } from './fix-phone-info-management/fix-phone-info-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'emergency-home', pathMatch: 'full' },
      {
        path: 'emergency-category',
        component: EmergencyDispatchEmergencyCategoryComponent,
        data: { title: '事件类型', titleI18n: '事件类型' },
      },
      {
        path: 'emergency-level',
        component: EmergencyDispatchEmergencyLevelComponent,
        data: { title: '事件等级', titleI18n: '事件类型' },
      },
      {
        path: 'emergency-big-category',
        component: EmergencyDispatchEmergencyBigCategoryComponent,
        data: { title: '事件大类', titleI18n: '事件大类' },
      },
      {
        path: 'emergency-area',
        component: EmergencyDispatchEmergencyAreaComponent,
        data: { title: '事件区域', titleI18n: '事件区域' },
      },
      {
        path: 'emergency-tag',
        component: EmergencyDispatchEmergencyTagComponent,
        data: { title: '应急标签设置', titleI18n: '应急标签设置' },
      },
      {
        path: 'location-config',
        component: EmergencyDispatchLocationConfigComponent,
        data: { title: '定位识别范围设置', titleI18n: '定位识别范围设置' },
      },
      {
        path: 'employee-shift',
        component: EmergencyDispatchEmployeeShiftComponent,
        data: { title: '班表信息管理', titleI18n: '班表信息管理' },
      },
      {
        path: 'employee-shift-category',
        component: EmergencyDispatchEmployeeShiftCategoryComponent,
        data: { title: '班次管理', titleI18n: '班次管理' },
      },
      {
        path: 'emergency-scope',
        component: EmergencyDispatchEmergencyScopeComponent,
        data: { title: '虚拟组织架构', titleI18n: '虚拟组织架构' },
      },
      {
        path: 'emergency-plan-file',
        component: EmergencyDispatchEmergencyPlanFileComponent,
        data: { title: '应急预案文件', titleI18n: '应急预案文件' },
      },
      {
        path: 'emergency-exercise',
        component: EmergencyDispatchEmergencyExercise,
        data: { title: '演练计划申报', titleI18n: '演练计划申报' },
      },
      {
        path: 'emergency-home',
        component: EmergencyDispatchEmergencyHome,
        data: { title: '首页', titleI18n: '首页' },
      },
      {
        path: 'emergency-ongoing-event',
        component: EmergencyDispatchEmergencyOngoingEvent,
        data: { title: '正在进行的事件', titleI18n: '正在进行的事件' },
      },
      {
        path: 'emergency-history-report',
        component: EmergencyDispatchEmergencyHistoryReport,
        data: { title: '应急事件历史报表', titleI18n: '应急事件历史报表' },
      },
      {
        path: 'emergency-goods-manage',
        component: EmergencyDispatchEmergencyGoodsManage,
        data: { title: '应急物资管理', titleI18n: '应急物资管理' },
      },
      {
        path: 'emergency-goods-store',
        component: EmergencyDispatchEmergencyGoodsStore,
        data: { title: '应急物资仓库管理', titleI18n: '应急物资仓库管理' },
      },
      {
        path: 'emergency-plan-manage',
        component: EmergencyDispatchEmergencyPlanManage,
        data: { title: '应急规章制度管理', titleI18n: '应急规章制度管理' },
      },
      {
        path: 'emergency-point-set',
        component: EmergencyDispatchEmergencyPointSet,
        data: { title: '应急处置要点设置', titleI18n: '应急处置要点设置' },
      },
      {
        path: 'emergency-role-scope',
        component: EmergencyDispatchEmergencyRoleScopeComponent,
        data: { title: '应急要点反馈权限管理', titleI18n: '应急要点反馈权限管理' },
      },
      {
        path: 'emergency-map',
        component: EmergencyDispatchMapComponent,
        data: { title: '应急GIS地图', titleI18n: '应急GIS地图' },
      },
      {
        path: 'emergency-regulatory-framework',
        component: emergencyDispatchEmergencyRegulatoryFramework,
        data: { title: '应急规章制度类型设置', titleI18n: '应急规章制度类型设置' },
      },
      {
        path: 'emergency-inform-tag',
        component: EmergencyDispatchEmergencyInformTagComponent,
        data: { title: '应急通知标签组设置', titleI18n: '应急通知标签组设置' },
      },
      {
        path: 'emergency-watch-over-management',
        component: EmergencyDispatchEmergencyWatchOverManagement,
        data: { title: '应急值守管理', titleI18n: '应急值守管理' },
      },
      {
        path: 'fix-phone-info-management',
        component: FixPhoneInfoManagementComponent,
        data: { title: '固话信息管理', titleI18n: '固话信息管理' },
      },
      { path: 'viewSchedule', component: ScheduleMachineScheduleViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmergencyDispatchRoutingModule {}
