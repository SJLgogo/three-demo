import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictSwaggerEditComponent } from './swagger-edit/swagger-edit.component';
import { DictSwaggerListComponent } from './swagger-list/swagger-list.component';
import {OrganizationManagementComponent} from "./organization-management/organization-management.component";
import {SelectPersonModule} from "../../hz/select-person/select-person.module";

const routes: Routes = [
  { path: 'data', component: DictSwaggerListComponent },
  { path: 'swagger-edit', component: DictSwaggerEditComponent },
  { path: 'organization-management', component: OrganizationManagementComponent },
  { path: 'swagger-edit', component: DictSwaggerEditComponent },
  { path: 'swagger-edit', component: DictSwaggerEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes),SelectPersonModule],
  exports: [RouterModule]
})
export class DictRoutingModule {}
