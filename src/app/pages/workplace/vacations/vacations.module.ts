import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationsRoutingModule } from './vacations-routing.module';
import { ViewVacationsComponent } from './view-vacations/view-vacations.component';


@NgModule({
  declarations: [ViewVacationsComponent],
  imports: [
    CommonModule,
    VacationsRoutingModule
  ]
})
export class VacationsModule { }
