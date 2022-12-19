import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AccountDTO } from 'src/app/models/accountDTO';
import { Branch } from 'src/app/models/branchDTO';
import { AlertService } from 'src/app/services/alert.service';
import { AccountsService } from 'src/app/services/APIServices/accounts.service';
import { BranchService } from 'src/app/services/APIServices/branch.service';
import { PayrollService } from 'src/app/services/APIServices/payroll.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-payroll',
  templateUrl: './add-payroll.component.html',
  styleUrls: ['./add-payroll.component.scss']
})
export class AddPayrollComponent implements OnInit {

  form: FormGroup;
  filterBranchType: Observable<Branch[]>;
  branch: Branch[];
  id = 0;
  filterExpenseAccountType: Observable<AccountDTO[]>
  account:AccountDTO[];




  constructor(private fb: FormBuilder,
    private _branchService: BranchService,
    private _payrollService: PayrollService,
    private _alertService: AlertService,
    private _sharedService: SharedService,
    private _expenseAccountService: AccountsService) 
    {

    this.form = this.fb.group({
      name: new FormControl(null, Validators.required),
      branchId: new FormControl(null, Validators.required),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
      expenseAccountId: new FormControl(null, Validators.required),
      isRecurring: new FormControl(null, Validators.required)


    })
  }

  ngOnInit(): void {

    this._branchService.branchObserver$.subscribe(res => {
      this.branch = res;
    })
    this._branchService.GetBranch();

    this._expenseAccountService.accountObserver$.subscribe(res=>{
      this.account = res;
    })
    this._expenseAccountService.GetAccounts();


    this.filterBranchType = this.form.controls.branchId.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(branch => branch ? this._filterBranchType(branch) : this.branch?.slice())
    )
    this.filterExpenseAccountType = this.form.controls.expenseAccountId.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(account => account ? this._filterExpenseAccountType(account) : this.account?.slice())
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

  private _filterExpenseAccountType(value: string){
    if(value){
      return this.account ? this.account?.filter(Option => Option.name?.toLowerCase().includes(value.toString().toLocaleLowerCase())) : [];
    }
  }
  displayExpenseAccountType(id) {
    if (this.account && id) {
      return this.account.find(x => x.id === id)?.name;
    }
  }

  onSubmit(formDirective: FormGroupDirective) {
    var data = this.form.value as PayrollService;
    if (this.form.invalid) {
      return;

    }
    else {
      // update
      if (this.id > 0) {
        data.id = this.id;
        this._payrollService.UpdatePayroll(this.id, data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertService.success('Expense Updated Successfully.');
            this._payrollService.GetPayroll();
            this._sharedService.formSubmited.next(res);
          }
        })
      }
      else {
        data.id = 0;
        this._payrollService.SavePayroll(data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertService.success('Expense Inserted Successfully.');
            this._payrollService.GetPayroll();
            this._sharedService.formSubmited.next(res);

          }
        })
      }

    }



  }

}
