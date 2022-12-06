import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesAgentRoutingModule } from './sales-agent-routing.module';
import { ViewSalesAgentComponent } from './view-sales-agent/view-sales-agent.component';
import { SharedModule } from 'src/app/shared.module';
import { AddSalesAgentComponent } from './add-sales-agent/add-sales-agent.component';
import { SalesAgentDetailComponent } from './sales-agent-detail/sales-agent-detail.component';
import { TransactionsModule } from '../transactions/transactions.module';
import { ReconcileComponent } from './reconcile/reconcile.component';
import { ThousandSuffixesPipe } from 'src/app/pipes/thousand.suffix.pipe';
import { StatementViewComponent } from './statement-view/statement-view.component';
import { MomentModule } from 'ngx-moment';
import { AccountingModule } from '../accounting/accounting.module';
import {MatChipsModule} from '@angular/material/chips';



@NgModule({
  declarations: [ViewSalesAgentComponent, AddSalesAgentComponent, SalesAgentDetailComponent, ReconcileComponent, StatementViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    SalesAgentRoutingModule,
    TransactionsModule,
    MomentModule,
    AccountingModule,
    MatChipsModule
  ],
  exports:[AddSalesAgentComponent],
  
})
export class SalesAgentModule { }
