import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AccountDTO } from 'src/app/models/accountDTO';
import { ExpenseCategory } from 'src/app/models/ExpenseCategoryDTO';
import { Expenses } from 'src/app/models/expensesDTO';
import { AlertService } from 'src/app/services/alert.service';
import { AccountsService } from 'src/app/services/APIServices/accounts.service';
import { ExpensecategoryService } from 'src/app/services/APIServices/expensecategory.service';
import { ExpensesService } from 'src/app/services/APIServices/expenses.service';
import { ServiceService } from 'src/app/services/APIServices/service.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.scss']
})
export class AddExpensesComponent implements OnInit {
  @Input() inputExpenseObserver?: Subject<Expenses>;

  form: FormGroup;
  expenseCategory: ExpenseCategory[];
  filterAccountType: Observable<AccountDTO[]>;
  account: AccountDTO[];
  id = 0;
  expense: Expenses;

  constructor(private fb: FormBuilder,
    private _service: ExpensecategoryService,
    private _expensesService: ExpensesService,
    private _accountService: AccountsService,
    private _serviceService: ServiceService,
    private _sharedService: SharedService,
    private _alertService: AlertService) {

    this.form = this.fb.group({
      expenseName: new FormControl(null, Validators.required),
      expenseDate: new FormControl(null, Validators.required),
      expenseCategoryId: new FormControl(null, Validators.required),
      expenseAmount: new FormControl(null, Validators.required),
      accountId: new FormControl(null, Validators.required),


    })

  }

  ngOnInit(): void {
    this._service.ExpenseCategoryObserver$.subscribe((res) => {
      this.expenseCategory = res;
    })
    this._service.GetExpenseCategory();

    this._accountService.accountObserver$.subscribe((res) => {
      this.account = res;
    })
    this._accountService.GetAccounts();

    if (this.inputExpenseObserver) {
      this.inputExpenseObserver.subscribe((res) => {
        this.expense = res;
        this.form.patchValue(res);
        console.log(res);
        this.id = res.id;
      })
    }

    this.filterAccountType = this.form.controls.accountId.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(account => account ? this._filterAccountType(account) : this.account?.slice())
    )

  }

  private _filterAccountType(value: string) {
    if (value) {
      return this.account ? this.account?.filter(Option => Option.name?.toLowerCase().includes(value.toString().toLocaleLowerCase())) : [];
    }
  }

  displayAccountType(id) {
    if (this.account && id) {
      return this.account.find(x => x.id === id)?.name;
    }
  }

  onSubmit(formDirective: FormGroupDirective) {

    var data = this.form.value as Expenses;
    if (this.form.invalid) {
      return;
    }
    else {
      // update
      if (this.id > 0) {
        data.id = this.id;
        this._expensesService.UpdateExpenses(this.id, data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertService.success('Expense Updated Successfully.');
            this._expensesService.GetExpenses();
            this._sharedService.formSubmited.next(res);
          }
        })
      }
      else {
        data.id = 0;
        this._expensesService.SaveExpenses(data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertService.success('Expense Inserted Successfully.');
            this._expensesService.GetExpenses();
            this._sharedService.formSubmited.next(res);
            
          }
        })
      }

    }



    this._expensesService.SaveExpenses(data).subscribe((res) => {
      if (res.isSuccessfull) {

      }
    })



  }

}
