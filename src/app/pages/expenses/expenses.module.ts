import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ViewExpensesComponent } from './view-expenses/view-expenses.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [ViewExpensesComponent],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    SharedModule
  ]
})
export class ExpensesModule { }
