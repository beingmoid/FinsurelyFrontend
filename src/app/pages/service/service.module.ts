import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ViewServiceComponent } from './view-service/view-service.component';
import { SharedModule } from 'src/app/shared.module';
import { AddServiceComponent } from './add-service/add-service.component';


@NgModule({
  declarations: [ViewServiceComponent, AddServiceComponent],
  imports: [
    CommonModule,
    ServiceRoutingModule,
    SharedModule
  ]
})
export class ServiceModule { }
