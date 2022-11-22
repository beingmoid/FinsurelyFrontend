import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesDirectoryComponent } from './sales-directory/sales-directory.component';
import { ViewSalesComponent } from './view-sales/view-sales.component';

const routes: Routes = [{
  path:'',
  component:ViewSalesComponent
},
{
  path:'directory',
  component:SalesDirectoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
