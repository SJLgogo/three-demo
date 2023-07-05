import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ThreeRoutingModule } from './three-routing.module';
import { BasicMoveComponent } from './animation/basic-move/basic-move.component';
import { PersonViewComponent } from './animation/person-view/person-view.component';
import { FirstPersonComponent } from './animation/first-person/first-person.component';



@NgModule({
  declarations: [
    HomeComponent,
    BasicMoveComponent,
    PersonViewComponent,
    FirstPersonComponent
  ],
  imports: [
    CommonModule, ThreeRoutingModule
  ]
})
export class ThreeModule { }
