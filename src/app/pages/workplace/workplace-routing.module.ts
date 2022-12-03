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
  path:'announcements',
  loadChildren: () =>
  import('src/app/pages/workplace/announcement/announcement.module').then(m=>m.AnnouncementModule)
}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkplaceRoutingModule { }
