import { A } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Subject } from 'rxjs';
import { AccountDTO } from 'src/app/models/accountDTO';
import { BodyType, PolicyType, Service } from 'src/app/models/bodyType';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { PreferredPaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { SalesInvoice } from 'src/app/models/TransactionsDTO';
import { Address, Attachments, PaymentAndBilling, UserDetailDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { AccountsService } from 'src/app/services/APIServices/accounts.service';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SharedService } from 'src/app/services/shared.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-add-sales-agent',
  templateUrl: './add-sales-agent.component.html',
  styleUrls: ['./add-sales-agent.component.scss']
})
export class AddSalesAgentComponent implements OnInit {
  SalesAgentForm: FormGroup;
  ParentSalesAgentInfoTag: boolean;
  UploadURL = API_URL + API_ENDPOINTS.UploadFile;
  SalesAgentSelectList: UserDetailDTO[] = [];
  Accounts: AccountDTO[];

  preferredPaymentMethod: PreferredPaymentMethod[] = [];
  terms = [];
  _data: UserDetailDTO;
  SalesInvoice: SalesInvoice[] = [];
  isEditMode = false;

  salesAgentId: number;
  addressId: number;
  paymentAndBillingId: number;
  @Input() customerDataSub?: Subject<UserDetailDTO>;

  NzUploadFileList: NzUploadFile[] = [];
  NzUploadFile: NzUploadFile;

  constructor(private fb: FormBuilder,
    private SalesAgentService: SalesAgentService,
    private accountsService: AccountsService,
    private _shared: SharedService,
    private alertService: AlertService) {




  }

  async ngOnInit(): Promise<void> {


    this.SalesAgentForm = this.fb.group({

      title: [null],
      firstName: [null],
      lastName: [null],
      middleName: [null],
      suffix: [null],
      company: [null, Validators.required],
      displayNameAs: [null, Validators.required],
      email: [null],
      phone: [null],
      mobile: [null, Validators.required],
      fax: [null],
      other: [null],
      website: [null],
      isSubCustomer: [false],
      userDetailId: [null],
      defaultAccountId: [null, Validators.required]

    });
    this.accountsService.accountObserver$.subscribe(res => {
      if (res) {
        this.Accounts = res;
        console.log(this.Accounts);
      }
    });
    this.accountsService.GetAccounts();

    if (this.customerDataSub) {

      this.customerDataSub.subscribe(res => {

        if (res) {
          this.isEditMode = true;
          this._data = res;
          this.SalesAgentForm.controls.userDetails.patchValue(this._data);
          this.salesAgentId = this._data.id;
          this.SalesInvoice = res.salesInvoicePersons;
        }





      });





    }

  }
  openAccountModal() {
    this._shared.openAccountsForm.next(null);
  }
  onUpdateHandler(res: UserDetailDTO) {


    this.SalesAgentForm.patchValue(res);
  }



  OnSubmit(formDirective: FormGroupDirective) {

    if (this.SalesAgentForm.invalid) {
      console.log(this.SalesAgentForm.invalid);
      return;
    }

    var data = this.SalesAgentForm.value as UserDetailDTO;
    if (this.salesAgentId) {
      this.updateSalesAgent(data, formDirective);
    }
    else {

      this.saveCustomer(data, formDirective);

    }
  }
  saveCustomer(data: UserDetailDTO, formDirective: FormGroupDirective) {
    data.id = 0;
    this.SalesAgentService.SaveSalesAgent(data).subscribe(res => {
      if (res.isSuccessfull) {
        formDirective.resetForm();
        this.SalesAgentService.GetAllSalesAgents()
        this.alertService.success("Sales Agent Updated Sucessfully")
        this._shared.formSubmited.next({ status: "Inserted" });
      }
      else {
        this.alertService.success("Error Occured")
      }
    })
  }
  async updateSalesAgent(data: UserDetailDTO, formDirective: FormGroupDirective) {
    data.id = this.salesAgentId;

    (await this.SalesAgentService.updateSalesAgent(this.salesAgentId, data)).subscribe(res => {
      if (res.isSuccessfull) {
        formDirective.resetForm();
        this.SalesAgentService.GetAllSalesAgents()
        this.alertService.success("Sales Agent Updated Sucessfully")
        this._shared.formSubmited.next({ status: "Updated" });

      }
      else {
        this.alertService.success("Error Occured")
      }
    });
  }


}
