import { NgModule, Type } from '@angular/core';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { SharedModule } from '@shared';

import { DictRoutingModule } from './dict-routing.module';
import { DictSwaggerEditComponent } from './swagger-edit/swagger-edit.component';
import { DictSwaggerListComponent } from './swagger-list/swagger-list.component';
import {OrganizationManagementComponent} from "./organization-management/organization-management.component";
import {AppAddComponent} from "./organization-management/app-add/app-add.component";

const COMPONENTS: Array<Type<void>> = [
  DictSwaggerListComponent,
  DictSwaggerEditComponent,
  OrganizationManagementComponent,
  AppAddComponent
];

@NgModule({
  imports: [SharedModule, DictRoutingModule, FooterToolbarModule],
  declarations: COMPONENTS
})
export class DictModule {}
