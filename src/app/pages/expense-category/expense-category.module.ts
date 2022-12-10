import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseCategoryRoutingModule } from './expense-category-routing.module';
import { ViewExpenseCategoryComponent } from './view-expense-category/view-expense-category.component';
import { SharedModule } from 'src/app/shared.module';
import { AddExpenseCategoryComponent } from './add-expense-category/add-expense-category.component';


@NgModule({
  declarations: [ViewExpenseCategoryComponent, AddExpenseCategoryComponent],
  imports: [
    CommonModule,
    ExpenseCategoryRoutingModule,
    SharedModule
  ]
})
export class ExpenseCategoryModule { }
