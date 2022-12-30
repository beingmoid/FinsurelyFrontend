import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { VacationDTO } from 'src/app/models/vacationDTO';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class VacationService extends GenericApiService {
vacationObserver$: Observable<VacationDTO[]>;
private vacationSubject$: BehaviorSubject<VacationDTO[]> = new BehaviorSubject<VacationDTO[]>(undefined);


  constructor(private httpclient: HttpClient,
    ) {
      super(httpclient);
      this.vacationObserver$ = this.vacationSubject$.asObservable();
     }

    GetVacation(){
      this.GetAll(API_URL + API_ENDPOINTS.VactionApplication).subscribe(res=>{
        if(res.isSuccessfull){
          this.vacationSubject$.next(res.dynamicResult as VacationDTO[]);
        }
      })
    }

    CreateVacation(data: VacationDTO){  
      return this.Post(data, API_URL + API_ENDPOINTS.VactionApplication);
    }

    UpdateVacation(id:number,data:VacationDTO){
      return this.Update(id, data, API_URL + API_ENDPOINTS.VactionApplication);
    }

    DeleteVacation(id:number){
      return this.Delete(id, API_URL + API_ENDPOINTS.VactionApplication);
    }


}
