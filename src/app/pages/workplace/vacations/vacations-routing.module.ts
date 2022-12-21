import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewVacationsComponent } from './view-vacations/view-vacations.component';

const routes: Routes = [
  {
    path: '',
    component: ViewVacationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationsRoutingModule { }
