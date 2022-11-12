import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { Payment } from 'src/app/models/refundDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends GenericApiService {

  paymentObserver$:Observable<Payment[]>;
  private paymentSubject$:BehaviorSubject<Payment[]> =   new BehaviorSubject<Payment[]>(undefined);
  constructor(private http: HttpClient) {
    super(http)  
    this.paymentObserver$=this.paymentSubject$.asObservable();
  }
  
    GetPayments(){
      this.GetAll(API_URL+API_ENDPOINTS.Payment).subscribe(res=>{
        if(res.isSuccessfull){
          this.paymentSubject$.next(res.dynamicResult as Payment[]);
        }
      })
    }
    DeletePayment(id:number){
      return this.Delete(id,API_URL+API_ENDPOINTS.DPayment)
    }
    UpdatePayment(id:number,data:Payment){
     return this.Update(id,data,API_URL+API_ENDPOINTS.UPayment);
    }
    CreatePayment(data:Payment){
      return this.Post(data,API_URL+API_ENDPOINTS.RPayment);
    }
    SendPayment(data:Payment){
      return this.Post(data,API_URL+API_ENDPOINTS.CSentPayment);
    }
    DeleteSentPayment(id:number){
      return this.Delete(id,API_URL+API_ENDPOINTS.DSentPayment)
    }
    UpdateSentPayment(id:number,data:Payment){
     return this.Update(id,data,API_URL+API_ENDPOINTS.USentPayment);
    }
    
    GetAssetAccounts(){
      return this.GetAll(API_URL+API_ENDPOINTS.Accounts);
    }
    GetRecevingPayments(from?:string, to?:string ){
      if(from && to){
        return this.GetAll(API_URL+API_ENDPOINTS.ReceivePayment+"from?="+from+"&to="+to)
      }
      return this.GetAll(API_URL+API_ENDPOINTS.ReceivePayment)
    }
    GetSentPayments(from?:string, to?:string ){

      if(from && to){
        return this.GetAll(API_URL+API_ENDPOINTS.SentPayment+"from?="+from+"&to="+to)
      }
      return this.GetAll(API_URL+API_ENDPOINTS.SentPayment)
    }
}
