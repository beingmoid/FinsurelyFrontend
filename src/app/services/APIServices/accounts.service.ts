import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AccountDetailTypeDTO, AccountDTO, AccountTypeDTO } from 'src/app/models/accountDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService extends GenericApiService {
  accountObserver$: Observable<any>;
    private accountSubject$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
    accountDetailObserver$: Observable<AccountDetailTypeDTO[]>;
    private accountDetailSubject$: BehaviorSubject<AccountDetailTypeDTO[]> = new BehaviorSubject<AccountDetailTypeDTO[]>(undefined);
    accountTypeObserver$: Observable<AccountTypeDTO[]>;
    private accountTypeSubject$: BehaviorSubject<AccountTypeDTO[]> = new BehaviorSubject<AccountTypeDTO[]>(undefined);
  constructor(private http: HttpClient) {
    super(http);
    this.accountObserver$ = this.accountSubject$.asObservable();
    this.accountDetailObserver$=this.accountDetailSubject$.asObservable();
    this.accountTypeObserver$=this.accountTypeSubject$.asObservable();
  }

  GetAccounts(){
    return this.GetAll(API_URL+API_ENDPOINTS.Accounts).pipe(
      shareReplay(1)
    ).subscribe(res=>{
      if(res.isSuccessfull){
        this.accountSubject$.next(res.dynamicResult);
      }
    });
  }
  GetAccountsPaginated(page,pageSize){
    return this.GetAll(API_URL+API_ENDPOINTS.Accounts+`/GetPaginated?page=${page}&pageSize=${pageSize}`)
    .pipe(
      shareReplay(1)
    ).subscribe(res=>{
      if(res.isSuccessfull){
        this.accountSubject$.next(res.dynamicResult);
      }
    });
  }
  AccountStatement(id:number){
    return this.Get(id,API_URL+API_ENDPOINTS.Accounts+`/AccountStatement`);

  }
  JournalLedger(){
    return this.GetAll(API_URL+API_ENDPOINTS.Accounts+`/JournalLedger`);

  }
  GetAccountTypeDetails(id:number){
    return this.GetAll(API_URL+'api/AccountDetailType'+`/FilterList?accountTypeId=${id}`)
    .pipe(
      shareReplay(1)
    )
    .subscribe(res=>{
      if(res.isSuccessfull){
        this.accountDetailSubject$.next(res.dynamicResult);
      }
    });
  }
  GetAccountTypes(){
    return this.GetAll(API_URL+'api/AccountType')
    .pipe(
      shareReplay(1)
    )
    .subscribe(res=>{
      if(res.isSuccessfull){
        console.log('success in service');
        this.accountTypeSubject$.next(res.dynamicResult);
      }
    });
  }
  UpdateAccount(id:number,data:AccountDTO){
    return this.Update(id,data,API_URL+API_ENDPOINTS.Accounts);
  }
  SaveAccount(data:AccountDTO){
    return this.Post(data,API_URL+API_ENDPOINTS.Accounts);
  }
  DeleteAccount(id:number){
    return this.Delete(id,API_URL+API_ENDPOINTS.Accounts);
  }
}
