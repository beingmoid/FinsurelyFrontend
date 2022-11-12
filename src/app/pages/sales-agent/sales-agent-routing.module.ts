import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesAgentDetailComponent } from './sales-agent-detail/sales-agent-detail.component';
import { StatementViewComponent } from './statement-view/statement-view.component';
import { ViewSalesAgentComponent } from './view-sales-agent/view-sales-agent.component';

const routes: Routes = [{
  path:'',component:ViewSalesAgentComponent,
},{
  path:'view',
  component:SalesAgentDetailComponent
},{
  path:'statement',
  component:StatementViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesAgentRoutingModule { }
