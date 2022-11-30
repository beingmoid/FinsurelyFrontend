import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkSalesComponent } from './bulk-sales/bulk-sales.component';
import { SalesDirectoryComponent } from './sales-directory/sales-directory.component';
import { ViewSalesComponent } from './view-sales/view-sales.component';

const routes: Routes = [{
  path:'',
  component:ViewSalesComponent
},
{
  path:'directory',
  component:SalesDirectoryComponent
},{
  path:'bulk-sales',
  component:BulkSalesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
