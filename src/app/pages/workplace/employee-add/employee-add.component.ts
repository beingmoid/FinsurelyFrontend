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
import { EmployeeService } from 'src/app/services/APIServices/employee.service';
import { SharedService } from 'src/app/services/shared.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit {

  EmployeeForm  :FormGroup;
  ParentCustomerInfoTag:boolean;
  UploadURL= API_URL+API_ENDPOINTS.UploadFile;
  loading = false;
  avatarUrl: any;
  customerSelectList:UserDetailDTO[]=[];
  preferredPaymentMethod:PreferredPaymentMethod[]=[];
  terms:{id:number,text:string}[]=[];
  isEditMode=false;
  managers:UserDetailDTO[]=[];
  NzUploadFileList:NzUploadFile[]=[];
  NzUploadFile:NzUploadFile;
  attachments=new FormArray([]);
  address = new FormArray([]);
  addressDTO:Address;
  employeeId :number =null;
  addressId:number=null;
  nzShowUploadList:{ showPreviewIcon?: boolean, showRemoveIcon?: boolean, showDownloadIcon?: boolean }={showPreviewIcon:true,showRemoveIcon:true,showDownloadIcon:true};
  @Input() customerDataSub?: Subject<UserDetailDTO>;
  userId: string;
  file: any;
  constructor(private fb:FormBuilder,
    private customerService:EmployeeService,
    private alertService:AlertService,
    private _sharedService:SharedService) {
 
    this.EmployeeForm =this.fb.group({

  
      title:[null],
      firstName:[null],
      lastName:[null],
      middleName:[null],
      suffix:[null],
      
      displayNameAs:[null,Validators.required],
      email:[null],
      phone:[null],
      mobile:[null],
      fax:[null],
      other:[null],
      website:[null],
      imageUrl:[null],
      billWithParent:[false],
      addresses:this.fb.array([]),
       employmentDetails:this.fb.array([this.fb.group({
        managerId:[null],
        position:[null,Validators.required],
        hiredDate:[null,Validators.required],
       })])
    });
    var addressGroup= this.fb.group({
      billingAddress:[null],
      street:[null],
      city:[null],
      state:[null],
      postalCode:[null],
      country:[null]
    });

  
    this.address.controls.push(addressGroup);
    // this.attachments.controls.push(group);
    (this.EmployeeForm .controls.addresses as FormArray).push(this.fnAddress);
    // (this.EmployeeForm .controls.attachments as FormArray).push(this.attachment);
 
   }

  async ngOnInit(): Promise<void> {
    
        this.employeeId = 0;
        this.isEditMode=false;
        this.EmployeeForm .reset();
        this.customerService.GetManagers().subscribe(res=>{
          if(res.isSuccessfull){
            this.managers=res.dynamicResult as UserDetailDTO[];
          }
        });
      console.log(this.employmentDetails);
     
     
    }
    
         
    formatDate(res) {
      var date = new Date(`${res} UTC`);
      return date
    }
    startChange(event:any)
    {
      var date = this.formatDate(event.value);
      (this.employmentDetails ).controls.hiredDate.setValue(date.toISOString());
     console.log("startChange",event.value)
    }
       

      

  


    

    get fnAddress () {return (this.address.controls as FormGroup[] )[0]  }
    get employmentDetails() {return (this.EmployeeForm.controls.employmentDetails as FormArray ).controls[0] as FormGroup } 
    // get attachment(){return (this.attachments.controls as FormGroup[])[0]}
 
  handleChange({ file, fileList }: NzUploadChangeParam): void {

    this.file=file;
  }

  async OnSubmit(formDirective: FormGroupDirective){
    if(this.EmployeeForm .invalid){
      console.log(this.EmployeeForm .invalid);
      return;
    }
   
    var data = this.EmployeeForm .value as UserDetailDTO;
    // data.attachments= this.EmployeeForm .controls.attachments.value as Attachments[];
    // data.addresses=this.EmployeeForm .controls.addresses.value as Address[];
    // data.isCustomer=true;
    console.log(data);
    if(this.employeeId){
      data.id = this.employeeId;
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
  (await  this.customerService.UpdateCustomer(this.employeeId,data)).subscribe(res=>{
    if(res.isSuccessfull){
      this.alertService.success('Customer Updated Successfully!')
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
      reader.onload = () => {
        this.avatarUrl = reader.result;
        this.loading = false;
        var formData = new FormData();
        formData.append('file',this.file);
        this.customerService.UploadImage(formData).subscribe(res=>{
          if(res.isSuccessfull){
            this.EmployeeForm.controls.imageUrl.setValue(res.dynamicResult[0]?.blobURI)
          }
        });
      };
    }
    return false;
  };
}
