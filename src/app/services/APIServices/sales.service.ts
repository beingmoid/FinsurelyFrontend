import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { InsuranceType } from 'src/app/models/insuranceTypeDTO';
import { PaymentMethod, PreferredPaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { SalesInvoice, Vehicle } from 'src/app/models/TransactionsDTO';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService extends GenericApiService  {
  salesObserver$:Observable<any>;
  private salesSubject$:BehaviorSubject<any> =   new BehaviorSubject<any>(undefined);
  insuraceTypeObserver$:Observable<InsuranceType[]>;
  private insuraceTypeSubject$:BehaviorSubject<InsuranceType[]> =   new BehaviorSubject<InsuranceType[]>(undefined);
  vehicleObserver$:Observable<Vehicle[]>;
  private vehicleSubject$:BehaviorSubject<Vehicle[]> =   new BehaviorSubject<Vehicle[]>(undefined);
  paymentMethodObserver$:Observable<PaymentMethod[]>;
  private paymentMethodSubject$:BehaviorSubject<PaymentMethod[]> =   new BehaviorSubject<PaymentMethod[]>(undefined);
  rowCountSubject:number=0;
  constructor(private http: HttpClient) {
    super(http)
    this.salesObserver$=this.salesSubject$.asObservable();
    this.insuraceTypeObserver$=this.insuraceTypeSubject$.asObservable();
    this.vehicleObserver$=this.vehicleSubject$.asObservable();
    this.paymentMethodObserver$=this.paymentMethodSubject$.asObservable();
  }
   GetSales(){
     this.GetAll(API_URL+API_ENDPOINTS.SalesInvoice).subscribe(res=>{
      if(res.dynamicResult){
      this.salesSubject$.next(res.dynamicResult)
      }
    });
  }
  GetPaginated(page,pageSize){
      this.GetAll(API_URL+API_ENDPOINTS.SalesInvoice+'/GetPaginated'+"?page="+page+"&pageSize="+pageSize).subscribe(res=>{
        if(res.isSuccessfull){
          this.salesSubject$.next(res.dynamicResult);

        }
      })
  }
  GetInsuranceTypes(){
    this.GetAll(API_URL+API_ENDPOINTS.InsuranceType).subscribe(res=>{
      if(res.dynamicResult){
      this.insuraceTypeSubject$.next(res.dynamicResult);
      }
    })
  }
  GetVehicles(){
    this.GetAll(API_URL+API_ENDPOINTS.Vehicle).subscribe(res=>{
      if(res.dynamicResult){
      this.vehicleSubject$.next(res.dynamicResult);
      }
    })
  }
  GetComissionRates(id:number,isTpl:boolean):Observable<BaseResponse>{
   return this.GetAll(API_URL+API_ENDPOINTS.InsuranceCompany+`/GetComissionRates?id=${id}&isTpl=${isTpl}`);
  }
  CreateVehicle(data:Vehicle){
    return this.Post(data,API_URL+API_ENDPOINTS.Vehicle);
  }
  UpdateSales(id:number,data:SalesInvoice){
  return  this.Update(id,data,API_URL+API_ENDPOINTS.SalesInvoice);
 }
GetPaymentMethod(){
  this.GetAll(API_URL+API_ENDPOINTS.PaymentMethod).subscribe(res=>{
  if(res.dynamicResult){
    this.paymentMethodSubject$.next(res.dynamicResult as PaymentMethod[]);
  }
 });
}
BulkUpload(form:FormData){

  return this.Post(API_URL+API_ENDPOINTS.SalesInvoice+"/BulkUpload");
}
DeleteSales(id:number){
  return  this.Delete(id,API_URL+API_ENDPOINTS.SalesInvoice);
}

   SaveSales(data:SalesInvoice):Observable<BaseResponse>{
     return this.Post(data,API_URL+API_ENDPOINTS.SalesInvoice);
  }

  GetColumnHeaders(path:string){
    return this.GetAll(API_URL+API_ENDPOINTS.SalesInvoice+`/GetColumnHeader?fileUrl=${path}`)
  }
}
