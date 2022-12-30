import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementRoutingModule } from './announcement-routing.module';
import { ViewAnnouncementsComponent } from './view-announcements/view-announcements.component';
import { AddAnnouncementComponent } from './add-announcement/add-announcement.component';
import { SharedModule } from 'src/app/shared.module';
import { WidgetsComponentsModule } from 'src/app/components/kit/widgets/widgets-components.module';


@NgModule({
  declarations: [ViewAnnouncementsComponent, AddAnnouncementComponent],
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    SharedModule,
  ],
 
})
export class AnnouncementModule { }
