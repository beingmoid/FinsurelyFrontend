import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd';
import { AccountDetailTypeDTO, AccountDTO, AccountTypeDTO } from 'src/app/models/accountDTO';
import { BankAccountDTO } from 'src/app/models/bankAccountDTO';
import { AlertService } from 'src/app/services/alert.service';
import { AccountsService } from 'src/app/services/APIServices/accounts.service';
import { BankAccountService } from 'src/app/services/APIServices/bankAccount.service';
import { LookupService } from 'src/app/services/APIServices/lookup.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SharedService } from 'src/app/services/shared.service';

class FilterObject {
  constructor(private data: any) { }

  index: number = this.data.index;
  bankName: string = this.data.bankName;
  name: string = this.data.name;
  accountNumber: string = this.data.accountNumber;
  bankAccountTypeName: string = this.data.bankAccountTypeName;
  balance: number = this.data.balance;
}

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  form: FormGroup;
  search: string
  listData: AccountDTO[] = []
  filterList:AccountDetailTypeDTO[]=[];
  accountTypes:AccountTypeDTO[]=[];
  data: AccountDTO = new AccountDTO();
  page=1;
  pageSize=10;
  AccountForm: FormGroup
  isEditMode: boolean = false
  isVisible: boolean = false
  accountSubject: any;
  bankAccountTypes: any[] = [];
  accountId:number;
  sortColumnKey: string;
  listDataCopy: string;
  isloading=true;
  totalCount=0;
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.isloading=true;


  this._accounts.GetAccountsPaginated(this.page,this.pageSize);
  }
  showAccount: boolean = false;
  get f() { return this.AccountForm.controls }
  get ifSubAccount(){ return this.f.isSubAccount.value as boolean}
  // get subAccount()
  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private _accounts:AccountsService
    ,private sharedService:SharedService,
    private _router:Router
    // private lookupService: LookupService,
    // private bankAccountService: BankAccountService,
    // public _permissionService: PermissionService
  ) {


  }
  searchAddress: string;
  // listData: Branch[];
  nameList = [
    { text: 'Export as PDF', value: 'PDF', checked: true },
    { text: 'Export as Excel', value: 'Excel', checked: false }
  ];


  sortName = null;
  sortValue = null;
  listOfSearchName = [];

  show = false;

  chiplist = [];

  ngOnInit(): void {
    this.isloading=true;
    this._accounts.accountObserver$.subscribe(res=>{
      if(res){

        this.listData = res.data;
        this.totalCount=res.totalRows;
        console.log('Res',res);
        this.isloading=false;
      }
    });
    this._accounts.GetAccountsPaginated(this.page,this.pageSize)

    this.isloading=false;
  }
  // LoadDetails($event,item){
  //   console.log(item);
  //   this._accounts.GetAccountTypeDetails(item.id);
  // }
  // LoadOtherDetails($event,item){
  //   this.AccountForm.controls.name.setValue(item.description);
  //   this.AccountForm.controls.accountDetailTypeId.setValue(item.id);
  // }
  showModal() {

    this.sharedService.openAccountsForm.next(null);

  }
  formatDate(res) {
    var date = new Date(`${res} UTC`);
    return date
  }
  startChange(event:any)
  {
    var date = this.formatDate(event.value);
    this.AccountForm.controls.asOf.setValue(date.toISOString());
   console.log("startChange",event.value)
  }
  editAccount(data: AccountDTO) {
    this.sharedService.openAccountsForm.next(data);

  }
  handleCancel() {
    this.isVisible = false
  }
  onSubmit(formDirective: FormGroupDirective) {
    if (!this.AccountForm.valid)
      return;

   var data= this.AccountForm.value as AccountDTO;
    if(this.isEditMode){
      data.id=this.accountId;
      this.updateBankAccount(data,formDirective);
    }
    else{
      this.saveAccount(data,formDirective);
    }

  }
  navigateUrl(data:AccountDTO){
    let id = data.id;
    if (id) {
      this._router.navigate([`accounting/report`], { queryParams: { accountId: data.accountId } })
    }
    
  }
  saveAccount(data: AccountDTO, formDirective: FormGroupDirective) {
    data.id = 0;

    this._accounts.SaveAccount(data).subscribe(res => {
      if (res.isSuccessfull) {
        formDirective.resetForm();
        this.isVisible = false;
        this._accounts.GetAccountsPaginated(this.page,this.pageSize);
        this._notification.success("Account Added Successfully");
      } else {
        this._notification.error("Error Occured")
      }
    })
  }

  updateBankAccount(data: AccountDTO, formDirective: FormGroupDirective) {
    this._accounts.UpdateAccount(data.id,data).subscribe(res => {
      if (res.isSuccessfull) {
        formDirective.resetForm();
        this.isVisible = false;
        this._accounts.GetAccountsPaginated(this.page,this.pageSize);
        this._notification.success("Account Updated Successfully");
      } else {
        this._notification.error("Error while updating account!")
      }
    })
  }

  deleteAccount(id) {
    this._notification.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        this._accounts.DeleteAccount(id).subscribe(res => {
          if (res.isSuccessfull) {
            this._accounts.GetAccountsPaginated(this.page,this.pageSize);
            this._notification.success('Account deleted Successfully!');
            this.showAccount = false;
          }
          else{
            this._notification.error('Error while deleting account!')
          }

        });
      } else {
        return;
      }
    })

  }

  showSingleAccount(data: AccountDTO) {
    this.data = data
    this.showAccount = true;
  }

  // Sorting
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
}
