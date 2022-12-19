import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ViewExpensesComponent } from './view-expenses/view-expenses.component';
import { SharedModule } from 'src/app/shared.module';
import { PayrollComponent } from './payroll/payroll.component';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { AddPayrollComponent } from './add-payroll/add-payroll.component';


@NgModule({
  declarations: [ViewExpensesComponent, PayrollComponent, AddExpensesComponent, AddPayrollComponent],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    SharedModule
  ]
})
export class ExpensesModule { }
