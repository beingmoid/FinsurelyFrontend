import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PolicyType } from 'src/app/models/bodyType';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyTypeService extends GenericApiService {

 PolicyTypeObserver$: Observable<PolicyType[]>;
  private PolicyTypeSubject$: BehaviorSubject<PolicyType[]> = new BehaviorSubject<PolicyType[]>(undefined);

  public get PolicyTypes() { return this.PolicyTypeSubject$.value; }
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.PolicyTypeObserver$ = this.PolicyTypeSubject$.asObservable()
  }

  SavePolicyType(data) {
    return this.Post(data, API_URL + API_ENDPOINTS.PolicyType);
  }

  UpdatePolicyType(data: PolicyType) {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.PolicyType);
  }

  GetPolicyType() {
    this.GetAll(API_URL + API_ENDPOINTS.PolicyType ).subscribe(res => {
      this.PolicyTypeSubject$.next(res.dynamicResult);
    });
  }

  DeletePolicyType(id): Observable<BaseResponse> {
    return this.Delete(id, API_URL + API_ENDPOINTS.PolicyType);
  }
}  
