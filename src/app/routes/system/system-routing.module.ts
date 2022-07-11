import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemJdlComponent } from './jdl/jdl.component';
import { SystemRoutesComponent } from './routes/routes.component';

const routes: Routes = [
  { path: 'routes', component: SystemRoutesComponent },
  { path: 'jdl', component: SystemJdlComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
