import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountsComponent } from './accounts/accounts.component';
import { SharedModule } from 'src/app/shared.module';

import { AccountingRulesComponent } from './accounting-rules/accounting-rules.component';
import { AddAccountsComponent } from './add-accounts/add-accounts.component';
import { StatementComponent } from './statement/statement.component';
import {MatChipsModule} from '@angular/material/chips';



@NgModule({
  declarations: [ AccountsComponent,  AccountingRulesComponent, AddAccountsComponent, StatementComponent],
  imports: [
    CommonModule,
    SharedModule,
    AccountingRoutingModule,
    MatChipsModule

  ],
  exports:[AddAccountsComponent]
})
export class AccountingModule { }
