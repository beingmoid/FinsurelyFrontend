import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailReportComponent } from './detail-report/detail-report.component';
import { JournalComponent } from './journal/journal.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [{
  path:'',
  component:ViewComponent
},
{
  path:'journal',
  component:JournalComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
