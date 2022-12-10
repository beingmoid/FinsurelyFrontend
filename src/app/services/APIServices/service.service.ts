import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Service } from 'src/app/models/bodyType';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService extends GenericApiService {

 ServiceObserver$: Observable<Service[]>;
   ServiceSubject$: BehaviorSubject<Service[]> = new BehaviorSubject<Service[]>(undefined);

  public get Services() { return this.ServiceSubject$.value; }
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.ServiceObserver$ = this.ServiceSubject$.asObservable()
  }

  SaveService(data) {
    return this.Post(data, API_URL + API_ENDPOINTS.Service);
  }

  UpdateService(id, data: Service) {
    return this.Update(id.toString(), data, API_URL + API_ENDPOINTS.Service);
  }

  GetService() {
    this.GetAll(API_URL + API_ENDPOINTS.Service ).subscribe(res => {
      this.ServiceSubject$.next(res.dynamicResult);
    });
  }
  GetServiceByPolicyId(id:number) {
    this.Get(id,API_URL + API_ENDPOINTS.Service+"/ServiceByPolicy" ).subscribe(res => {
      this.ServiceSubject$.next(res.dynamicResult);
    });
  }

  DeleteService(id): Observable<BaseResponse> {
    return this.Delete(id, API_URL + API_ENDPOINTS.Service);
  }
}  
