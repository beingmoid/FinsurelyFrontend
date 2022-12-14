import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, merge, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BodyType, PolicyType, Service } from 'src/app/models/bodyType';
import { Branch } from 'src/app/models/branchDTO';
import { InsuranceType } from 'src/app/models/insuranceTypeDTO';
import { PaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { Vehicle } from 'src/app/models/TransactionsDTO';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { BodytypeService } from 'src/app/services/APIServices/bodytype.service';
import { BranchService } from 'src/app/services/APIServices/branch.service';
import { InsuranceCompanyService } from 'src/app/services/APIServices/insurance-company.service';
import { PolicyTypeService } from 'src/app/services/APIServices/policytype.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SalesService } from 'src/app/services/APIServices/sales.service';
import { ServiceService } from 'src/app/services/APIServices/service.service';

@Component({
  selector: 'app-bulk-sales',
  templateUrl: './bulk-sales.component.html',
  styleUrls: ['./bulk-sales.component.scss']
})
export class BulkSalesComponent implements OnInit {


  //#region FilterTypes Observers
  filteredInsuranceCompanies:Observable<UserDetailDTO[]>;
  insuranceCompanies:UserDetailDTO[];
  filterPolicyType:Observable<PolicyType[]>;
  filteredBodyType:Observable<BodyType[]>;
  filterService:Observable<Service[]>;
  filterSalesAgent:Observable<UserDetailDTO[]>;
  filterVehicle:Observable<Vehicle[]>;
  filterBranch:Observable<Branch[]>;
  //endRegions

  isVisible=false;
  isVisible2=false;
  isVisible3=false;

  showModal(){
    this.isVisible=true;
  }
  showModal2(){
    this.isVisible2=true;
  }
  showModal3(){
    this.isVisible3=true;
  }
  handleCancel(){
    this.isVisible=false;
  }
  handleCancel2(){
    this.isVisible2=false;
  }
  handleCancel3(){
    this.isVisible3=false;
  }


  insuranceTypeSelect:InsuranceType[]=[];

  salesAgents:UserDetailDTO[] ;

  formGroups:FormGroup[]=[] ;
  vehicle: Vehicle[];
  paymentMethod: PaymentMethod[];
  branch: Branch[];
  BodyType: BodyType[];
  PolicyType: PolicyType[];
  Service:Service[];
  constructor(private fb:FormBuilder,
    private service:SalesService,
    private BranchService:BranchService,
    private PolicyTypeService:PolicyTypeService,
    private ServiceService:ServiceService,
    private BodyTypeService:BodytypeService,
    private SalesAgentService:SalesAgentService,
    private insuranceService:InsuranceCompanyService,) {

    // this.formGroup=



   }


  ngOnInit(): void {
    this.formGroups.push(this.formGroup);


    this.formGroups.forEach((value,index)=>{


    //#region Filtered Observable Functions
      this.filteredInsuranceCompanies= value.controls.insuranceCompanyId.valueChanges.pipe(

        startWith(''),
          map(value => typeof value === 'string' ? value : value),
        map(address => address ? this._filterInsuranceCompany(address) : this.insuranceCompanies?.slice())

      );

      this.filterPolicyType= value.controls.policyTypeId.valueChanges.pipe(

        startWith(''),
          map(value => typeof value === 'string' ? value : value),
        map(address => address ? this._filterPolicyType(address) : this.PolicyType?.slice())

      );
      this.filteredBodyType= value.controls.bodyTypeId.valueChanges.pipe(

        startWith(''),
          map(value => typeof value === 'string' ? value : value),
        map(address => address ? this._filterBodyType(address) : this.BodyType?.slice())

      );
      this.filterService= value.controls.serviceId.valueChanges.pipe(

        startWith(''),
          map(value => typeof value === 'string' ? value : value),
        map(address => address ? this._filterService(address) : this.Service?.slice())

      );
      this.filterPolicyType= value.controls.insuranceCompanyId.valueChanges.pipe(

        startWith(''),
          map(value => typeof value === 'string' ? value : value),
        map(address => address ? this._filterBodyType(address) : this.BodyType?.slice())

      );
      this.filterSalesAgent= value.controls.salesInvoicePersonId.valueChanges.pipe(

        startWith(''),
          map(value => typeof value === 'string' ? value : value),
        map(address => address ? this._filterSalesAgent(address) : this.salesAgents?.slice())

      );
        this.filterVehicle=((this.saleLineItem(value).controls['vehilcleId']) as FormControl).valueChanges.pipe(

          startWith(''),
          map(value => typeof value === 'string' ? value : value),
          map(address => address ? this._filterVehicle(address) : this.vehicle?.slice())
        );

        this.filterBranch=value.controls.branchId.valueChanges.pipe(

          startWith(''),
          map(value => typeof value === 'string' ? value : value),
          map(make => make ? this._filterBranch(make) : this.branch?.slice())
        );
        let valueItem=(this.saleLineItem(value) as FormGroup);

       let grossObservable$= valueItem.controls.gross.valueChanges;
        let commissionObservable$=valueItem.controls.commission.valueChanges;

      merge([grossObservable$,commissionObservable$]).subscribe(results=>{

        console.log(results);
        console.log((this.saleLineItem(value).controls.commission.value),this.saleLineItem(value).controls.gross.value)








      });

        (this.saleLineItem(value).controls.commission as FormControl).valueChanges.subscribe(res=>{


          console.log(res);
          let commission=  parseFloat((this.saleLineItem(value).controls.commission.value))/100;
          console.log(commission);
          let premiumPrice = parseFloat(this.saleLineItem(value).controls.gross.value);
          if(premiumPrice>0){
            let PriceWithoutvat = premiumPrice/1.05;
            console.log('Price without VAT',PriceWithoutvat)

            let commisionRate = PriceWithoutvat*commission;
            // let VAT = (commisionRate*0.05); Ahmed Calculation
            let VAT = premiumPrice-PriceWithoutvat;
            this.saleLineItem(value).controls.vat.setValue(VAT.toFixed(2));
            console.log('VAT',VAT)
            this.saleLineItem(value).controls.commissionRate.setValue(commisionRate.toFixed(2));
            console.log('COMMISSION RATE',commisionRate.toFixed(2));
            let NET =((PriceWithoutvat-commisionRate)+VAT).toFixed(2);
            console.log('NET',NET);

            this.saleLineItem(value).controls.net.setValue(NET);

            this.saleLineItem(value).controls.total.setValue(PriceWithoutvat.toFixed(2));
          }
        });
        // end of call back




    });



      //#endregion


      //#region API Calls
      this.SalesAgentService.salesAgentSelectListObserver$.subscribe(res=>{
        this.salesAgents=res;
      });
      this.SalesAgentService.GetSalesAgents();
    this.insuranceService.salesAgentSelectListObserver$.subscribe(res=>{
      this.insuranceCompanies=res;
      console.log(this.insuranceCompanies);
    });
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
  this.BranchService.GetBranch();
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
  this.ServiceService.GetService();


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
  }

  // InsuranceCompanyAutoComplete(id){

  // }

  AddFormGroup(){
    this.formGroups.push(this.formGroup);

    console.log(this.formGroups);

  }

   saleLineItem(form):any{

    let item = form.controls['saleLineItem'] as FormArray;
    return item.controls[0] as FormGroup   ;
  }

  get formGroup():FormGroup {
    return  this.fb.group({
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
  }

//#region Display Name Functions for Autocomplete
  displayCompanyFn(id) {

    if(this.insuranceCompanies && id){
      return this.insuranceCompanies.find(x=>x.id===id).displayNameAs
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
  //#endregion

  private _filterInsuranceCompany(value: string) {
    if(value)
      return this.insuranceCompanies? this.insuranceCompanies?.filter(option => option.displayNameAs?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
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


}
