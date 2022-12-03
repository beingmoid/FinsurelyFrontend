import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAttendenceComponent } from './view-attendence/view-attendence.component';

const routes: Routes = [
  {
    path:'',
    component:ViewAttendenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendenceRoutingModule { }
