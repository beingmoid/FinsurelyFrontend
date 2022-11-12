import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { ViewSupplierComponent } from './view-supplier/view-supplier.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { ViewDetailSupplierComponent } from './view-detail-supplier/view-detail-supplier.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [ViewSupplierComponent, AddSupplierComponent, ViewDetailSupplierComponent],
  imports: [
    CommonModule,
    SharedModule,
    SupplierRoutingModule
  ]
})
export class SupplierModule { }
