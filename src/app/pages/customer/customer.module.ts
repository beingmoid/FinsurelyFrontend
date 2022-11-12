import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { SharedModule } from 'src/app/shared.module';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';


@NgModule({
  declarations: [ViewCustomerComponent, AddCustomerComponent, CustomerDetailsComponent],
  imports: [
    CustomerRoutingModule,
    CommonModule,   SharedModule,
   
  ],
  exports:[AddCustomerComponent,CustomerDetailsComponent]
})
export class CustomerModule { }
