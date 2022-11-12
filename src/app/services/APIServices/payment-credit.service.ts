import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { Payment } from 'src/app/models/refundDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentCreditService extends GenericApiService  {

  paymentObserver$:Observable<Payment[]>;
  private paymentSubject$:BehaviorSubject<Payment[]> =   new BehaviorSubject<Payment[]>(undefined);
  constructor(private http: HttpClient) {
    super(http)  
    this.paymentObserver$=this.paymentSubject$.asObservable();
  }
  
    GetPayments(){
      this.GetAll(API_URL+API_ENDPOINTS.PaymentCredit).subscribe(res=>{
        if(res.isSuccessfull){
          this.paymentSubject$.next(res.dynamicResult as Payment[]);
        }
      })
    }
    UpdatePayment(id:number,data:Payment){
     return this.Update(id,data,API_URL+API_ENDPOINTS.PaymentCredit);
    }
    CreatePayment(data:Payment){
      return this.Post(data,API_URL+API_ENDPOINTS.PaymentCredit);
    }
    GetAssetAccounts(){
      return this.GetAll(API_URL+API_ENDPOINTS.Accounts+"/GetAssetAccounts");
    }
}
