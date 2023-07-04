import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ThreeRoutingModule } from './three-routing.module';
import { BasicMoveComponent } from './animation/basic-move/basic-move.component';
import { PersonViewComponent } from './animation/person-view/person-view.component';



@NgModule({
  declarations: [
    HomeComponent,
    BasicMoveComponent,
    PersonViewComponent
  ],
  imports: [
    CommonModule, ThreeRoutingModule
  ]
})
export class ThreeModule { }
