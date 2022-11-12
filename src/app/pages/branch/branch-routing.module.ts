import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBranchComponent } from './view-branch/view-branch.component';

const routes: Routes = [
  { path:'',
component:ViewBranchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
