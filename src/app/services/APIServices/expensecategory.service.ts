import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseCategory } from 'src/app/models/ExpenseCategoryDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensecategoryService extends GenericApiService{
 ExpenseCategoryObserver$: Observable<ExpenseCategory[]>;
 ExpenseCategorySubject$: BehaviorSubject<ExpenseCategory[]> = new BehaviorSubject<ExpenseCategory[]>(undefined);

  constructor(private http:HttpClient) {
    super(http)
 this.ExpenseCategoryObserver$ = this.ExpenseCategorySubject$.asObservable()

  }

GetExpenseCategory(){
  this.GetAll(API_URL + API_ENDPOINTS.ExpenseCategory).subscribe(res=>{
    this.ExpenseCategorySubject$.next(res.dynamicResult);
  });
}

SaveExpenseCategory(data){
  return this.Post(data, API_URL + API_ENDPOINTS.ExpenseCategory)
}

UpdateExpenseCategory(id, data){
  return this.Update(id, data, API_URL + API_ENDPOINTS.ExpenseCategory)
}

DeleteExpenseCategory(id): Observable<BaseResponse>{
return this.Delete(id, API_URL + API_ENDPOINTS.ExpenseCategory)
}


}
