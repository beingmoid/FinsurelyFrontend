import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { ViewSalesComponent } from './view-sales/view-sales.component';
import { AddSalesComponent } from './add-sales/add-sales.component';
import { SharedModule } from 'src/app/shared.module';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AddInsuranceCompanyComponent } from '../insurance-company/add-insurance-company/add-insurance-company.component';
import { InsuranceCompanyModule } from '../insurance-company/insurance-company.module';
import { CustomerModule } from '../customer/customer.module';
import { AddBodyTypeComponent } from './add-body-type/add-body-type.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { SalesDirectoryComponent } from './sales-directory/sales-directory.component';



@NgModule({
  declarations: [ViewSalesComponent, AddSalesComponent, AddVehicleComponent, AddBodyTypeComponent, AddServiceComponent, SalesDirectoryComponent],
  imports: [
    
 
    SalesRoutingModule,
    InsuranceCompanyModule,
    CustomerModule,
    CommonModule,
    SharedModule,
  ],
  exports:[AddVehicleComponent]
})
export class SalesModule { }
