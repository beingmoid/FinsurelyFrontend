import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThunderboltFill } from '@ant-design/icons-angular/icons';
import { BehaviorSubject, Observable } from 'rxjs';
import { CaseTaskDTO } from 'src/app/models/caseTaskDTO';
import { BankDetails, BenefitsAndDeduction, CompensationDTO, VacationPolicy } from 'src/app/models/employeeDetailDto';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { PreferredPaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { CustomerDTO, UserDetailDTO } from 'src/app/models/userDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends GenericApiService {

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
    this.GetAll(API_URL+API_ENDPOINTS.Employee).subscribe(res=>{
      this.customerSelectListSubject.next(res.dynamicResult)
    });
  }
  GetAllCustomers(){
    this.GetAll(API_URL+API_ENDPOINTS.Employee).subscribe(res=>{
      this.customerSubject.next(res.dynamicResult)
    });
  }
  GetManagers(){
    return this.GetAll(API_URL+API_ENDPOINTS.GetManagers);
  }
  GetCustomerDetail(id:number){
   return this.GetAll(API_URL+API_ENDPOINTS.Employee+"/"+id);
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
    return this.Post(data,API_URL+API_ENDPOINTS.Employee);
  }
  async UpdateCustomer(id:number,data:UserDetailDTO){
   return await this.Update(id,data,API_URL+API_ENDPOINTS.Employee)
  }
  UploadImage(data){
    return this.Post(data,API_URL+API_ENDPOINTS.UploadFile)
  }
  getStatues(){
    return this.GetAll(API_URL+API_ENDPOINTS.Status)
  }
  getPriorities (){
    return this.GetAll(API_URL+API_ENDPOINTS.Priority)
  }
  getCompensation(id:number){
    return this.GetAll(API_URL+API_ENDPOINTS.Compensation+`/GetCompensation?empId=${id}`);
  }
  getBenefits(){
    return this.GetAll(API_URL+"api/Benefits")
  }
  getDeductions(){
    return this.GetAll(API_URL+"api/Deduction")
  }
  SaveCompensation(data:CompensationDTO){
    return this.Post(data,API_URL+API_ENDPOINTS.Compensation);
  }
  
  SaveVacationPolicy(data:VacationPolicy){
    return this.Post(data,API_URL+API_ENDPOINTS.Vacation);
  }
  SaveBenefitsAndDeduction(data:BenefitsAndDeduction){
    return this.Post(data,API_URL+API_ENDPOINTS.BenefitAndDeduction);

  }
  SaveBankDetails(data:BankDetails){
    return this.Post(data,API_URL+API_ENDPOINTS.BankDetails)
  }
  GetBankDetails(id:number){
    return this.GetAll(API_URL+API_ENDPOINTS.BankDetails+`/GetBankDetails?empId=${id}`);
  }
  GetVacationPolicy(id:number){
    return this.GetAll(API_URL+API_ENDPOINTS.Vacation+`/GetVacation?empId=${id}`);
  }
  GetBenefits(){
    return this.GetAll(API_URL+"api/BDType/Benefits")
  }
  GetDeductions(){
    return this.GetAll(API_URL+"api/BDType/Deductions")
  }
  GetEmpBenefitsAndDeduction(id:number){
    return this.GetAll(API_URL+API_ENDPOINTS.EmployeeBenefitsAndDeductions+`?empId=${id}`)
  }

}
