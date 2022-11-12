import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { InsuranceCompanyService } from 'src/app/services/APIServices/insurance-company.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SupplierService } from 'src/app/services/APIServices/supplier.service';
import { SharedService } from 'src/app/services/shared.service';
class FilterObject {
  constructor(private data: any) { }

  index: number = this.data.index;
  bankName: string = this.data.bankName;
  accountName: string = this.data.accountName;
  accountNumber: string = this.data.accountNumber;
  bankAccountTypeName: string = this.data.bankAccountTypeName;
  balance: number = this.data.balance;
}

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent implements OnInit {
  search: string
  listData: UserDetailDTO[] = []
  listDataCopy: string;
  CustomerForm: FormGroup
  isEditMode: boolean;
  isVisible: boolean;
  pageSize: number = 10;

  sortColumnKey: string;
  constructor(private _service:SupplierService,
    private _shared:SharedService,
    private _router:Router) {
      this._shared.formSubmited.subscribe(res=>{
        this.isVisible=false;
      })
  }
  handleCancel() {
    this.isVisible = false
  }
  ngOnInit(): void {
 
    this._service.salesAgentObserver$.subscribe(res=>{
      this.listData=res;
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
      this._router.navigate(['supplier/view'], { queryParams: { salesAgent: id } })
    }
  }
}
