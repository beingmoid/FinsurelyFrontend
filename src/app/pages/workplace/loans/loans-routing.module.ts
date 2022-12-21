import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewLoansComponent } from './view-loans/view-loans.component';

const routes: Routes = [
  {
    path: '',
    component: ViewLoansComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
