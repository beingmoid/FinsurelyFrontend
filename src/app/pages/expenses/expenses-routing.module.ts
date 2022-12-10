import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpensesModule } from './expenses.module';
import { ViewExpensesComponent } from './view-expenses/view-expenses.component';

const routes: Routes = [{
  path: '',
  component:ViewExpensesComponent ,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
