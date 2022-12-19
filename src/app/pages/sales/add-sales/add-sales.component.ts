import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, RequiredValidator, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { InsuranceType } from 'src/app/models/insuranceTypeDTO';
import { PaymentMethod, PreferredPaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { SalesInvoice, Vehicle } from 'src/app/models/TransactionsDTO';
import { ComissionRates, UserDetailDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { InsuranceCompanyService } from 'src/app/services/APIServices/insurance-company.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SalesService } from 'src/app/services/APIServices/sales.service';
import { SharedService } from 'src/app/services/shared.service';
import * as moment from 'moment';
import { Branch } from 'src/app/models/branchDTO';
import { BranchService } from 'src/app/services/APIServices/branch.service';
import { BodyType, PolicyType, Service } from 'src/app/models/bodyType';
import { BodytypeService } from 'src/app/services/APIServices/bodytype.service';
import { ServiceService } from 'src/app/services/APIServices/service.service';
import { PolicyTypeService } from 'src/app/services/APIServices/policytype.service';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';


@Component({
  selector: 'app-add-sales',
  templateUrl: './add-sales.component.html',
  styleUrls: ['./add-sales.component.scss']
})
export class AddSalesComponent implements OnInit {
  @Input()  inputObserver?:Subject<SalesInvoice>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  sysdate = moment().format('MMMM Do YYYY, h:mm a');
  branch: Branch[]=[];
  BodyType:BodyType[];
  Service:Service[]=[];
  PolicyType:PolicyType[];
  isVisible2=false;
  isVisible3=false;
  shouldBeHidden=true;
  constructor(private fb:FormBuilder,private customerService:CustomerService,
    private BranchService:BranchService,
    private SalesAgentService:SalesAgentService,
    private insuranceService:InsuranceCompanyService,
    private alert:AlertService,
    private service:SalesService,
    private BodyTypeService:BodytypeService,
    private ServiceService:ServiceService,
    private PolicyTypeService:PolicyTypeService,
    private sharedService:SharedService) {

      this.sharedService.bodyform.subscribe(res=>{

        this.isVisible2=false;

        this.BodyTypeService.GetBodyType();
      });
      this.sharedService.bodyform.subscribe(res=>{

        this.isVisible2=false;

        this.BodyTypeService.GetBodyType();
      });
      this.sharedService.serviceForm.subscribe(res=>{

        this.isVisible3=false;

        this.ServiceService.GetService();
      });
      this.sharedService.vehicleForm.subscribe(res=>{

        this.isVisible=false;

        this.service.GetVehicles();
      });

    this.SalesForm=this.fb.group({
      customerName:[null,Validators.required],
      chassisNumber:[null,Validators.required],
      salesInvoiceDate:[new Date(),Validators.required],
      policyTypeId:[null,Validators.required],
      bodyTypeId:[null],
      serviceId:[null],
      salesInvoicePersonId:[null,Validators.required],
      insuranceCompanyId:[null,Validators.required],
      insuranceTypeId:[null,Validators.required],
      branchId:[null,Validators.required],
      underWritter:[null,Validators.required],
      paymentMethodId:[null,Validators.required],
      notes:[null,Validators.required],
      total:[null,Validators.required],
      saleLineItem:this.fb.array([this.fb.group({
        policyNumber:[null,Validators.required],
        vehilcleId:[null,Validators.required],
        total:[null,Validators.required],
        gross:[null,Validators.required],
        vat:[null],
        commissionRate:[null],
        commission:[null],
        net:[null],
        salesPrice:[null,Validators.required],
        actualComission:[null]
      })])
    });
    this.AmountPayable=this.fb.control('');
    this.AmountReceviable=this.fb.control('');

   }
   isLoading=false;
   comission:number=0;
   ComissionRate:ComissionRates;
   net:number=0;
   isEditMode=false;
   isVisible=false;
   isInsuranceCompanyVisible=false;
   isCustomerVisible=false;
  SalesForm:FormGroup;
  insuranceCompanys:UserDetailDTO[]=[];
  filteredInsuranceCompanies:Observable<UserDetailDTO[]>;
  salesAgents:UserDetailDTO[]=[];
  filtersalesAgents:Observable<UserDetailDTO[]>;
  customers:UserDetailDTO[]=[]
  filterCustomers:Observable<UserDetailDTO[]>;
  filteredBranch:Observable<Branch[]>;
  filterService:Observable<Service[]>;
  filterPolicyType:Observable<PolicyType[]>;
  filteredBodyType:Observable<BodyType[]>;
  insuranceTypeSelect:InsuranceType[]=[];
  vehicle:Vehicle[]=[];
  filteredVehicle:Observable<Vehicle[]>;
  paymentMethod:PaymentMethod[];
  salesId:number;
  LineItemId:number;
  SalesInvoice:SalesInvoice;
  AmountPayable:FormControl;
  AmountReceviable:FormControl;
  enableSaleAgent=true;
  today = new Date();
  get saleInvoice(){return  this.SalesForm.controls; }
  get saleLine(){return  ((this.SalesForm.controls.saleLineItem as FormArray).controls[0] as FormGroup); }
  async ngOnInit(): Promise<void>{
    this.SalesForm.controls.paymentMethodId.valueChanges.subscribe(res=>{

      if(res==1) //cash sale
      {

        this.enableSaleAgent=false;
        this.SalesForm.controls.salesInvoicePersonId.setValue(null);
        this.SalesForm.controls.salesInvoicePersonId
      }
      else{
        this.enableSaleAgent=true;
      }

      });
    this.BranchService.GetBranch();
    this.SalesForm.controls.salesInvoiceDate.setValue(new Date().getDate())
    this.saleLine.controls.commission.valueChanges.subscribe(res=>{
      this.CalculateNET();
    });
    this.saleLine.controls.salesPrice.valueChanges.subscribe(res=>{
      this.CalculateActualCommission(res);
    });
    console.log(this.saleInvoice);
    this.customerService.customerSelectListObserver$.subscribe(res=>{
      this.customers=res;

    });
       this.customerService.GetCustomers();
    this.SalesAgentService.salesAgentSelectListObserver$.subscribe(res=>{
      this.salesAgents=res;
    });
    this.SalesAgentService.GetSalesAgents();
    this.insuranceService.salesAgentSelectListObserver$.subscribe(res=>{
      this.insuranceCompanys=res;
      console.log(this.insuranceCompanys);

    })
      this.insuranceService.GetSalesAgents();
  this.service.insuraceTypeObserver$.subscribe(res=>{
    this.insuranceTypeSelect=res as InsuranceType[];
  });
  this.service.GetInsuranceTypes();
  this.service.vehicleObserver$.subscribe(res=>{
    this.vehicle=res as Vehicle[];
  });

  this.service.GetVehicles();
  this.service.paymentMethodObserver$.subscribe(res=>{
    this.paymentMethod=res;
  });
  this.service.GetPaymentMethod();
  this.BranchService.branchObserver$.subscribe(res=>{
    if(res){
      this.branch= res as Branch[];
    }
  });
  this.BodyTypeService.bodyTypeObserver$.subscribe(res=>{
    this.BodyType = res as BodyType[];
  })
  this.BodyTypeService.GetBodyType();
  this.PolicyTypeService.PolicyTypeObserver$.subscribe(res=>{
    this.PolicyType = res as PolicyType[];
  })
  this.PolicyTypeService.GetPolicyType();
  this.ServiceService.ServiceObserver$.subscribe(res=>{
    this.Service = res as Service[];
  });
  
  this.filterPolicyType= this.SalesForm.controls.policyTypeId.valueChanges.pipe(

    startWith(''),
      map(value => typeof value === 'string' ? value : value),
    map(address => address ? this._filterPolicyType(address) : this.PolicyType?.slice())

  );
  this.filteredBodyType= this.SalesForm.controls.bodyTypeId.valueChanges.pipe(

    startWith(''),
      map(value => typeof value === 'string' ? value : value),
    map(address => address ? this._filterBodyType(address) : this.BodyType?.slice())

  );
  this.filterService= this.SalesForm.controls.serviceId.valueChanges.pipe(

    startWith(''),
      map(value => typeof value === 'string' ? value : value),
    map(address => address ? this._filterService(address) : this.Service?.slice())

  );
  this.filterPolicyType= this.SalesForm.controls.insuranceCompanyId.valueChanges.pipe(

    startWith(''),
      map(value => typeof value === 'string' ? value : value),
    map(address => address ? this._filterBodyType(address) : this.BodyType?.slice())

  );
  this.filteredInsuranceCompanies= this.SalesForm.controls.insuranceCompanyId.valueChanges.pipe(

    startWith(''),
      map(value => typeof value === 'string' ? value : value),
    map(address => address ? this._filterInsuranceCompany(address) : this.insuranceCompanys?.slice())

  );



  // this.filterCustomers= this.SalesForm.controls.customerDetailId.valueChanges.pipe(

  //   startWith(''),
  //     map(value => typeof value === 'string' ? value : value),
  //   map(address => address ? this._filterCustomers(address) : this.customers?.slice())

  // );
  this.filtersalesAgents= this.SalesForm.controls.salesInvoicePersonId.valueChanges.pipe(

    startWith(''),
      map(value => typeof value === 'string' ? value : value),
    map(address => address ? this._filterSalesAgent(address) : this.salesAgents?.slice())

  );
    this.filteredVehicle=this.saleLine.controls.vehilcleId.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(make => make ? this._filterVehicle(make) : this.vehicle?.slice())
    );
    this.saleLine.controls.total.valueChanges.subscribe(res=>{
      this.saleInvoice.total.patchValue(res);
    });

    this.filteredBranch=this.SalesForm.controls.branchId.valueChanges.pipe(

      startWith(''),
      map(value => typeof value === 'string' ? value : value),
      map(make => make ? this._filterBranch(make) : this.branch?.slice())
    );
      if(this.inputObserver){
        this.inputObserver.subscribe(res=>{
          if(res){
            this.SalesInvoice=res;
            this.isEditMode=true;

            this.shouldBeHidden=false;
            this.salesId=res.id;
            this.LineItemId=this.SalesInvoice.saleLineItem[0]?.id;
            this.SalesForm.patchValue(res);
          }

        });

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


  displayBodyType(id) {

    if(this.BodyType && id){
      return this.BodyType.find(x=>x.id===id).name
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
  }
  displayService(id) {

    if(this.Service && id){
      return this.Service.find(x=>x.id===id)?.name
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
  }
  displayCustomerFn(id) {

    if(this.customers && id){
      return this.customers.find(x=>x.id===id).displayNameAs;
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
  }
  displaySalesAgent(id) {

    if(this.salesAgents && id){
      return this.salesAgents.find(x=>x.id===id).displayNameAs;
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
  }
  displayVehicle(id){
    if(this.vehicle && id){
      return this.vehicle.find(x=>x.id===id).make+" | "+this.vehicle.find(x=>x.id===id).model;
    }
  }
  displayBranch(id){
    if(this.branch && id){
      return this.branch.find(x=>x.id===id).branchName;
    }
  }
  handleCancel2() {
    this.isVisible2 = false
  }
  handleCancel3() {
    this.isVisible3 = false
  }
  CalculateNET(){

    let commission=  parseFloat((this.saleLine.controls.commission.value))/100;
    let premiumPrice = parseFloat(this.saleLine.controls.gross.value);
    if(premiumPrice>0){
      let PriceWithoutvat = premiumPrice/1.05;
      console.log('Price without VAT',PriceWithoutvat)

      let commisionRate = PriceWithoutvat*commission;
      // let VAT = (commisionRate*0.05); Ahmed Calculation
      let VAT = premiumPrice-PriceWithoutvat;
      this.saleLine.controls.vat.setValue(VAT.toFixed(2));
      console.log('VAT',VAT)
      this.saleLine.controls.commissionRate.setValue(commisionRate.toFixed(2));
      console.log('COMMISSION RATE',commisionRate.toFixed(2));
      let NET =((PriceWithoutvat-commisionRate)+VAT).toFixed(2);
      console.log('NET',NET);
      this.saleLine.controls.net.setValue(NET);
      this.saleLine.controls.total.setValue(PriceWithoutvat.toFixed(2));

      // let commission=  parseFloat((this.form.controls.commission.value))/100;
      // let premiumPrice = parseFloat(this.form.controls.premiumPrice.value);
      // let PriceWithoutvat = premiumPrice/1.05;
      // console.log('Price without VAT',PriceWithoutvat)
      // let VAT = premiumPrice-PriceWithoutvat;
      // console.log('VAT',VAT)
      // let commisionRate = PriceWithoutvat*commission;
      // console.log('COMMISSION RATE',commisionRate);

      // let NET =((PriceWithoutvat-commisionRate)+VAT).toFixed(2);
      // console.log('NET',NET);
      // this.form.controls.netPrice.setValue(NET);
    }

    }

    onPolicyTypeSelection(id){
      console.log('this.Service')
      this.ServiceService.ServiceSubject$.next(null);
    this.ServiceService.GetService();
    if(id.value==22){
      this.shouldBeHidden=false;
    }
    else{
      this.shouldBeHidden=true;
    }


   }
  CalculateActualCommission(salesPrice){

    let commission=   parseFloat(this.saleLine.controls.commission.value)
    let premiumPrice =  parseFloat(this.saleLine.controls.gross.value);

    let VAT:number =  parseFloat(this.saleLine.controls.vat.value);

    let commisionRate:number =  parseFloat(this.saleLine.controls.commissionRate.value);

    let NET:number =  parseFloat(this.saleLine.controls.net.value);
    let Total:number =   parseFloat(this.saleLine.controls.total.value);

    this.AmountPayable.setValue(NET.toFixed(2));
    let ActualComission =parseFloat( ((salesPrice-NET)-(VAT)).toFixed(2));
    this.AmountReceviable.setValue(salesPrice ) ;
    this.saleLine.controls.actualComission.setValue(ActualComission);


    }
  getCommissionRates(e){

    var insuranceCompanyId= this.SalesForm.controls.insuranceCompanyId.value;
    var gross = this.saleLine.controls.gross.value;
    if(e.value && insuranceCompanyId){

      if(e.value==1){
        this.service.GetComissionRates(insuranceCompanyId,true).subscribe(res=>{
          if(res.dynamicResult){
            this.ComissionRate=res.dynamicResult as ComissionRates;
            this.saleLine.controls.commission.setValue(this.ComissionRate.rates)
          }
        });
      }
      else{
        this.service.GetComissionRates(insuranceCompanyId,false).subscribe(res=>{
          if(res.dynamicResult){
            this.ComissionRate=res.dynamicResult as ComissionRates;
            this.saleLine.controls.commission.setValue(this.ComissionRate.rates)
          }
        });
      }
      if(gross){
        this.CalculateNET();
      }

    }
  }

  private _filterBodyType(value: string) {
    if(value)
      return this.BodyType? this.BodyType?.filter(option => option.name?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
  }
  private _filterPolicyType(value: string) {
    if(value)
      return this.PolicyType? this.PolicyType?.filter(option => option.name?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
  }
  private _filterService(value: string) {
    if(value)
      return this.Service? this.Service?.filter(option => option.name?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
  }

  private _filterInsuranceCompany(value: string) {
    if(value)
      return this.insuranceCompanys? this.insuranceCompanys?.filter(option => option.displayNameAs?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
  }
  private _filterCustomers(value: string) {
    if(value)
      return this.customers? this.customers?.filter(option => option.displayNameAs?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
      return;
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
  private _filterBranch(value: string) {
    if(value)
      return this.branch? this.branch?.filter(option => option.branchName?.toLowerCase().includes(value.toString().toLowerCase()) || option.branchName?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
  }

  handleCancel() {
    this.isVisible = false
  }
  showModal() {
    this.isVisible = true;
  }
  showModal2() {
    this.isVisible2 = true;
  }
  showModal3() {
    this.isVisible3 = true;
  }
  handelInsuranceCompanyCancel(){
    this.isInsuranceCompanyVisible=false;
  }
  showInsuranceCompanyModal(){
    this.isInsuranceCompanyVisible=true;
  }
  handelCustomerCancel(){
    this.isCustomerVisible=false;
  }
  showCustomerModal(){
    this.isCustomerVisible=true;
  }
  formatDate(res) {
    var date = new Date(`${res} UTC`);
    return date
  }
  startChange(event:any)
  {
    var date = this.formatDate(event.value);
    this.SalesForm.controls.salesInvoiceDate.setValue(date.toISOString());
   console.log("startChange",event.value)
  }
  OnSubmit(formDirective:FormGroupDirective){
    var data = this.SalesForm.value as SalesInvoice;
    if(this.salesId){
      data.id=this.salesId;
       data.saleLineItem[0].id=this.LineItemId;
       data.saleLineItem[0].saleId=this.salesId;

      this.updateSales(data,formDirective);
    }
    else{
      data.id=0;
      data.saleLineItem[0].id=0;
      data.saleLineItem[0].saleId=0;
      this.saveSales(data,formDirective);
    }

  }

  updateSales(data:SalesInvoice,formDirective:FormGroupDirective){
    this.service.UpdateSales(this.salesId,data).subscribe(res=>{
      if(res.isSuccessfull){
        formDirective.resetForm();
        this.SalesForm.reset();
        this.service.GetSales();
        this.alert.success("Sales updated successfully!")
        // this.sharedService.formSubmited.next('');



      }
      else{
        this.alert.error("Error while updating sales!")
      }
    });
  }
  saveSales(data:SalesInvoice,formDirective:FormGroupDirective){
    this.service.SaveSales(data).subscribe(res=>{
      if(res.isSuccessfull){
        formDirective.resetForm();
        this.SalesForm.reset();
        this.service.GetSales();
        this.alert.success("Sales saved successfully!")
        // this.sharedService.formSubmited.next('');

      }
      else{
        this.alert.error("Error while saving sales!")
      }
    });
  }
}
