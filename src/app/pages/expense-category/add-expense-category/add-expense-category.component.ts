import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ExpenseCategory } from 'src/app/models/ExpenseCategoryDTO';
import { AlertService } from 'src/app/services/alert.service';
import { ExpensecategoryService } from 'src/app/services/APIServices/expensecategory.service';
import { ServiceService } from 'src/app/services/APIServices/service.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-expense-category',
  templateUrl: './add-expense-category.component.html',
  styleUrls: ['./add-expense-category.component.scss']
})
export class AddExpenseCategoryComponent implements OnInit {
@Input() inputExpenseCategoryObserver?: Subject<ExpenseCategory>;
  
form:FormGroup;
ExpenseCategory: ExpenseCategory;
id=0;

  constructor(private fb:FormBuilder, private _alertService: AlertService, private _expenseCategoryService: ExpensecategoryService ,private _sharedService:SharedService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name:[null, Validators.required]

    })

    
    if (this.inputExpenseCategoryObserver) {
      this.inputExpenseCategoryObserver.subscribe((res) => {
        if (res) {
          this.ExpenseCategory = res;
          this.form.patchValue(res);
          this.id = res.id;
        }
      })
    }
  }
  onSubmit(formDirective: FormGroupDirective) {
  var data = this.form.value as ExpenseCategory;
  if (this.form.invalid) {
    return;
  }

  this._expenseCategoryService.SaveExpenseCategory(data).subscribe((res) => {
    if (res.isSuccessfull) {
      formDirective.resetForm();
      this._alertService.success('Policy Type Inserted Successfully.');
      this._expenseCategoryService.GetExpenseCategory();
      this._sharedService.formSubmited.next(res);
    }
  })



  }

}
