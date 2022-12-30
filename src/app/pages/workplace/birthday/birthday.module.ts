import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BirthdayRoutingModule } from './birthday-routing.module';
import { ViewBirthdayComponent } from './view-birthday/view-birthday.component';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [ViewBirthdayComponent],
  imports: [
    CommonModule,
    BirthdayRoutingModule,
    SharedModule
  ]
})
export class BirthdayModule { }
