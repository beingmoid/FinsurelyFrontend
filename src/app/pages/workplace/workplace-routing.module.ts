import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { TabsComponent } from './tabs/tabs.component';
import { WorkplaceComponent } from './workplace/workplace.component';

const routes: Routes = [{
  path:'employee',
  component:EmployeeDetailsComponent
}
,
{
  path:'',
  component:TabsComponent
},
{
  path: 'attendence',
  loadChildren: ()=>
  import('src/app/pages/workplace/attendence/attendence.module').then(m=>m.AttendenceModule)
},
{
  path: 'announcement',
  loadChildren: ()=>
  import('src/app/pages/workplace/announcement/announcement.module').then(m=>m.AnnouncementModule)
},
{
  path: 'vacations',
  loadChildren: ()=>
  import('src/app/pages/workplace/vacations/vacations.module').then(m=>m.VacationsModule)
},
{
  path: 'loans',
  loadChildren: ()=>
  import('src/app/pages/workplace/loans/loans.module').then(m=>m.LoansModule)
},
{
  path: 'birthday',
  loadChildren: ()=>
  import('src/app/pages/workplace/birthday/birthday.module').then(m=>m.BirthdayModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkplaceRoutingModule { }

