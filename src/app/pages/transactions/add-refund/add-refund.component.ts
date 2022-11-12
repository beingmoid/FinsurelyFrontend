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
PolicyType:PolicyType[];
isEditMode=false;
insuranceTypeSelect:InsuranceType[]=[];
Accounts:AccountDTO[];
  constructor(private fb:FormBuilder,
    private SalesAgentService:SalesAgentService,
    private insuranceService:InsuranceCompanyService,
    private PolicyTypeService:PolicyTypeService,
    private service:SalesService,
    private accountsService:AccountsService) {

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

    this.accountsService.accountObserver$.subscribe(res=>{
      this.Accounts=res as AccountDTO[];
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


  submitForm(form:FormGroupDirective){

  }
















  //#region utilities

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
