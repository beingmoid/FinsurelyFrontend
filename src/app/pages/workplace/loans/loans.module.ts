import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoansRoutingModule } from './loans-routing.module';
import { ViewLoansComponent } from './view-loans/view-loans.component';


@NgModule({
  declarations: [ViewLoansComponent],
  imports: [
    CommonModule,
    LoansRoutingModule
  ]
})
export class LoansModule { }
