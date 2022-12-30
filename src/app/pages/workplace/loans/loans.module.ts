import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoansRoutingModule } from './loans-routing.module';
import { ViewLoansComponent } from './view-loans/view-loans.component';
import { SharedModule } from 'src/app/shared.module';
import { AddLoansComponent } from './add-loans/add-loans.component';


@NgModule({
  declarations: [ViewLoansComponent, AddLoansComponent],
  imports: [
    CommonModule,
    LoansRoutingModule,
    SharedModule
  ]
})
export class LoansModule { }
