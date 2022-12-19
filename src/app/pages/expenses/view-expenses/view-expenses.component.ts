import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NzModalRef, NzModalService, NzTableQueryParams } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { Expenses } from 'src/app/models/expensesDTO';
import { AlertService } from 'src/app/services/alert.service';
import { ExpensesService } from 'src/app/services/APIServices/expenses.service';
import { SharedService } from 'src/app/services/shared.service';
import { AddExpensesComponent } from '../add-expenses/add-expenses.component';
import { ExpensesModule } from '../expenses.module';

@Component({
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.component.html',
  styleUrls: ['./view-expenses.component.scss']
})
export class ViewExpensesComponent implements OnInit,AfterViewInit {
  form: FormGroup;
  list: Expenses[];
  isVisible = false;
  isEditMode = false;
  expense : Subject<Expenses> = new Subject();
  expenseObserver$ :Observable<Expenses[]>;
  page=1;
  pageSize=10;
  isloading=true;

  // onQueryParamsChange(params: NzTableQueryParams): void {
  //   this.isloading=true;


  // this._expenseService.GetAccountsPaginated(this.page,this.pageSize);
  // }


@ViewChild('formComponent') formComponent:AddExpensesComponent;

  constructor(private modelService:NzModalService,
    private fb: FormBuilder,
    private _service: ExpensesService,
    private _alertService: AlertService,
    private _sharedService: SharedService,
    private _expenseService: ExpensesService) {

    this.form = this.fb.group({
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      branch: new FormControl(null),
      isPdf: new FormControl(null),
      isExcel: new FormControl(null)

    })

  }
  ngAfterViewInit(): void {
    // this.child.afterClose.subscribe(res=>{
    //   console.log('working');

    // })
  }

  searchAddress: string;
  nameList = [
    { text: 'Export as PDF', value: 'PDF', checked: true },
    { text: 'Export as Excel', value: 'Excel', checked: false }
  ];

  data = [
    {
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park'
    }
  ];
  displayData = [...this.data];
  sortName = null;
  sortValue = null;
  listOfSearchName = [];

  show = false;

  chiplist = [];



  ngOnInit(): void {
    this._service.ExpensesObserver$.subscribe((res) => {
      this.list = res;

    })
    this._service.GetExpenses();
    this._sharedService.formSubmited.subscribe(res=>{
      this.isVisible = false;
    })


  }


  showModal() {
    this.isVisible = true;
    this.isEditMode = false

  }

  closeModal() {
    this.isVisible = false;
    this.formComponent.ngOnDestroy();

  }

  editExpense(data:Expenses){


    this.expense.next(data);
    // console.log('Parent ka subject',this.expense);
    // console.log('Parent sa Data gya',data);
    this.isVisible= true;
    this.isEditMode =true;
  }
  deleteExpense(data){
    this._alertService.confirm('Are you sure you want to delete this?').then((res)=>{
      if(res.isConfirmed){
        this._service.DeleteExpenses(data.id).subscribe((res) => {
          if (res.isSuccessfull) {

            this._alertService.success('Expense SuccessFully Deleted');
            this._service.GetExpenses();
          }
        });
      }
    })

  }
}
