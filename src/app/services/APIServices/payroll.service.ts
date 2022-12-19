import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { payroll } from 'src/app/models/payrollDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class PayrollService extends GenericApiService {
PayrollObserver$ : Observable<payroll[]>;
PayrollSubject$: BehaviorSubject<payroll[]> =new BehaviorSubject<payroll[]>(undefined);
  id: number;

  constructor(private http: HttpClient) {
    super(http);
    this.PayrollObserver$= this.PayrollSubject$.asObservable();

  }

GetPayroll(){
  this.GetAll( API_URL + API_ENDPOINTS.Payroll).subscribe(res=>{
    this.PayrollSubject$.next(res.dynamicResult);
  })
}

SavePayroll(data){
 return this.Post(data, API_URL + API_ENDPOINTS.Payroll)
}

UpdatePayroll(id, data){
return this.Update(id, data, API_URL + API_ENDPOINTS.Payroll)
}

DeletePayroll(id): Observable<BaseResponse>{
return this.Delete(id, API_URL + API_ENDPOINTS.Payroll)
}

}
