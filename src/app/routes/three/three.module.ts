import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ThreeRoutingModule } from './three-routing.module';
import { BasicMoveComponent } from './animation/basic-move/basic-move.component';



@NgModule({
  declarations: [
    HomeComponent,
    BasicMoveComponent
  ],
  imports: [
    CommonModule, ThreeRoutingModule
  ]
})
export class ThreeModule { }
