import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BodyType } from 'src/app/models/bodyType';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class BodytypeService extends GenericApiService {

 bodyTypeObserver$: Observable<BodyType[]>;
  private bodyTypeSubject$: BehaviorSubject<BodyType[]> = new BehaviorSubject<BodyType[]>(undefined);

  public get bodyTypes() { return this.bodyTypeSubject$.value; }
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.bodyTypeObserver$ = this.bodyTypeSubject$.asObservable()
  }

  SaveBodyType(data) {
    return this.Post(data, API_URL + API_ENDPOINTS.BodyType);
  }

  UpdateBodyType(data: BodyType) {
    return this.Update(data.id, data, API_URL + API_ENDPOINTS.BodyType);
  }

  GetBodyType() {
    this.GetAll(API_URL + API_ENDPOINTS.BodyType ).subscribe(res => {
      this.bodyTypeSubject$.next(res.dynamicResult);
    });
  }

  DeleteBodyType(id): Observable<BaseResponse> {
    return this.Delete(id, API_URL + API_ENDPOINTS.BodyType);
  }
}  
