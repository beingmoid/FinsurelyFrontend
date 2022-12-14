import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { Receipts } from 'src/app/models/receiptsDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService extends GenericApiService {
ReceiptsObserver$: Observable<Receipts[]>;
ReceiptsSubject$: BehaviorSubject<Receipts[]> = new BehaviorSubject<Receipts[]>(undefined);

  constructor(private http:HttpClient) {
    super(http);

   }

GetReceipts(){
  this.GetAll(API_URL +API_ENDPOINTS.Receipts).subscribe(res=>{
    this.ReceiptsSubject$.next(res.dynamicResult);
  })
}

SaveReceipts(data){
return this.Post(data, API_URL + API_ENDPOINTS.Receipts)
}

UpdateReceipts(id, data){
return this.Update(id, data, API_URL + API_ENDPOINTS.Receipts)
}

DeleteReceipts(id): Observable<BaseResponse>{
  return this.Delete(id, API_URL + API_ENDPOINTS.Receipts)
}

}
