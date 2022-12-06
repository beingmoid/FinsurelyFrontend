import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementRoutingModule } from './announcement-routing.module';
import { ViewAnnouncementsComponent } from './view-announcements/view-announcements.component';


@NgModule({
  declarations: [ViewAnnouncementsComponent],
  imports: [
    CommonModule,
    AnnouncementRoutingModule
  ]
})
export class AnnouncementModule { }
