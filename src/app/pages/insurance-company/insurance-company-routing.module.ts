import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewDetailInsuranceCompanyComponent } from './view-detail-insurance-company/view-detail-insurance-company.component';
import { ViewInsuranceCompanyComponent } from './view-insurance-company/view-insurance-company.component';

const routes: Routes = [
  {
    path:'',
    component:ViewInsuranceCompanyComponent,

  }
,{
  path:'view',
  component:ViewDetailInsuranceCompanyComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceCompanyRoutingModule { }
