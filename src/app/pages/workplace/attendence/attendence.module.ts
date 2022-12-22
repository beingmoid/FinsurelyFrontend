import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendenceRoutingModule } from './attendence-routing.module';
import { ViewAttendenceComponent } from './view-attendence/view-attendence.component';
import { AddAttendenceComponent } from './add-attendence/add-attendence.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [ViewAttendenceComponent, AddAttendenceComponent],
  imports: [
    CommonModule,
    AttendenceRoutingModule,
    SharedModule
  ]
})
export class AttendenceModule { }
