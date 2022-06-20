import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { SystemJdlEditComponent } from './jdl/edit/edit.component';
import { SystemJdlComponent } from './jdl/jdl.component';
import { SystemRoutesEditComponent } from './routes/edit/edit.component';
import { SystemRoutesComponent } from './routes/routes.component';
import { SystemRoutingModule } from './system-routing.module';

const COMPONENTS: Array<Type<void>> = [SystemRoutesComponent, SystemRoutesEditComponent, SystemJdlComponent, SystemJdlEditComponent];

@NgModule({
  imports: [SharedModule, SystemRoutingModule, NgJsonEditorModule],
  declarations: COMPONENTS,
  providers: []
})
export class SystemModule {}
