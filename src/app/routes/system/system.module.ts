import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { NgJsonEditorModule } from 'ang-jsoneditor';

import { SystemJdlEditComponent } from './jdl/edit/edit.component';
import { SystemJdlComponent } from './jdl/jdl.component';
import { SystemRoutesEditComponent } from './routes/edit/edit.component';
import { SystemRoutesComponent } from './routes/routes.component';
import { SystemRoutingModule } from './system-routing.module';
import { SystemDictTypeComponent } from './dict-type/type.component';
import { SystemTypeEditComponent } from './dict-type/edit/edit.component';
import { SystemDictDataComponent } from './dict-data/dict-data.component';
import { SystemDictDataEditComponent } from './dict-data/edit/edit.component';
import { SystemOperationLogComponent } from './operation-log/operation-log.component';
import { SystemOnlineUserComponent } from './online-user/online-user.component';
import { SystemLoginLogComponent } from './login-log/login-log.component';
import { SystemConfigComponent } from './config/config.component';
import { SystemConfigEditComponent } from './config/edit/edit.component';

const COMPONENTS: Array<Type<void>> = [
  SystemRoutesComponent,
  SystemRoutesEditComponent,
  SystemJdlComponent,
  SystemJdlEditComponent,
  SystemDictTypeComponent,
  SystemTypeEditComponent,
  SystemDictDataComponent,
  SystemDictDataEditComponent,
  SystemOperationLogComponent,
  SystemOnlineUserComponent,
  SystemLoginLogComponent,
  SystemConfigComponent,
  SystemConfigEditComponent
];

@NgModule({
  imports: [SharedModule, SystemRoutingModule, NgJsonEditorModule],
  declarations: COMPONENTS,
  providers: []
})
export class SystemModule {}
