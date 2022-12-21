import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { Subject } from 'rxjs/internal/Subject';
import { PolicyType } from 'src/app/models/bodyType';
import { PaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { Refund } from 'src/app/models/refundDTO';
import { Vehicle } from 'src/app/models/TransactionsDTO';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { InsuranceCompanyService } from 'src/app/services/APIServices/insurance-company.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { PolicyTypeService } from 'src/app/services/APIServices/policytype.service';
import { SalesService } from 'src/app/services/APIServices/sales.service';
import { InsuranceType } from 'src/app/models/insuranceTypeDTO';
import { AccountDTO } from 'src/app/models/accountDTO';
import { AccountsService } from 'src/app/services/APIServices/accounts.service';
import { RefundServiceService } from 'src/app/services/APIServices/refund-service.service';
import { AlertService } from 'src/app/services/alert.service';
import { ServiceService } from 'src/app/services/APIServices/service.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-refund',
  templateUrl: './add-refund.component.html',
  styleUrls: ['./add-refund.component.scss']
})
export class AddRefundComponent implements OnInit {
@Input() observerRefund?:Subject<Refund> = new Subject<Refund>();
form:FormGroup;
salesAgents:UserDetailDTO[]=[];
filtersalesAgents:Observable<UserDetailDTO[]>;
vehicle:Vehicle[]=[];
filteredVehicle:Observable<Vehicle[]>;
insuranceCompanys:UserDetailDTO[]=[];
paymentMethod:PaymentMethod[];
filteredInsuranceCompanies:Observable<UserDetailDTO[]>;
filterPolicyType:Observable<PolicyType[]>;
filterAccounts:Observable<AccountDTO[]>
PolicyType:PolicyType[];
isEditMode=false;
insuranceTypeSelect:InsuranceType[]=[];
Accounts:AccountDTO[];
id=0;
isVisible = false;
list: Refund[]
isLoaded = true;



  constructor(private fb:FormBuilder,
    private refundService:RefundServiceService,
    private SalesAgentService:SalesAgentService,
    private insuranceService:InsuranceCompanyService,
    private alert:AlertService,
    private PolicyTypeService:PolicyTypeService,
    private service:SalesService,
    private accountsService:AccountsService,
    private _serviceService: ServiceService,
    private _sharedService:SharedService ) {

    this.form=this.fb.group({
      refundDate:[null,Validators.required],
      agentId:[null,Validators.required],
      paymentMethodId:[null,Validators.required],
      vehilcleId:[null,Validators.required],
      messageOnReceipt:[null,Validators.required],
      messageOnStatement:[null,Validators.required],
      amountForSalesAgent:[null,Validators.required],
      amountForBroker:[null,Validators.required],
      insuranceTypeId:[null],
      policyNumber:[null,Validators.required],
      insuranceCompanyId:[null,Validators.required],
      policyTypeId:[null,Validators.required],
      accountId:[null,Validators.required],

      customerName: [null, Validators.required],
      companyName:[null, Validators.required],
      

    });
   }
   formatDate(res) {
    var date = new Date(`${res} UTC`);
    return date
  }
  startChange(event:any)
  {
    var date = this.formatDate(event.value);
    this.form.controls.refundDate.setValue(date.toISOString());
   console.log("startChange",event.value)
  }
  ngOnInit(): void {

    this._sharedService.formSubmited.subscribe((res) => {
      this.isVisible = false;
    });

    console.log('L1' )
    this.observerRefund.subscribe((res)=>{
      this.form.patchValue(res);
   console.log("l2")
    })

   

    this.accountsService.accountObserver$.subscribe(res=>{
      this.Accounts=res as AccountDTO[];

      console.log("account",  this.Accounts)
    });
    this.accountsService.GetAccounts();

    this.SalesAgentService.salesAgentObserver$.subscribe(res=>{
      this.salesAgents= res as UserDetailDTO[];
    });
    this.SalesAgentService.GetAllSalesAgents();
    this.insuranceService.salesAgentObserver$.subscribe(res=>{
      this.insuranceCompanys=res as UserDetailDTO[];
    });
    this.insuranceService.GetAllSalesAgents();
    this.PolicyTypeService.PolicyTypeObserver$.subscribe(res=>{
      this.PolicyType = res as PolicyType[];
    })
    this.PolicyTypeService.GetPolicyType();
    this.service.vehicleObserver$.subscribe(res=>{
      this.vehicle= res as Vehicle[];
    });
    this.service.GetVehicles();

    this.service.paymentMethodObserver$.subscribe(res=>{
      this.paymentMethod=res;
    });
    this.service.GetPaymentMethod();

    this.service.insuraceTypeObserver$.subscribe(res=>{
      this.insuranceTypeSelect=res as InsuranceType[];
    });
    this.service.GetInsuranceTypes();
    this.filterAccounts= this.form.controls.accountId.valueChanges.pipe(
    
      startWith(''),
        map(value => typeof value === 'string' ? value : value),
      map(address => address ? this._filterAccounts(address) : this.Accounts?.slice())
  
    );
    this.form.controls.accountId.valueChanges.subscribe(res=>{
      console.log(res);
    });
    this.filterPolicyType= this.form.controls.policyTypeId.valueChanges.pipe(

      startWith(''),
        map(value => typeof value === 'string' ? value : value),
      map(address => address ? this._filterPolicyType(address) : this.PolicyType?.slice())

    );
    this.filtersalesAgents= this.form.controls.agentId.valueChanges.pipe(

      startWith(''),
        map(value => typeof value === 'string' ? value : value),
      map(address => address ? this._filterSalesAgent(address) : this.salesAgents?.slice())

    );
      this.filteredVehicle=this.form.controls.vehilcleId.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value),
        map(make => make ? this._filterVehicle(make) : this.vehicle?.slice())
      );
      this.filteredInsuranceCompanies= this.form.controls.insuranceCompanyId.valueChanges.pipe(

        startWith(''),
          map(value => typeof value === 'string' ? value : value),
        map(address => address ? this._filterInsuranceCompany(address) : this.insuranceCompanys?.slice())

      );
  }


  submitForm(formDirective:FormGroupDirective){
    var data = this.form.value as Refund;
    // data.id=parseInt(this.id) ;
    if (this.form.invalid) {
      return;
    }
      else {

        if (this.id > 0) {
          data.id = this.id;
        
          this.refundService.UpdateRefund(this.id, data).subscribe((res) => {
            if (res.isSuccessfull) {
              formDirective.resetForm();
              this.alert.success('Refund Type Updated Successfully.');
              this.refundService.GetRefunds();
              this._sharedService.formSubmited.next(res);
            }
          })
        }
        else {
          data.id = 0;
          
          this.refundService.SaveRefund(data).subscribe((res) => {
            if (res.isSuccessfull) {
              formDirective.resetForm();
              this.alert.success('Refund Type Inserted Successfully.');
              this.refundService.GetRefunds();
              this._sharedService.formSubmited.next(res);
            }
          })
        }
  
      }
        
   
  }
















  //#region utilities
  displayAccounts(id) {

    if(this.Accounts && id){
      return this.Accounts.find(x=>x.id===id).name;
    }
  }
  displayCompanyFn(id) {

    if(this.insuranceCompanys && id){
      return this.insuranceCompanys.find(x=>x.id===id).displayNameAs
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
  }
  displayPolicyType(id) {

    if(this.PolicyType && id){
      return this.PolicyType.find(x=>x.id===id).name
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
  }
  displayVehicle(id){
    if(this.vehicle && id){
      return this.vehicle.find(x=>x.id===id).make+" | "+this.vehicle.find(x=>x.id===id).model;
    }
  }
  displaySalesAgent(id): string {

    if(this.salesAgents && id){
      return this.salesAgents.find(x=>x.id===id).displayNameAs;
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
  }
  private _filterAccounts(value: string) {
    return this.Accounts? this.Accounts?.filter(option => option.name?.toLowerCase().includes(value?value.toString().toLowerCase():"")):[];
  }

  private _filterSalesAgent(value: string) {
    if(value)
      return this.salesAgents? this.salesAgents?.filter(option => option.displayNameAs?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
      return;
  }
  private _filterVehicle(value: string) {
    if(value)
      return this.vehicle? this.vehicle?.filter(option => option.make?.toLowerCase().includes(value.toString().toLowerCase()) || option.model?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
  }
  private _filterInsuranceCompany(value: string) {
    if(value)
      return this.insuranceCompanys? this.insuranceCompanys?.filter(option => option.displayNameAs?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
  }
  private _filterPolicyType(value: string) {
    if(value)
      return this.PolicyType? this.PolicyType?.filter(option => option.name?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
  }
  //#region
}
