import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelectProjectPersonComponent} from "./select-project-person/select-project-person.component";
import {SharedModule} from "@shared";
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DepartmentComponent } from './select-project-person/department/department.component';
import {NzTreeViewModule} from "ng-zorro-antd/tree-view";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzCollapseModule} from "ng-zorro-antd/collapse";


@NgModule({
  declarations: [
    SelectProjectPersonComponent,
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NzTabsModule,
    NzTreeViewModule,
    NzTreeModule,
    NzIconModule,
    NzCollapseModule
  ]
})
export class SelectPersonModule { }
