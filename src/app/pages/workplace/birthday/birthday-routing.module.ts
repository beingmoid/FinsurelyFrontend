import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBirthdayComponent } from './view-birthday/view-birthday.component';

const routes: Routes = [
  {
    path: '',
    component: ViewBirthdayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BirthdayRoutingModule { }
