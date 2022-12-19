import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NzModalRef, NzModalService, NzTableQueryParams } from 'ng-zorro-antd';
import { Observable, Subject } from 'rxjs';
import { Branch } from 'src/app/models/branchDTO';
import { Expenses } from 'src/app/models/expensesDTO';
import { API_ENDPOINTS } from 'src/app/models/Global';
import { PaginatedData } from 'src/app/models/paginatedResponse';
import { Search } from 'src/app/models/search';
import { AlertService } from 'src/app/services/alert.service';
import { BranchService } from 'src/app/services/APIServices/branch.service';
import { ExpensesService } from 'src/app/services/APIServices/expenses.service';
import { SearchService } from 'src/app/services/APIServices/search.service';
import { SharedService } from 'src/app/services/shared.service';
import { AddExpensesComponent } from '../add-expenses/add-expenses.component';
import { ExpensesModule } from '../expenses.module';

@Component({
  selector: 'app-view-expenses',
  templateUrl: './view-expenses.component.html',
  styleUrls: ['./view-expenses.component.scss']
})
export class ViewExpensesComponent implements OnInit {
  form: FormGroup;
  list: Expenses[];
  isVisible = false;
  isEditMode = false;
  expense: Subject<Expenses> = new Subject();
  expenseObserver$: Observable<Expenses[]>;
  itemsPerPage: number = 10;
  branchList: Branch[];
  isloading = true;

  @ViewChild('formComponent') formComponent: AddExpensesComponent;

  constructor(
    private branchService: BranchService,
    private modelService: NzModalService,
    private fb: FormBuilder,
    private _service: ExpensesService,
    private _searchService: SearchService<PaginatedData<Expenses>>,
    private _alertService: AlertService,
    private _sharedService: SharedService) {

    this.form = this.fb.group({
      from: new FormControl(null),
      to: new FormControl(null),
      branchId: new FormControl(null),
      downloadPDF: new FormControl(null),
      downloadExcel: new FormControl(null),
      searchQuery: new FormControl(null)
    });


  }

  pageSize = 10;
  page = 1;
  totalPages = 10;
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
  search: Search = new Search();
  totalCount = 1;
  isSearch = false;
  TableTitle = "";
  ngOnInit(): void {

    this.search.itemsPerPage = 10;
    this.branchService.branchObserver$.subscribe(res => {
      this.branchList = res as Branch[];
    });
    this.branchService.GetBranch();
    this._service.ExpensesObserver$.subscribe((res) => {
      this.list = res?.data;
      this.totalPages = res?.totalPages;
      this.totalCount = res?.totalCount;
      this.TableTitle = `Total ${this.totalCount}# of rows are been recorded as expense`
      this.isloading = false;
      console.log(res);


    })
    this._service.GetPaginatedExpense(this.page, this.pageSize);
    this._sharedService.formSubmited.subscribe(res => {
      this.isVisible = false;
    });


  }
  SwitchDefault() {
    this.page = 1;
    this._service.GetPaginatedExpense(this.page, this.pageSize);
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.isloading = true;
    if (this.isSearch) {
      this.isSearch = true;
      this._searchService.searchObserver$.subscribe(res => {
        this.list = res?.data;
        this.totalPages = res?.totalPages;
        this.totalCount = res?.totalCount;
        this.TableTitle = `Total ${this.totalCount}# of expenses are been found on search`
        this.isloading = false;
        console.log(res);
      });
      this.TableTitle = ""
      this.search = this.form.value as Search;
      this.search.page = this.page;
      this.search.itemsPerPage = this.pageSize;
      console.log(this.search);
      this._searchService.Search(this.search);
    }
    else {
      this._service.GetPaginatedExpense(this.page, this.pageSize);
    }

  }
  Search() {
    this.page = 1;
    this.isSearch = true;
    this._searchService.searchObserver$.subscribe(res => {
      this.list = res?.data;
      this.totalPages = res?.totalPages;
      this.totalCount = res?.totalCount;
      this.TableTitle = `Total ${this.totalCount}# of expenses are been found on search`
      this.isloading = false;
      console.log(res);
    });
    this.TableTitle = ""
    this.search = this.form.value as Search;
    this.search.page = this.page;
    this.search.itemsPerPage = this.pageSize;
    console.log(this.search);
    this._searchService.Search(this.search);
  }

  showModal() {
    this.isVisible = true;
    this.isEditMode = false

  }

  closeModal() {
    this.isVisible = false;
    this.formComponent.ngOnDestroy();

  }

  editExpense(data: Expenses) {


    this.expense.next(data);
    this.isVisible = true;
    this.isEditMode = true;
  }
  getBranchName(id: number) {

    return this.branchList.find(x => x.id = id)?.branchName;
  }
  deleteExpense(data) {
    this._alertService.confirm('Are you sure you want to delete this?').then((res) => {
      if (res.isConfirmed) {
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
