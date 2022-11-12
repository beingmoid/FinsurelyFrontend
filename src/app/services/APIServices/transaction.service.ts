import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CaseTaskDTO } from 'src/app/models/caseTaskDTO';
import { CaseTransactionDTO } from 'src/app/models/caseTransactionDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})

export class TransactionService extends GenericApiService {

  caseTransactionsObserver$: Observable<CaseTransactionDTO[]>;
  private caseTransactionsSubject$: BehaviorSubject<CaseTransactionDTO[]> = new BehaviorSubject<CaseTransactionDTO[]>(undefined);


  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.caseTransactionsObserver$ = this.caseTransactionsSubject$.asObservable();
  }

 
}  
