import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewExpenseCategoryComponent } from './view-expense-category/view-expense-category.component';

const routes: Routes = [
  {
    path:'',
    component: ViewExpenseCategoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseCategoryRoutingModule { }
