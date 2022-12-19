import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { Search } from 'src/app/models/search';
import { ExpensesService } from './expenses.service';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService<T> extends GenericApiService
{
    searchObserver$:Observable<T>;
    privateSearchSubject$:BehaviorSubject<T> = new  BehaviorSubject<T>(undefined);

  constructor(private http:HttpClient,

    private expenseService:ExpensesService
    ) {
    super(http);
    this.searchObserver$= this.privateSearchSubject$.asObservable();

   }

  Search( data:Search){
  //  var queryString=`?from=${search.from}&to=${search.to}&itemsPerPage=${search.itemsPerPage}`;

  //   if(search.branchId){
  //     queryString+=`&branchId=${search.branchId}`;
  //   }
  //   if(search.searchQuery){
  //     queryString+= `&searchQuery=${search.searchQuery}`;
  //   }
      return this.Post(data,API_URL+API_ENDPOINTS.Expenses+"/GetPaginatedWithSearch").subscribe(res=>{
      if(res.isSuccessfull){
            this.privateSearchSubject$.next( res.dynamicResult as T)
      }
    })
  }
}
