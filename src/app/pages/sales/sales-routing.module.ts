import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewSalesComponent } from './view-sales/view-sales.component';

const routes: Routes = [{
  path:'',
  component:ViewSalesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
