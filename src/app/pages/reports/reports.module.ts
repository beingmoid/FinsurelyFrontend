import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ViewComponent } from './view/view.component';
import { DetailReportComponent } from './detail-report/detail-report.component';
import { SharedModule } from 'src/app/shared.module';
import { JournalComponent } from './journal/journal.component';


@NgModule({
  declarations: [ViewComponent, DetailReportComponent, JournalComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule { }
