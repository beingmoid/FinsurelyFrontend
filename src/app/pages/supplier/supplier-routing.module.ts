import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewDetailSupplierComponent } from './view-detail-supplier/view-detail-supplier.component';
import { ViewSupplierComponent } from './view-supplier/view-supplier.component';

const routes: Routes = [
  {
    path:'',
    component:ViewSupplierComponent
  },
  {
    path:'view',
    component:ViewDetailSupplierComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
