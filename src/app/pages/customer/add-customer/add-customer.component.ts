import { group } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { PreferredPaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { Address, Attachments, CustomerDTO, UserDetailDTO, UserDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { SharedService } from 'src/app/services/shared.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  CustomerForm :FormGroup;
  ParentCustomerInfoTag:boolean;
  UploadURL= API_URL+API_ENDPOINTS.UploadFile;
  customerSelectList:UserDetailDTO[]=[];
  preferredPaymentMethod:PreferredPaymentMethod[]=[];
  terms:{id:number,text:string}[]=[];
  isEditMode=false;
  NzUploadFileList:NzUploadFile[]=[];
  NzUploadFile:NzUploadFile;
  attachments=new FormArray([]);
  address = new FormArray([]);
  addressDTO:Address;
  customerId :number =null;
  addressId:number=null;
  nzShowUploadList:{ showPreviewIcon?: boolean, showRemoveIcon?: boolean, showDownloadIcon?: boolean }={showPreviewIcon:true,showRemoveIcon:true,showDownloadIcon:true};
  @Input() customerDataSub?: Subject<UserDetailDTO>;
  userId: string;
  constructor(private fb:FormBuilder,
    private customerService:CustomerService,
    private alertService:AlertService,
    private _sharedService:SharedService) {

    this.CustomerForm=this.fb.group({

      email:[null],
      userDetails:this.fb.group({
        title:[null],
        firstName:[null],
        lastName:[null],
        middleName:[null],
        suffix:[null],
        company:[null],
        displayNameAs:[null,Validators.required],
        email:[null],
        phone:[null],
        mobile:[null],
        fax:[null],
        other:[null],
        website:[null],
        isSubCustomer:[false],
        userDetailId:[null],
        defaultAccountId:[null],
        imageUrl:[null],
        billWithParent:[false],
        addresses:this.fb.array([]),
         attachments:this.fb.array([])

      })
    });
    var addressGroup= this.fb.group({
      billingAddress:[null],
      street:[null],
      city:[null],
      state:[null],
      postalCode:[null],
      country:[null]
    });
    const group = new FormGroup({
      id:new FormControl(0),
      attachmentUrl:new FormControl(''),
      userDetailId:new FormControl('')
    });

    this.address.controls.push(addressGroup);
    // this.attachments.controls.push(group);
    (this.userDetail.controls.addresses as FormArray).push(this.fnAddress);
    // (this.userDetail.controls.attachments as FormArray).push(this.attachment);

   }

  async ngOnInit(): Promise<void> {
       console.log('Address',this.address);
    if(this.customerDataSub){
      this.customerDataSub.subscribe(res=>{

        if(res){
          this.customerId = res.id;
          this.userId=res.userId;
          this.addressId=res.addresses[0].id;
          this.userDetail.patchValue(res);
          res.attachments.forEach((x,index:number,arr)=>{
            const group = new FormGroup({
              id:new FormControl(0),
              attachmentUrl:new FormControl(''),
              userDetailId:new FormControl('')
            });
            group.controls.attachmentUrl.setValue(x.attachmentUrl)
            group.controls.id.setValue(x.id);
            group.controls.userDetailId.setValue(x.userDetailId);

            // console.log(res.dynamicResult);
            this.attachments.push(group);
            var filename = x.attachmentUrl.substring(x.attachmentUrl.lastIndexOf('/')+1);
            // alert(filename);
           this.NzUploadFile={
            uid: uuidv4(),
            name:filename,
            status:'done',
            url:x.attachmentUrl,
           };
           this.NzUploadFileList.push(this.NzUploadFile);
          //  this.NzUploadFileList=[...this.NzUploadFileList];

          });

          this.isEditMode=true;
         var arr =this.attachments as FormArray;
         this.CustomerForm.controls.attachments=arr;
         //Address

         var addressGroup= this.fb.group({
          billingAddress:[null],
          street:[null],
          city:[null],
          state:[null],
          postalCode:[null],
          country:[null]
        });
        this.addressDTO=res.addresses[0];
        addressGroup.controls.billingAddress.setValue(this.addressDTO.billingAddress)
        addressGroup.controls.street.setValue(this.addressDTO.street);
        addressGroup.controls.city.setValue(this.addressDTO.city);
        addressGroup.controls.state.setValue(this.addressDTO.state);
        addressGroup.controls.postalCode.setValue(this.addressDTO.postalCode);
        addressGroup.controls.country.setValue(this.addressDTO.country);
        this.address.push(addressGroup);


        // this.attachment

          // console.log()
        }
      });
    }
      else{
        this.customerId = 0;
        this.isEditMode=false;
        this.CustomerForm.reset();
        const addressGroup= this.fb.group({
          billingAddress:[null],
          street:[null],
          city:[null],
          state:[null],
          postalCode:[null],
          country:[null]
        });
        // const group = new FormGroup({
        //   id:new FormControl(0),
        //   attachmentUrl:new FormControl(''),
        //   userDetailId:new FormControl('')
        // });
        this.address.push(addressGroup);

        this.CustomerForm.controls.addresses=this.address;
        // this.attachments.push(group);
        // this.CustomerForm.controls.attachments=this.attachments;
      }










    this.userDetail.controls.isSubCustomer.valueChanges.subscribe(res=>{
      this.ParentCustomerInfoTag=res;
    });
    this.customerService.customerSelectListObserver$.subscribe(res=>{
      this.customerSelectList=res;
    });
   await this.customerService.GetCustomers();
    this.customerService.preferredPaymentMethodtObserver$.subscribe(res=>{
      this.preferredPaymentMethod=res;
    });
    await this.customerService.GetPreferredPaymentMethod();
    this.customerService.termsObserver$.subscribe(res=>{
      this.terms=res as {id:number,text:string}[];
    });
    await  this.customerService.GetTerms();
    this.CustomerForm.controls.email.valueChanges.subscribe(res=>{
      if(res){
        this.userDetail.controls.email.setValue(res);
      }
    });
    setTimeout(()=>{
      console.log(this.preferredPaymentMethod);
      console.log(this.terms);
    },3000)


}
   get userDetail () {return this.CustomerForm.controls.userDetails as FormGroup }
    get fnAddress () {return (this.address.controls as FormGroup[] )[0] }

    // get attachment(){return (this.attachments.controls as FormGroup[])[0]}

  handleChange({ file, fileList }: NzUploadChangeParam): void {

    console.log(file);
    // console.log(fileLis)
    const status = file.status;

    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      // this.msg.success(`${file.name} fil e uploaded successfully.`);
      var res =file.response as BaseResponse;
      const group = new FormGroup({
        attachmentUrl:new FormControl('')
      });
      group.controls.attachmentUrl.setValue(res.dynamicResult[0]?.blobURI);
      (this.userDetail.controls.attachments as FormArray).push(group);
      // console.log(res.dynamicResult);

    } else if (status === 'error') {
      // this.msg.error(`${file.name} file upload failed.`);
    }
    console.log(this.attachments);
  }

  async OnSubmit(formDirective: FormGroupDirective){
    if(this.CustomerForm.invalid){
      console.log(this.CustomerForm.invalid);
      return;
    }
    var data = this.userDetail.value as UserDetailDTO;
    // data.attachments= this.userDetail.controls.attachments.value as Attachments[];
    // data.addresses=this.userDetail.controls.addresses.value as Address[];
    // data.isCustomer=true;
    console.log(data);
    if(this.customerId){
      data.id = this.customerId;
      data.addresses[0].id=this.addressId;
      data.addresses[0].userDetailId=data.id;
      data.userId=this.userId;
      this.editCustomer(data,formDirective);
      this.customerService.GetAllCustomers();
      this._sharedService.formSubmited.next({status:'Updated'});
    }
    else{

      await this.saveCustomer(data,formDirective);

    }
  }
  async editCustomer(data:UserDetailDTO, formDirective: FormGroupDirective){
  (await  this.customerService.UpdateCustomer(this.customerId,data)).subscribe(res=>{
    if(res.isSuccessfull){
      this.alertService.success('Customer Updated Successfully!')
      this.customerService.GetCustomerDetail(this.customerId);
      this._sharedService.formSubmited.next(true);
    }
    else {
      this.alertService.error('Error while updating customer!')
    }
   });

  }
 async saveCustomer(data: UserDetailDTO, formDirective: FormGroupDirective) {
    data.id = 0;

   await this.customerService.SaveCustomer(data).subscribe(res=>{
      if(res.isSuccessfull){
        formDirective.resetForm();
        this.alertService.success("Customer Added Sucessfully")
        this.customerService.GetAllCustomers();
        this.customerService.GetCustomers();
        this._sharedService.formSubmited.next({status:'Inserted'});
      }
      else  {
        this.alertService.success("Error Occured while adding customer!")
      }
    });
  }
}
