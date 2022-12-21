import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkplaceRoutingModule } from './workplace-routing.module';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';

import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { WorkplaceComponent } from './workplace/workplace.component';
import { SharedModule } from 'src/app/shared.module';
import { TabsComponent } from './tabs/tabs.component';
import { TeamsComponent } from './teams/teams.component';
import { EmpBasicDetailComponent } from './emp-basic-detail/emp-basic-detail.component';
import { CompensationComponent } from './compensation/compensation.component';
import { VacationPolicyComponent } from './vacation-policy/vacation-policy.component';
import { BenefitsAndDeductionsComponent } from './benefits-and-deductions/benefits-and-deductions.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { EmpFilesComponent } from './emp-files/emp-files.component';
import { EmpStatusComponent } from './emp-status/emp-status.component';
import { AnnouncementModule } from './announcement/announcement.module';
import { ViewAnnouncementsComponent } from './announcement/view-announcements/view-announcements.component';
//import { ViewAnnouncementsComponent } from './annoucement/view-announcements/view-announcements.component';


@NgModule({
  declarations: [EmployeeViewComponent, EmployeeAddComponent, EmployeeDetailsComponent, WorkplaceComponent, TabsComponent, TeamsComponent, EmpBasicDetailComponent, CompensationComponent, VacationPolicyComponent, BenefitsAndDeductionsComponent, BankDetailsComponent, EmpFilesComponent, EmpStatusComponent],
  imports: [
    CommonModule,
    
    WorkplaceRoutingModule,
    SharedModule,
    
  ]
})
export class WorkplaceModule { }
