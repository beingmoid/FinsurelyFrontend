import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BirthdayRoutingModule } from './birthday-routing.module';
import { ViewBirthdayComponent } from './view-birthday/view-birthday.component';


@NgModule({
  declarations: [ViewBirthdayComponent],
  imports: [
    CommonModule,
    BirthdayRoutingModule
  ]
})
export class BirthdayModule { }
