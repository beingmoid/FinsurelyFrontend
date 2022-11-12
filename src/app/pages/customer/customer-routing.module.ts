import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';

const routes: Routes = [
  {path:'',component:ViewCustomerComponent},
  {path:'view',component:CustomerDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
