import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { StatementComponent } from './statement/statement.component';

const routes: Routes = [
  { path: '', component: AccountsComponent },
  {path:'report',component:StatementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
