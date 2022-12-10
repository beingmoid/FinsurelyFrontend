import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewServiceComponent } from './view-service/view-service.component';

const routes: Routes = [
  {
    path: '',
    component: ViewServiceComponent,
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
