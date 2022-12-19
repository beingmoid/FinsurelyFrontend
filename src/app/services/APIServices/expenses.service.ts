import { N } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expenses } from 'src/app/models/expensesDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { PaginatedData } from 'src/app/models/paginatedResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService extends GenericApiService {
ExpensesObserver$: Observable<PaginatedData<Expenses>>;
ExpensesSubject$: BehaviorSubject<PaginatedData<Expenses>> = new BehaviorSubject<PaginatedData<Expenses>>(undefined);
expensePagesCount=0;
  constructor(private http:HttpClient) {
    super(http);
    this.ExpensesObserver$ = this.ExpensesSubject$.asObservable();
  }

GetExpenses(){
  this.GetAll(API_URL + API_ENDPOINTS.Expenses).subscribe(res=>{
    this.ExpensesSubject$.next(res.dynamicResult);
  })
}
GetPaginatedExpense(pageNo,pageSize){
  this.GetAll(API_URL + API_ENDPOINTS.Expenses+`/GetPaginated?page=${pageNo}&itemsPerPage=${pageSize}`).subscribe(res=>{
    this.ExpensesSubject$.next((res.dynamicResult as PaginatedData<Expenses>));

  })
}

SaveExpenses(data){
 return this.Post(data, API_URL + API_ENDPOINTS.Expenses)
}

UpdateExpenses(id, data){
return this.Update(id, data, API_URL + API_ENDPOINTS.Expenses)
}

DeleteExpenses(id): Observable<BaseResponse>{
return this.Delete(id, API_URL + API_ENDPOINTS.Expenses)
}

}
