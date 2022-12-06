import { Component, OnInit } from '@angular/core';
// import { FormGroup } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';
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
  pageSize: number = 10;
  totalPayable=0;
  sortColumnKey: string;
  constructor(private _service:SalesAgentService,
    private _shared:SharedService,
    private _router:Router , private fb:FormBuilder) {
      this._shared.formSubmited.subscribe(res=>{
        this.isVisible=false;
      });
      this.form = this.fb.group({
        dateFrom: new FormControl(null),
        dateTo: new FormControl(null),
        branch: new FormControl(null),
        isPdf: new FormControl(null),
        isExcel: new FormControl(null)
  
      })

  }
  searchAddress: string;
  // listData: Branch[];
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

  handleCancel() {
    this.isVisible = false
  }
  ngOnInit(): void {
    this._service.salesAgentObserver$.subscribe(res=>{
      this.totalPayable=0;
      if(res){
        this.listData=res;
        res.forEach((item)=>{

          this.totalPayable+=item.openBalance;

        });
    }
    this.listDataCopy = JSON.stringify(this.listData);
      });

    this._service.GetAllSalesAgents();

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

  showSingleSalesAgent(data: UserDetailDTO) {

    let id = data.id;
    if (id) {
      this._router.navigate(['sales-agent/view'], { queryParams: { salesAgent: id } })
    }
  }
}
