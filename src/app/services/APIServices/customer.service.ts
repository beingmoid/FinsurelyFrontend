import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { PreferredPaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { CustomerDTO, UserDetailDTO } from 'src/app/models/userDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends GenericApiService {

  customerSelectListObserver$: Observable<UserDetailDTO[]>= new Observable<UserDetailDTO[]>();
  private customerSelectListSubject:BehaviorSubject<UserDetailDTO[]>= new BehaviorSubject<UserDetailDTO[]>(undefined);
  customerObserver$: Observable<UserDetailDTO[]>= new Observable<UserDetailDTO[]>();
  private customerSubject:BehaviorSubject<UserDetailDTO[]>= new BehaviorSubject<UserDetailDTO[]>(undefined);
  preferredPaymentMethodtObserver$: Observable<PreferredPaymentMethod[]>= new Observable<PreferredPaymentMethod[]>();
  private preferredPaymentMethodSubject:BehaviorSubject<PreferredPaymentMethod[]>= new BehaviorSubject<PreferredPaymentMethod[]>(undefined);
 termsObserver$: Observable<any[]>= new Observable<PreferredPaymentMethod[]>();
  private termsSubject:BehaviorSubject<any[]>= new BehaviorSubject<any[]>(undefined);

  constructor(private http: HttpClient) {
    super(http) 
    this.customerSelectListObserver$=this.customerSelectListSubject.asObservable();
    this.customerObserver$=this.customerSubject.asObservable();
    this.preferredPaymentMethodtObserver$=this.preferredPaymentMethodSubject.asObservable();
    this.termsObserver$= this.termsSubject.asObservable();
  }
  GetCustomers(){
    this.GetAll(API_URL+API_ENDPOINTS.Customer).subscribe(res=>{
      this.customerSelectListSubject.next(res.dynamicResult)
    });
  }
  GetAllCustomers(){
    this.GetAll(API_URL+API_ENDPOINTS.Customer).subscribe(res=>{
      this.customerSubject.next(res.dynamicResult)
    });
  }
  GetCustomerDetail(id:number){
   return this.GetAll(API_URL+API_ENDPOINTS.Customer+"/"+id);
  }
  GetPreferredPaymentMethod(){
    this.GetAll(API_URL+API_ENDPOINTS.PreferredPaymentMethod).subscribe(res=>{
      this.preferredPaymentMethodSubject.next(res.dynamicResult)
    });
  }
  GetTerms(){
    this.GetAll(API_URL+API_ENDPOINTS.Terms).subscribe(res=>{
      this.termsSubject.next(res.dynamicResult)
    });
  }
  SaveCustomer(data:UserDetailDTO){
    return this.Post(data,API_URL+API_ENDPOINTS.Customer);
  }
  async UpdateCustomer(id:number,data:UserDetailDTO){
   return await this.Update(id,data,API_URL+API_ENDPOINTS.Customer)
  }
  GetBranch(){
    return this.GetAll(API_URL+API_ENDPOINTS.Branch)
  }
}
