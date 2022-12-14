import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Service } from 'src/app/models/bodyType';
import { ExpenseCategory } from 'src/app/models/ExpenseCategoryDTO';
import { ExpensecategoryService } from 'src/app/services/APIServices/expensecategory.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-view-expense-category',
  templateUrl: './view-expense-category.component.html',
  styleUrls: ['./view-expense-category.component.scss']
})
export class ViewExpenseCategoryComponent implements OnInit {
name = "Expense Category";
isLoaded = false;
isVisible = false;
isEditmode = false;
pageSize = 20;
list :ExpenseCategory[];




  constructor(private _sharedService:SharedService, private _service:ExpensecategoryService) { 

  }

  ngOnInit(): void {
this._service.ExpenseCategoryObserver$.subscribe((res)=>{
  this.list= res as ExpenseCategory[];
})
this._service.GetExpenseCategory();
    this._sharedService.formSubmited.subscribe((res)=>{
      this.isVisible = false;
    })
  }

  openModal() {
    this.isVisible = true;
    // this.isEditMode= false;
  }
  closeModal() {
    this.isVisible = false;
  }

}
