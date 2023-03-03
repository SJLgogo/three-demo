import { NgModule, Type } from '@angular/core';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { SharedModule } from '@shared';

import { DictRoutingModule } from './dict-routing.module';
import { DictSwaggerEditComponent } from './swagger-edit/swagger-edit.component';
import { DictSwaggerListComponent } from './swagger-list/swagger-list.component';
import {AppManagementComponent} from "./app-management/app-management.component";
import {AppAddComponent} from "./app-management/app-add/app-add.component";
import {ProAddComponent} from "./app-management/pro-add/pro-add.component";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {FormsModule} from "@angular/forms";

const COMPONENTS: Array<Type<void>> = [
  DictSwaggerListComponent,
  DictSwaggerEditComponent,
  AppManagementComponent,
  AppAddComponent,
  ProAddComponent
];

@NgModule({
  imports: [SharedModule, DictRoutingModule, FooterToolbarModule,NzToolTipModule,FormsModule],
  declarations: COMPONENTS
})
export class DictModule {}
