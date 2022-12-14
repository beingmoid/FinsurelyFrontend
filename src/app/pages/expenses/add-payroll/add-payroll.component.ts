import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Branch } from 'src/app/models/branchDTO';
import { BranchService } from 'src/app/services/APIServices/branch.service';
import { PayrollService } from 'src/app/services/APIServices/payroll.service';

@Component({
  selector: 'app-add-payroll',
  templateUrl: './add-payroll.component.html',
  styleUrls: ['./add-payroll.component.scss']
})
export class AddPayrollComponent implements OnInit {
  
form:FormGroup;
filterBranchType: Observable<Branch[]>;
branch: Branch[];
id =0;



  constructor(private fb:FormBuilder, private _branchService: BranchService, private _payrollService: PayrollService) {
    this.form = this.fb.group({
      name: new FormControl(null, Validators.required),
      branchId: new FormControl(null, Validators.required),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
      salary: new FormControl(null, Validators.required),
      totalPaidForThisYear: new FormControl(null, Validators.required)

    })
   }

  ngOnInit(): void {

    this._branchService.branchObserver$.subscribe(res=>{
      this.branch = res;
    })
    this._branchService.GetBranch();


    this.filterBranchType = this.form.controls.branchId.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(branch => branch? this._filterBranchType(branch) : this.branch?.slice())
    )
    
  }

  private _filterBranchType(value: string) {
    if (value) {
      return this.branch ? this.branch?.filter(Option => Option.branchName?.toLowerCase().includes(value.toString().toLocaleLowerCase())) : [];
    }
  }

  displayBranchType(id) {
    if (this.branch && id) {
      return this.branch.find(x => x.id === id)?.branchName;
    }
  }


  onSubmit(formDirective: FormGroupDirective){
var data = this.form.value as PayrollService;
if(this.form.invalid){
  return;

}
this._payrollService.SavePayroll(data).subscribe(res=>{
  if(res.isSuccessfull){

  }
})
  }

}
