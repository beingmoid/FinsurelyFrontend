import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacationsRoutingModule } from './vacations-routing.module';
import { ViewVacationsComponent } from './view-vacations/view-vacations.component';
import { SharedModule } from 'src/app/shared.module';
import { AddVacationComponent } from './add-vacation/add-vacation.component';


@NgModule({
  declarations: [ViewVacationsComponent, AddVacationComponent],
  imports: [
    CommonModule,
    VacationsRoutingModule,
    SharedModule
  ]
})
export class VacationsModule { }
