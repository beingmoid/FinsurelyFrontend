import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { Refund } from 'src/app/models/refundDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class RefundServiceService extends GenericApiService {

  refundObserver$:Observable<Refund[]>;
  private refundSubject$:BehaviorSubject<Refund[]> =   new BehaviorSubject<Refund[]>(undefined);
  constructor(private http: HttpClient) {
    super(http)  
    this.refundObserver$=this.refundSubject$.asObservable();
  }
  
    GetRefunds(){
      this.GetAll(API_URL+API_ENDPOINTS.Refund).subscribe(res=>{
        if(res.isSuccessfull){
          this.refundSubject$.next(res.dynamicResult as Refund[]);
        }
      })
    }
    UpdateRefund(id:number,data:Refund){
     return this.Update(id,data,API_URL+API_ENDPOINTS.Refund);
    }
    CreateRefund(data:Refund){
      return this.Post(data,API_URL+API_ENDPOINTS.Refund);
    }
}
