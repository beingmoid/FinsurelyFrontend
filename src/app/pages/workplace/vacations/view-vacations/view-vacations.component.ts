import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from 'src/app/models/branchDTO';
import { VacationDTO } from 'src/app/models/vacationDTO';
import { BranchService } from 'src/app/services/APIServices/branch.service';
import { VacationService } from 'src/app/services/APIServices/vacation.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-view-vacations',
  templateUrl: './view-vacations.component.html',
  styleUrls: ['./view-vacations.component.scss']
})
export class ViewVacationsComponent implements OnInit {
  isVisible = false;
  isEditMode = false;
  branchList: Branch[];
  list: VacationDTO[];
  vacationObserver$: Observable<VacationDTO[]>;


  constructor(private branchService: BranchService,
    private _vacationService: VacationService,
    private _sharedService: SharedService,
  ) { 

  }

  ngOnInit(): void {
    this.branchService.branchObserver$.subscribe(res => {
      this.branchList = res as Branch[];
    });
    this.branchService.GetBranch();

    this._sharedService.formSubmited.subscribe((res) => {
      this.isVisible = false;
    });

    this._vacationService.vacationObserver$.subscribe((res) => {
      if (res) {
        this.list = res;
        console.log('lisst', res)
      }

    })
    this._vacationService.GetVacation();
  }

  openModal() {
    this.isVisible = true;
    this.isEditMode = false;
  }
  closeModal() {
    this.isVisible = false;
  }

}
