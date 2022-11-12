import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';
import { Subject, Subscription } from 'rxjs';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
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
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss']
})
export class ViewCustomerComponent implements OnInit {
  search: string
  listData: UserDetailDTO[] = []
  listDataCopy: string;
  CustomerForm: FormGroup
  isEditMode: boolean;
  isVisible: boolean;
  pageSize: number = 10;
  customerSubject:Subscription;
  customerObserverSubject:Subject<UserDetailDTO> = new Subject();
  sortColumnKey: string;
   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
  constructor(private _service:CustomerService,
    private _sharedService:SharedService,
    private _router:Router) {
      this._sharedService.formSubmited.subscribe( async res=>{
        if(res){
          this.isVisible = false;
          this._service.customerObserver$.subscribe(res=>{
            if(res){
              this.listData=res;
            }
          })
            await this.delay(2000);
            this._service.GetAllCustomers();
         
      
        }
      })
  }
  handleCancel() {
    this.isVisible = false
  }
  ngOnInit(): void {

    this._service.customerObserver$.subscribe(res=>{
      this.listData=res;
    });
    
    this.customerSubject=this._service.customerObserver$.subscribe(res=>{
      if(res){
        this.listData=res;
      }
      // this.isVisible = false;
    });
    this._service.GetAllCustomers();
  }
  EditCustomer(data: UserDetailDTO){
    // this.modalTitle = "Edit Contact";
    this.isVisible = true;
    this.isEditMode = true;
    // this.showContact = false;
    this.customerObserverSubject.next(data);
  }
  showModal() {
    // this.CustomerForm.reset();
    this.isEditMode = false;
    this.isVisible = true;
    this.customerObserverSubject.next(null);
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

  showSingleCustomer(data: UserDetailDTO) {

    let id = data.id;
    if (id) {
      this._router.navigate(['customer/view'], { queryParams: { customerId: id } })
    }
  }

}
