import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { PreferredPaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import {  UserDetailDTO } from 'src/app/models/userDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends GenericApiService {

  salesAgentSelectListObserver$: Observable<UserDetailDTO[]>= new Observable<UserDetailDTO[]>();
  private salesAgentSelectListSubject:BehaviorSubject<UserDetailDTO[]>= new BehaviorSubject<UserDetailDTO[]>(undefined);
  salesAgentObserver$: Observable<UserDetailDTO[]>= new Observable<UserDetailDTO[]>();
  private salesAgentSubject:BehaviorSubject<UserDetailDTO[]>= new BehaviorSubject<UserDetailDTO[]>(undefined);
  preferredPaymentMethodtObserver$: Observable<PreferredPaymentMethod[]>= new Observable<PreferredPaymentMethod[]>();
  private preferredPaymentMethodSubject:BehaviorSubject<PreferredPaymentMethod[]>= new BehaviorSubject<PreferredPaymentMethod[]>(undefined);
 termsObserver$: Observable<any[]>= new Observable<PreferredPaymentMethod[]>();
  private termsSubject:BehaviorSubject<any[]>= new BehaviorSubject<any[]>(undefined);
 salesInvoiceObserver$: Observable<any[]>= new Observable<PreferredPaymentMethod[]>();
  private  salesInvoiceSubject:BehaviorSubject<any[]>= new BehaviorSubject<any[]>(undefined);


  constructor(private http: HttpClient) {
    super(http) 
    this.salesAgentSelectListObserver$=this.salesAgentSelectListSubject.asObservable();
    this.salesAgentObserver$=this.salesAgentSubject.asObservable();
    this.preferredPaymentMethodtObserver$=this.preferredPaymentMethodSubject.asObservable();
    this.termsObserver$= this.termsSubject.asObservable();
    this.salesInvoiceObserver$=this.salesInvoiceSubject.asObservable();
  }
  async GetSalesAgents(){
    await this.GetAll(API_URL+API_ENDPOINTS.Supplier).subscribe(res=>{
      this.salesAgentSelectListSubject.next(res.dynamicResult)
    });
  }
 async updateSalesAgent(id:number,data:UserDetailDTO){
  return await this.Update(id,data,API_URL+API_ENDPOINTS.Supplier);
 }
  async  GetAllSalesAgents(){
    await  this.GetAll(API_URL+API_ENDPOINTS.Supplier).subscribe(res=>{
      this.salesAgentSubject.next(res.dynamicResult)
    });
  }
  GetSaleAgentDetail(id:number){
    return this.GetAll(API_URL+API_ENDPOINTS.Supplier+"/"+id);
   }
  async GetPreferredPaymentMethod(){
    await this.GetAll(API_URL+API_ENDPOINTS.PreferredPaymentMethod).subscribe(res=>{
      this.preferredPaymentMethodSubject.next(res.dynamicResult)
    });
  }
  async GetTerms(){
    await this.GetAll(API_URL+API_ENDPOINTS.Terms).subscribe(res=>{
      this.termsSubject.next(res.dynamicResult)
    });
  }
   SaveSalesAgent(data:UserDetailDTO):Observable<BaseResponse>{
     return this.Post(data,API_URL+API_ENDPOINTS.Supplier);
  }


}
