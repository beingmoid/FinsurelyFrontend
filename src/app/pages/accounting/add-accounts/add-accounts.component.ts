import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
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
  accountName: string = this.data.accountName;
  accountNumber: string = this.data.accountNumber;
  bankAccountTypeName: string = this.data.bankAccountTypeName;
  balance: number = this.data.balance;
}
@Component({
  selector: 'app-add-accounts',
  templateUrl: './add-accounts.component.html',
  styleUrls: ['./add-accounts.component.scss']
})
export class AddAccountsComponent implements OnInit {
  search: string

  listData: AccountDTO[] = []
  filterList:AccountDetailTypeDTO[]=[];
  accountTypes:AccountTypeDTO[]=[];
  data: AccountDTO = new AccountDTO();
  AccountForm: FormGroup
  isEditMode: boolean = false
  isVisible: boolean = false
  accountSubject: any;
  bankAccountTypes: any[] = [];
  accountId:number;
  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;
accountTypesObserver$:Observable<any>;
accountDetailTypeObserver$:Observable<any>;
  showAccount: boolean = false;
  get f() { return this.AccountForm.controls }
  get ifSubAccount(){ return this.f.isSubAccount.value as boolean}
  // get subAccount()
  formObserver$:Observable<any>;
  constructor(
    private fb: FormBuilder,
    private _notification: AlertService,
    private _accounts:AccountsService,
    private sharedService:SharedService,
    // private lookupService: LookupService,
    // private bankAccountService: BankAccountService,
    // public _permissionService: PermissionService
  ) {


  }

  async ngOnInit(): Promise<void> {
    this.AccountForm = this.fb.group({
      id: [0],
      accountId: [null],
      accountTypeId:[null,Validators.required],
      accountDetailTypeId: [null, Validators.required],
      name: [null, Validators.required],
      description: [null],
      number: [null],
      isSubAccount: [false],
      defaultTaxCode:[null],
      asOf:[null],
      openingBalanceEquity:[null]
    });
    this.formObserver$=this.sharedService.openAccountsForm.asObservable();
    this.accountDetailTypeObserver$=this._accounts.accountDetailObserver$;
    this.accountTypesObserver$=this._accounts.accountTypeObserver$;
    await this._accounts.GetAccountTypes();

    this.sharedService.openAccountsForm.subscribe(res=>{
      if(res){
        this.editAccount(res);
      }
      else{
        this.isVisible=true;
      }
    })




  }
  LoadDetails($event,item){
    console.log(item);
    this._accounts.GetAccountTypeDetails(item.id);
  }
  LoadOtherDetails($event,item){
    this.AccountForm.controls.name.setValue(item.description);
    this.AccountForm.controls.accountDetailTypeId.setValue(item.id);
  }
  showModal() {
    this.AccountForm.reset();
    this.isEditMode = false;
    this.isVisible = true;
    this.showAccount = false;
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
    this.AccountForm.patchValue(data);
    this.AccountForm.controls.accountDetailTypeId.setValue(data.accountDetailTypeId);
    this.AccountForm.controls.accountTypeId.setValue(data.accountDetailType.accountTypeId);
    console.log(data);
    this.isEditMode = true;
    this.isVisible = true;
    this.showAccount = false;
    this.accountId=data.id;
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


    // if (!this.isEditMode) {
    //   this.saveBankAccount(data, formDirective);
    // }
    // else {
    //   this.updateBankAccount(data, formDirective);
    // }
  }

  saveAccount(data: AccountDTO, formDirective: FormGroupDirective) {
    data.id = 0;

    this._accounts.SaveAccount(data).subscribe(res => {
      if (res.isSuccessfull) {
        formDirective.resetForm();
        this.isVisible = false;
        this._accounts.GetAccounts();
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
            this._accounts.GetAccounts();
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
  // EditAccounting(){
  //   this.showAccount = false;
  // }
  // DeleteAccounting(){
  //   this.showAccount = false;
  // }
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
