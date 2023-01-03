import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Branch } from 'src/app/models/branchDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends GenericApiService  {
  branchObserver$: Observable<Branch[]>;
  private branchSubject$: BehaviorSubject<Branch[]> = new BehaviorSubject<Branch[]>(undefined);
  constructor(private httpClient:HttpClient) {
    super(httpClient);
    this.branchObserver$ = this.branchSubject$.asObservable();
  }
  GetBranch(){
    this.GetAll(API_URL+API_ENDPOINTS.Branch).subscribe(res=>{
      if(res.isSuccessfull){
        this.branchSubject$.next(res.dynamicResult as Branch[])
      }
    })
  }
   CreateBranch(data:Branch){
   return this.Post(data,API_URL+API_ENDPOINTS.Branch);
  }
   UpdateBranch(id:number,data:Branch){
    return this.Update(id,data,API_URL+API_ENDPOINTS.Branch);
  }
   DeleteBranch(id:number){
    return this.Delete(id,API_URL+API_ENDPOINTS.Branch);
  }
  GetBranchWithSales(){
    this.GetAll(API_URL+API_ENDPOINTS.Branch+"/GetBranchWithSales").subscribe(res=>{
      if(res.isSuccessfull){
        this.branchSubject$.next(res.dynamicResult as Branch[])
      }
    })
  }
}
