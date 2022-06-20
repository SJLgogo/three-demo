import { NgModule, Type } from '@angular/core';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { SharedModule } from '@shared';

import { DictRoutingModule } from './dict-routing.module';
import { DictSwaggerEditComponent } from './swagger-edit/swagger-edit.component';
import { DictSwaggerListComponent } from './swagger-list/swagger-list.component';

const COMPONENTS: Array<Type<void>> = [
  DictSwaggerListComponent,
  DictSwaggerEditComponent,
  DictSwaggerEditComponent,
  DictSwaggerEditComponent,
  DictSwaggerEditComponent
];

@NgModule({
  imports: [SharedModule, DictRoutingModule, FooterToolbarModule],
  declarations: COMPONENTS
})
export class DictModule {}
