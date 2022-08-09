import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemJdlComponent } from './jdl/jdl.component';
import { SystemRoutesComponent } from './routes/routes.component';
import { SystemDictTypeComponent } from './dict-type/type.component';
import { SystemDictDataComponent } from './dict-data/dict-data.component';
import { SystemOperationLogComponent } from './operation-log/operation-log.component';

const routes: Routes = [
  { path: 'routes', component: SystemRoutesComponent },
  { path: 'jdl', component: SystemJdlComponent },
  { path: 'dict-type', component: SystemDictTypeComponent },
  { path: 'dict-data/:id', component: SystemDictDataComponent },
  { path: 'operation-log', component: SystemOperationLogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
