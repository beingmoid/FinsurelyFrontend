import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsuranceCompanyRoutingModule } from './insurance-company-routing.module';
import { AddInsuranceCompanyComponent } from './add-insurance-company/add-insurance-company.component';
import { ViewInsuranceCompanyComponent } from './view-insurance-company/view-insurance-company.component';
import { ViewDetailInsuranceCompanyComponent } from './view-detail-insurance-company/view-detail-insurance-company.component';
import { SharedModule } from 'src/app/shared.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { ThousandSuffixesPipe } from 'src/app/pipes/thousand.suffix.pipe';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AccountingModule } from '../accounting/accounting.module';
import {MatChipsModule} from '@angular/material/chips';




@NgModule({
  declarations: [AddInsuranceCompanyComponent, ViewInsuranceCompanyComponent, ViewDetailInsuranceCompanyComponent],
  imports: [
    SharedModule,
    CommonModule,
    InsuranceCompanyRoutingModule,
    TransactionsModule,
    AccountingModule,
    MatChipsModule

    
  
  ],
  exports:[AddInsuranceCompanyComponent],
  providers:[NgxImageCompressService]
})
export class InsuranceCompanyModule { }
