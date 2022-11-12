import { group } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Subject } from 'rxjs';
import { AccountDTO } from 'src/app/models/accountDTO';
import { BlobDTO } from 'src/app/models/blobDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { PreferredPaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { SalesInvoice } from 'src/app/models/TransactionsDTO';
import { Address, Attachments, ComissionRates, PaymentAndBilling, UserDetailDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { AccountsService } from 'src/app/services/APIServices/accounts.service';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { InsuranceCompanyService } from 'src/app/services/APIServices/insurance-company.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SharedService } from 'src/app/services/shared.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-insurance-company',
  templateUrl: './add-insurance-company.component.html',
  styleUrls: ['./add-insurance-company.component.scss']
})
export class AddInsuranceCompanyComponent implements OnInit {
 
  loading = false;
  UploadedImageUrl:string=null;
  avatarUrl: any;
  SalesAgentForm: FormGroup;
  ParentSalesAgentInfoTag: boolean;
  UploadURL = API_URL + API_ENDPOINTS.UploadFile;
  SalesAgentSelectList: UserDetailDTO[] = [];
  Accounts: AccountDTO[];
  preferredPaymentMethod: PreferredPaymentMethod[] = [];
  terms = [];
  _data: UserDetailDTO;
  SalesInvoice:SalesInvoice[]=[];
  isEditMode = false;
  attachments = new FormArray([this.fb.group({
    attachmentUrl: [null],
  })]);
  paymentAndBilling = new FormArray([this.fb.group({
    preferredPaymentMethodId: [null],
    preferredDeliveryMethodId: [null],
    termsId: [null],
    openingBalance: [null],
    asof: [null],
  })]);
  paymentAndDeliveryGroup = this.fb.group({
    preferredPaymentMethodId: [null],
    preferredDeliveryMethodId: [null],
    termsId: [null],
    openingBalance: [null],
    asof: [null],
  });
  address = new FormArray([this.fb.group({
    billingAddress: [null],
    street: [null],
    city: [null],
    state: [null],
    postalCode: [null],
    country: [null]
  })]);
  salesAgentId: number;
  addressId: number;
  file: any;
  paymentAndBillingId: number;
  comissionRates:ComissionRates[]=[];
  TplNewRate=this.fb.control('');
  NonTplNewRate=this.fb.control('');
  @Input() customerDataSub?: Subject<UserDetailDTO>;
 
  NzUploadFileList: NzUploadFile[] = [];
  NzUploadFile: NzUploadFile;
  get tplRate(){return (this.userDetail.controls.comissionRates as FormArray).controls[0] as FormGroup }
  get NontplRate(){return (this.userDetail.controls.comissionRates as FormArray).controls[1] as FormGroup }
  get userDetail() { return this.SalesAgentForm.controls.userDetails as FormGroup }
  get fnAddress() { return (this.address.controls as FormGroup[])[0] }
  get fnPaymentAndDelivery() { return (this.paymentAndBilling.controls as FormGroup[])[0] }
  get fnAttachment() { return (this.attachments.controls as FormGroup[])[0] }
  constructor(private fb: FormBuilder,
    private SalesAgentService: InsuranceCompanyService,
    private accountsService: AccountsService,
    private _shared: SharedService,
    private alertService: AlertService) {

    this.SalesAgentForm = this.fb.group({

      email: [null],
      userDetails: this.fb.group({
  
        company: [null],
        displayNameAs: [null, Validators.required],
        email: [null],
        phone: [null],
        mobile: [null,Validators.required],
        fax: [null],
        other: [null],
        website: [null],
        isSubCustomer: [false],
        userDetailId: [null],
        defaultAccountId: [null, Validators.required],
        imageUrl: [null],
        billWithParent: [false],
        addresses: this.fb.array([]),
        attachments: this.fb.array([]),
      })
    });



  }
  
  beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      this.alertService.error('You can only upload JPG/PNG file!');
      return false;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.alertService.error('Image must smaller than 2MB!');
      return false;
    }
    if (isJpgOrPng && isLt2M) {
      this.loading = true;
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        this.avatarUrl = reader.result;
        await this.UploadImageToBlob();
        this.loading = false; 
      };
    }
    return false;
  };
  async ngOnInit(): Promise<void> {

    this.subscribersAndApiCallers()
    if (this.customerDataSub) {

      this.customerDataSub.subscribe(res => {

        if (res) {
          this.isEditMode = true;
          this._data = res;
          
          this.SalesAgentForm.controls.userDetails.patchValue(this._data);
          this.fnAddress.patchValue(this._data.addresses[0]);
          this.fnPaymentAndDelivery.patchValue(this._data.paymentAndBilling[0]);
          this.salesAgentId = this._data.id;
          this.SalesInvoice=res.salesInvoicePersons;
          if (this._data?.attachments.length > 0) {
            this._data?.attachments?.forEach((x, index: number, arr) => {
              const group = new FormGroup({
                id: new FormControl(0),
                attachmentUrl: new FormControl(''),
                userDetailId: new FormControl('')
              });
              this.fnAttachment.controls
              this.fnAttachment.controls.attachmentUrl.setValue(x?.attachmentUrl)
              this.fnAttachment.controls.id.setValue(x?.id);
              this.fnAttachment.controls.userDetailId.setValue(x?.userDetailId);

              // console.log(res.dynamicResult);
              this.attachments.push(group);
              var filename = x.attachmentUrl.substring(x.attachmentUrl.lastIndexOf('/') + 1);
              // alert(filename);
              this.NzUploadFile = {
                uid: uuidv4(),
                name: filename,
                status: 'done',
                url: x.attachmentUrl,
              };
              this.NzUploadFileList.push(this.NzUploadFile);
              //this.NzUploadFileList = [...this.NzUploadFileList];

            });
          }

          var addressGroup = this.fb.group({
            billingAddress: [null],
            street: [null],
            city: [null],
            state: [null],
            postalCode: [null],
            country: [null]
          });
          if (this._data?.addresses.length > 0) {
            this.addressId = this._data?.addresses[0]?.id;
            addressGroup.controls.billingAddress.setValue(res.addresses[0]?.billingAddress);
            addressGroup.controls.street.setValue(res.addresses[0]?.street);
            addressGroup.controls.city.setValue(res.addresses[0]?.city);
            addressGroup.controls.postalCode.setValue(res.addresses[0]?.postalCode);
            addressGroup.controls.country.setValue(res.addresses[0]?.country);
          }
          //Update Address
          //  this.address.push(addressGroup);
          //  (this.SalesAgentForm.controls.addresses as FormArray).push(this.address);


          if (this._data?.paymentAndBilling.length > 0) {
            this.fnPaymentAndDelivery.controls.preferredPaymentMethodId.setValue(this._data.paymentAndBilling[0]?.preferredPaymentMethodId);
            this.fnPaymentAndDelivery.controls.termsId.setValue(this._data.paymentAndBilling[0]?.termsId);
            this.fnPaymentAndDelivery.controls.openingBalance.setValue(this._data.paymentAndBilling[0]?.openingBalance);
            this.fnPaymentAndDelivery.controls.asof.setValue(this._data.paymentAndBilling[0]?.asof);
          }
          // this.paymentAndBilling.push(this.paymentAndDeliveryGroup);
          // (this.SalesAgentForm.controls.paymentAndBilling as FormArray)=(this.paymentAndBilling);

        }




      });


      await this.subscribersAndApiCallers();


    }
    else {

      this.onCreateHandler();
    }
  }
  openAccountModal(){
    this._shared.openAccountsForm.next(null);
  }
  onUpdateHandler(res: UserDetailDTO) {


    this.userDetail.patchValue(res);




    //Update Payment And Delivery Method


    // this.attachment

  }
  onCreateHandler() {
    this.salesAgentId = 0;
    this.addressId = 0;
    this.paymentAndBillingId = 0;
    this.isEditMode = false;
    this.SalesAgentForm.reset();
    var addressGroup = this.fb.group({
      billingAddress: [null],
      street: [null],
      city: [null],
      state: [null],
      postalCode: [null],
      country: [null]
    });
    var paymentAndDeliveryGroup = this.fb.group({
      preferredPaymentMethodId: [null],
      termsId: [null],
      openingBalance: [null],
      asof: [null],
    });
    //Insert address
    this.address.push(addressGroup);
    // (this.SalesAgentForm.controls.address as FormArray).push(this.address);
    //Insert paymentAndBilling
    this.paymentAndBilling.push(paymentAndDeliveryGroup);
    // (this.SalesAgentForm.controls.paymentAndBilling as FormArray).push(this.paymentAndBilling);
    // attachments
    const group = new FormGroup({
      id: new FormControl(0),
      attachmentUrl: new FormControl(''),
      userDetailId: new FormControl('')
    });
    this.attachments.push(group);
    // (this.SalesAgentForm.controls.attachments as FormArray).push(this.attachments);
  }
  async subscribersAndApiCallers() {
    this.accountsService.accountObserver$.subscribe(res => {
      this.Accounts = res;
    });
    await this.accountsService.GetAccounts();
    this.userDetail.controls.isSubCustomer.valueChanges.subscribe(res => {
      this.ParentSalesAgentInfoTag = res;
    });
    this.SalesAgentService.salesAgentSelectListObserver$.subscribe(res => {
      this.SalesAgentSelectList = res;
    });
    await this.SalesAgentService.GetSalesAgents();
    this.SalesAgentService.preferredPaymentMethodtObserver$.subscribe(res => {
      this.preferredPaymentMethod = res;
    });
    await this.SalesAgentService.GetPreferredPaymentMethod();
    this.SalesAgentService.termsObserver$.subscribe(res => {
      this.terms = res;
    });
    await this.SalesAgentService.GetTerms();
    this.SalesAgentForm.controls.email.valueChanges.subscribe(res => {
      if (res) {
        this.userDetail.controls.email.setValue(res);
      }
    });7
  }


  handleChange({ file, fileList }: NzUploadChangeParam): void {

    console.log(file);
    // console.log(fileLis)
    const status = file.status;

    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      // this.msg.success(`${file.name} fil e uploaded successfully.`);
      var res = file.response as BaseResponse;
      const group = new FormGroup({
        attachmentUrl: new FormControl('')
      });
      group.controls.attachmentUrl.setValue(res.dynamicResult[0]?.blobURI);
      (this.userDetail.controls.attachments as FormArray).push(group);
      // console.log(res.dynamicResult);

    } else if (status === 'error') {
      // this.msg.error(`${file.name} file upload failed.`);
    }
    console.log(this.attachments);
  }

  async OnSubmit(formDirective: FormGroupDirective) {

    debugger;

    if (this.SalesAgentForm.invalid) {
      console.log(this.SalesAgentForm.invalid);
      return;
    }

    var data = this.userDetail.value as UserDetailDTO;

    if (data.addresses.length > 0) {
      data.addresses[0].id = this.addressId;
      data.addresses[0].userDetailId = data.id;
      data.addresses[0] = this.fnAddress.value;
    }
    else {
      data.addresses = [this.fnAddress.value];
    }
    if (data.attachments.length > 0) {
      data.attachments = this.attachments.value as Attachments[];
    }
    else {
      data.attachments = [this.fnAttachment.value];
    }

    if (this.salesAgentId) {

      this.updateSalesAgent(data, formDirective);
    }
    else {

      this.saveCustomer(data, formDirective);

    }
  }
  saveCustomer(data: UserDetailDTO, formDirective: FormGroupDirective) {
    data.id=0;

    if(this.UploadedImageUrl){
      data.imageUrl=this.UploadedImageUrl
    }
    this.SalesAgentService.SaveSalesAgent(data).subscribe(res=>{
      if(res.isSuccessfull){
        formDirective.resetForm();
        this.SalesAgentService.GetAllSalesAgents()
        
        this.alertService.success("Sales Agent Updated Sucessfully")
        this._shared.formSubmited.next({ status: "add-insurance-company" });
        this.SalesAgentService.GetSalesAgents();
      }
      else {
        this.alertService.success("Error Occured")
      }
    })
  }
  async updateSalesAgent(data: UserDetailDTO, formDirective: FormGroupDirective) {
    data.id = this.salesAgentId;
    if(this.TplNewRate.value==false){
     var value = data.comissionRates.filter(x=>x.isTpl)[0];
     var index = data.comissionRates.indexOf(value);
     value.id=this.comissionRates.filter(x=>x.isTpl)[0].id;
     value.userDetailId=this.salesAgentId;
     data.comissionRates[index]=value;
     

    
    }
    else{
      var value = data.comissionRates.filter(x=>x.isTpl)[0];
     var index = data.comissionRates.indexOf(value);
     value.id=0;
     data.comissionRates[index]=value;
    }
    if(this.NonTplNewRate.value==false){
      var value = data.comissionRates.filter(x=>x.isNonTpl)[0];
      var index = data.comissionRates.indexOf(value);
      value.id=this.comissionRates.filter(x=>x.isNonTpl)[0].id;
      value.userDetailId=this.salesAgentId;
      data.comissionRates[index]=value;
 
     
     }
     else{
       var value = data.comissionRates.filter(x=>x.isNonTpl)[0];
      var index = data.comissionRates.indexOf(value);
      value.id=0;
      data.comissionRates[index]=value;
     }
     if(this.UploadedImageUrl){
       data.imageUrl=this.UploadedImageUrl
     }
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

  async UploadImageToBlob(){
    let blobs:BlobDTO[] = [];
  (await  this.SalesAgentService.UploadBlobFile(this.file)).subscribe(res=>{
      if(res.isSuccessfull){
        console.log(res.dynamicResult);
        blobs=res.dynamicResult as BlobDTO[];
        this.UploadedImageUrl=blobs[0].blobURI;
      }

    });
  }
}
