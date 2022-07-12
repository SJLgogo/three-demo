import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelectProjectPersonComponent} from "./select-project-person/select-project-person.component";
import {SharedModule} from "@shared";
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DepartmentComponent } from './select-project-person/department/department.component';
import {NzTreeViewModule} from "ng-zorro-antd/tree-view";
import {NzTreeModule} from "ng-zorro-antd/tree";


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
    NzTreeModule
  ]
})
export class SelectPersonModule { }
