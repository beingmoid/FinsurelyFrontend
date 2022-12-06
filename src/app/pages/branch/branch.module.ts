import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { ViewBranchComponent } from './view-branch/view-branch.component';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { SharedModule } from 'src/app/shared.module';
import { MaterialModule } from 'src/app/material.module';
import {MatChipsModule} from '@angular/material/chips';



@NgModule({
  declarations: [ViewBranchComponent, AddBranchComponent],
  imports: [
    CommonModule,
    BranchRoutingModule,
    SharedModule,
    MatChipsModule
  ]
})
export class BranchModule { }
