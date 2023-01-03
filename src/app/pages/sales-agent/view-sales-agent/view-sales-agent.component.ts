import { Component, OnInit } from '@angular/core';
// import { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd';
import { Memoize } from 'src/app/directives/memoize.decorator';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SharedService } from 'src/app/services/shared.service';
class FilterObject {
  constructor(private data: any) { }

  index: number = this.data.index;
  firstName: string = this.data.firstName;
  middleName: string = this.data.middleName;
  lastName: string = this.data.lastName;
  fullName: string = this.data.firstName+ " " + this.data.middleName+ " " + this.data.lastName;
  email:string = this.data.email;
  balance: number = this.data.balance;

}
@Component({
  selector: 'app-view-sales-agent',
  templateUrl: './view-sales-agent.component.html',
  styleUrls: ['./view-sales-agent.component.scss']
})
export class ViewSalesAgentComponent implements OnInit {
  form: FormGroup;
  search: string
  listData: UserDetailDTO[] = []
  listDataCopy: string;
  CustomerForm: FormGroup
  isEditMode: boolean;
  isVisible: boolean;
  page=1;
  pageSize=10;
  totalPayable=0;
  sortColumnKey: string;
  isloading=false;

  totalCount;



  constructor(private _service:SalesAgentService,
    private _shared:SharedService,
    private _router:Router , private fb:FormBuilder) {

      this._shared.formSubmited.subscribe(res=>{
        this.isVisible=false;
      });


  }
  searchAddress: string;
  // listData: Branch[];

  sortName = null;
  sortValue = null;
  listOfSearchName = [];

  show = false;

  chiplist = [];

  handleCancel() {
    this.isVisible = false
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      searchQuery: new FormControl(null),
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      branch: new FormControl(null),
      isPdf: new FormControl(null),
      isExcel: new FormControl(null)

    })
    this._service.salesAgentObserver$.subscribe(res=>{
      this.totalPayable=0;
      if(res){
        this.listData=res?.data;
        res.data.forEach((item)=>{

          
          this.totalPayable+=item.openBalance;

        });
    }

    this.totalCount= res?.totalCount;
    console.log('resCHek' ,this.totalCount)
    console.log('2nd', res)

    this.listDataCopy = JSON.stringify(this.listData);
      });

    this._service.GetAgentwithBalancePaginatedAsync(this.page, this.pageSize);


    this.form.controls.searchQuery.valueChanges.subscribe(res=>{
      this._service.GetAgentwithBalancePaginatedAsync(this.page, this.pageSize,res);
    });
    this.form.controls.searchQuery.valueChanges.subscribe(res=>{
      this.Search(res);
    });
  }
  @Memoize()
  Search(str:string){
    this._service.GetAgentwithBalancePaginatedAsync(this.page, this.pageSize,str);
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.isloading=true;
    console.log(this.pageSize, this.page);



  this._service.GetAgentwithBalancePaginatedAsync(this.page, this.pageSize);



  }

  showModal() {
    // this.CustomerForm.reset();
    this.isEditMode = false;
    this.isVisible = true;
  }
  sortOn(colKey: string) {
    if (colKey) {
      this.sortColumnKey = colKey
    }
  }
  sortNamesFn = (a, b) => a[this.sortColumnKey]?.toString().localeCompare(b[this.sortColumnKey])
  sortNumbersFn = (a, b) => a[this.sortColumnKey] - b[this.sortColumnKey]
  filter() {
    this.listData = JSON.parse(this.listDataCopy);
    if (this.search !== "") {
      this.listData = this.listData.filter(item => {
        let data = new FilterObject(item);
        return Object.keys(data).some(
          k =>
            data[k] != null &&
            data[k]
              .toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())
        )
      });
    }
  }
  @Memoize()
  showSingleSalesAgent(data: UserDetailDTO) {

    let id = data.id;
    if (id) {
      this._router.navigate(['sales-agent/view'], { queryParams: { salesAgent: id,agentBalance:data.openBalance } })
    }
  }

  SearchSalesAgent(){

  }
}
