import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Branch } from 'src/app/models/branchDTO';
import { LoanDTO } from 'src/app/models/loanDTO';
import { UserDetailDTO, UserDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { BranchService } from 'src/app/services/APIServices/branch.service';
import { EmployeeService } from 'src/app/services/APIServices/employee.service';
import { LoanService } from 'src/app/services/APIServices/loan.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-loans',
  templateUrl: './add-loans.component.html',
  styleUrls: ['./add-loans.component.scss']
})
export class AddLoansComponent implements OnInit {
  form: FormGroup;
  filterBranchType: Observable<Branch[]>;
  branch: Branch[];
  id: number;
  employee: UserDetailDTO[];
  filterEmployeeType: Observable<UserDTO[]>;




  constructor(private fb: FormBuilder,
    private _sharedService: SharedService,
    private _alertService: AlertService,
    private _branchService: BranchService,
    private _employeeService: EmployeeService,
    private _loanService: LoanService,
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      applicantName: [null, Validators.required],
      jobTitle: [null, Validators.required],
      loanTitle: [null, Validators.required],
      date: [null, Validators.required],
      installment: [null, Validators.required],
      branchId: [null, Validators.required],
      description: [null, Validators.required],
      userDetailId: [null, Validators.required],


    })

    this._branchService.branchObserver$.subscribe(res => {
      this.branch = res as Branch[];
    })
    this._branchService.GetBranch();

    this._employeeService.customerSelectListObserver$.subscribe(res => {
      this.employee = res as UserDetailDTO[];
    })
    this._employeeService.GetEmployees();


    this.filterBranchType = this.form.controls.branchId.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(branch => branch ? this._filterBranchType(branch) : this.branch?.slice())
    )

    this.filterEmployeeType = this.form.controls.userDetailId.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(employee => employee ? this._filterEmployeeType(employee) : this.employee?.slice())
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


  private _filterEmployeeType(value: string) {
    if (value) {
      return this.employee ? this.employee?.filter(Option => Option.displayNameAs?.toLowerCase().includes(value.toString().toLocaleLowerCase())) : [];
    }
  }

  displayEmployeeType(id) {
    if (this.employee && id) {
      return this.employee.find(x => x.id === id)?.displayNameAs;
    }
  }


  onSubmit(formDirective: FormGroupDirective) {
    var data = this.form.value as LoanDTO;
    if (this.form.invalid) {
      return;
    }
    else {


      if (this.id > 0) {
        data.id = this.id;

        this._loanService.UpdateLoan(this.id, data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertService.success('Announcement Updated Successfully.');
            this._loanService.GetLoan();
            this._sharedService.formSubmited.next(res);
          }
        })
      }
      else {
        data.id = 0;

        this._loanService.CreateLoan(data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertService.success('Announcement Inserted Successfully.');
            this._loanService.GetLoan();
            this._sharedService.formSubmited.next(res);
          }
        })
      }

    }
    console.log('datacheck', data);

  }
  }


