import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ViewExpensesComponent } from './view-expenses/view-expenses.component';


@NgModule({
  declarations: [ViewExpensesComponent],
  imports: [
    CommonModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }
