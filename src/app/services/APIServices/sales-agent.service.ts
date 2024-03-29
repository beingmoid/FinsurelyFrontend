import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { PaginatedData, PaginationParams } from 'src/app/models/paginatedResponse';
import { PreferredPaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { StatementColumns } from 'src/app/models/StatementColumns';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { SearchAndFilter } from 'src/app/pages/sales-agent/sales-agent-detail/sales-agent-detail.component';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class SalesAgentService extends GenericApiService {


  salesAgentSelectListObserver$: Observable<UserDetailDTO[]> = new Observable<UserDetailDTO[]>();
  private salesAgentSelectListSubject: BehaviorSubject<UserDetailDTO[]> = new BehaviorSubject<UserDetailDTO[]>(undefined);

  salesAgentObserver$: Observable<PaginatedData<any>> = new Observable<PaginatedData<any>>();
  private salesAgentSubject: BehaviorSubject<PaginatedData<any>> = new BehaviorSubject<PaginatedData<any>>(undefined);

  preferredPaymentMethodtObserver$: Observable<PreferredPaymentMethod[]> = new Observable<PreferredPaymentMethod[]>();
  private preferredPaymentMethodSubject: BehaviorSubject<PreferredPaymentMethod[]> = new BehaviorSubject<PreferredPaymentMethod[]>(undefined);
  termsObserver$: Observable<any[]> = new Observable<PreferredPaymentMethod[]>();
  private termsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(undefined);
  salesInvoiceObserver$: Observable<any[]> = new Observable<PreferredPaymentMethod[]>();
  private salesInvoiceSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(undefined);

  salesAgentStatementObserver$: Observable<PaginatedData<any>> = new Observable<PaginatedData<any>>();
  private salesAgentStatementSubject: BehaviorSubject<PaginatedData<any>> = new BehaviorSubject<PaginatedData<any>>(undefined);



  constructor(private http: HttpClient) {
    super(http)
    this.salesAgentSelectListObserver$ = this.salesAgentSelectListSubject.asObservable();
    this.salesAgentObserver$ = this.salesAgentSubject.asObservable();
    this.preferredPaymentMethodtObserver$ = this.preferredPaymentMethodSubject.asObservable();
    this.termsObserver$ = this.termsSubject.asObservable();
    this.salesInvoiceObserver$ = this.salesInvoiceSubject.asObservable();
    this.salesAgentStatementObserver$ = this.salesAgentStatementSubject.asObservable();
  }
  //List of sales agents displayed on Sales Agent Listing
  async GetSalesAgents() {
    await this.GetAll(API_URL + API_ENDPOINTS.SalesAgent).subscribe(res => {
      if (res.dynamicResult) {
        this.salesAgentSelectListSubject.next(res.dynamicResult)
      }

    });
  }

  //Update call for salesAgent used in SalesAgent Detail Page
  async updateSalesAgent(id: number, data: UserDetailDTO) {
    return await this.Update(id, data, API_URL + API_ENDPOINTS.SalesAgent);
  }
  async GetAllSalesAgents() {
    await this.GetAll(API_URL + API_ENDPOINTS.SalesAgent).subscribe(res => {
      if (res.dynamicResult) {
        this.salesAgentSubject.next(res.dynamicResult)
      }
    });
  }
  GetSaleAgentDetail(id: number) {
    return this.GetAll(API_URL + API_ENDPOINTS.SalesAgent + "/GetOne?id=" + id);
  }
  async GetPreferredPaymentMethod() {
    await this.GetAll(API_URL + API_ENDPOINTS.PreferredPaymentMethod).subscribe(res => {
      if (res.dynamicResult) {
        this.preferredPaymentMethodSubject.next(res.dynamicResult)
      }
    });
  }
  async GetTerms() {
    await this.GetAll(API_URL + API_ENDPOINTS.Terms).subscribe(res => {
      if (res.dynamicResult) {
        this.termsSubject.next(res.dynamicResult)
      }
    });
  }
  SaveSalesAgent(data: UserDetailDTO): Observable<BaseResponse> {
    return this.Post(data, API_URL + API_ENDPOINTS.SalesAgent);
  }
  async GetReceviableStatementReport(AccountId: number) {
    return await this.GetAll(API_URL + API_ENDPOINTS.LedgerEntries + `/GetReceviableStatementReport?accountId=${AccountId}`)
  }
  GetCurrentBalance(AgentId: number) {
    return this.GetAll(API_URL + API_ENDPOINTS.SalesAgent + `/GetCurrentAccountStatement?agentId=${AgentId}`);
  }
  Process(data) {
    return this.Post(data, API_URL + API_ENDPOINTS.Reconcile + "/Process");
  }
  SearchAndFilter(data: SearchAndFilter) {
    return this.Post(data, API_URL + API_ENDPOINTS.SalesAgent + `/SearchAndFilter?accountId=${data.AccountId}&start=${data.start}&end=${data.end}&sortBy=${data.sortBy}`)
  }
  StatementConfig() {
    return this.GetAll(API_URL + API_ENDPOINTS.Auth + `/StatementConfig`);
  }
  SaveSelection(data: StatementColumns) {
    return this.Post(data, API_URL + API_ENDPOINTS.Auth + '/UpdateStatementConfig');
  }
  GetSalesAgentStatement(agentId, pageNo, pageSize) {
    return this.GetAll(API_URL + API_ENDPOINTS.SalesAgent + `/statement?Id=${agentId}&page=${pageNo}&itemsPerPage=${pageSize}`);
  }
  GetBalance(id) {
    return this.GetAll(API_URL + API_ENDPOINTS.SalesAgent + "/GetBalance?id=" + id);
  }

  SearchWithPagination(params: PaginationParams<number>) {
    return this.Post(params, API_URL + API_ENDPOINTS.SalesAgent + `/GetAgentPaginated`).subscribe(res => {
      this.salesAgentStatementSubject.next((res.dynamicResult as PaginatedData<any>));
    })
  }

  GetAgentwithBalancePaginatedAsync(pageNo:number,pageSize: number,searchQuery?:string) {
    if(searchQuery){
      return this.GetAll(API_URL + API_ENDPOINTS.SalesAgent + `/GetAgentwithBalancePaginatedAsync?page=${pageNo}&itemsPerPage=${pageSize}&searchQuery=${searchQuery}`).subscribe(res => {
        this.salesAgentSubject.next((res.dynamicResult as PaginatedData<any>));
      })
    }
    else{
      return this.GetAll(API_URL + API_ENDPOINTS.SalesAgent + `/GetAgentwithBalancePaginatedAsync?page=${pageNo}&itemsPerPage=${pageSize}`).subscribe(res => {
        this.salesAgentSubject.next((res.dynamicResult as PaginatedData<any>));
      })
    }


  }



}
