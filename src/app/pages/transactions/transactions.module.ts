import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { AddRefundComponent } from './add-refund/add-refund.component';
import { SharedModule } from 'src/app/shared.module';
import { AddCreditPaymentComponent } from './add-credit-payment/add-credit-payment.component';
import { TabsComponent } from './tabs/tabs.component';
import { PaymentComponent } from './payment/payment.component';
import { CreditPaymentComponent } from './credit-payment/credit-payment.component';
import { RefundComponent } from './refund/refund.component';
import { TransferComponent } from './transfer/transfer.component';


@NgModule({
  declarations: [ViewTransactionComponent, AddTransactionComponent, AddPaymentComponent, AddRefundComponent, AddCreditPaymentComponent, TabsComponent, PaymentComponent, CreditPaymentComponent, RefundComponent, TransferComponent],
  imports: [
    TransactionsRoutingModule,
    CommonModule,
    SharedModule


  ],
  exports:[ AddPaymentComponent, AddCreditPaymentComponent]
})
export class TransactionsModule { }
