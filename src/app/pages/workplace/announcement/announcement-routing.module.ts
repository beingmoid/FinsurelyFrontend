import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAnnouncementsComponent } from './view-announcements/view-announcements.component';

const routes: Routes = [
  {
    path:'',
    component:ViewAnnouncementsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
