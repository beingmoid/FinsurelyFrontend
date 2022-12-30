import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiTwoTone } from '@ant-design/icons-angular/icons';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { LoanDTO } from 'src/app/models/loanDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService extends GenericApiService {

  loanObserver$: Observable<LoanDTO[]>;
  private loanSubject$: BehaviorSubject<LoanDTO[]> = new BehaviorSubject<LoanDTO[]>(undefined);

  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.loanObserver$ = this.loanSubject$.asObservable();

  }
  GetLoan() {
    this.GetAll(API_URL + API_ENDPOINTS.Loan).subscribe(res => {
      if (res.isSuccessfull) {
        this.loanSubject$.next(res.dynamicResult as LoanDTO[]);
      }
    })
  }

  CreateLoan(data: LoanDTO) {
    return this.Post(data, API_URL + API_ENDPOINTS.Loan);
  }

  UpdateLoan(id: number, data: LoanDTO) {
    return this.Update(id, data, API_URL + API_ENDPOINTS.Loan);
  }

  DeleteLoan(id: number) {
    return this.Delete(id, API_URL + API_ENDPOINTS.Loan);
  }


}
