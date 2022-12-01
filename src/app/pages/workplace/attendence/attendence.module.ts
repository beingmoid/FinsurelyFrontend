import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendenceRoutingModule } from './attendence-routing.module';
import { ViewAttendenceComponent } from './view-attendence/view-attendence.component';


@NgModule({
  declarations: [ViewAttendenceComponent],
  imports: [
    CommonModule,
    AttendenceRoutingModule
  ]
})
export class AttendenceModule { }
