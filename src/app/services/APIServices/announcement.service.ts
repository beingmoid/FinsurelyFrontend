import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ObservableInput } from 'rxjs';
import { AnnouncementDTO } from 'src/app/models/announcementDTO';
import { API_ENDPOINTS, API_URL } from 'src/app/models/Global';
import { GenericApiService } from './genericApi.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService extends GenericApiService {

  announcementObserver$: Observable<AnnouncementDTO[]>;
  private announcementSubject$: BehaviorSubject<AnnouncementDTO[]> = new BehaviorSubject<AnnouncementDTO[]>(undefined);


  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.announcementObserver$ = this.announcementSubject$.asObservable();

  }
  GetAnnouncement() {
    this.GetAll(API_URL + API_ENDPOINTS.Announcement).subscribe(res => {
      if (res.isSuccessfull) {
        this.announcementSubject$.next(res.dynamicResult as AnnouncementDTO[]);
      }
    })
  }

  CreateAnnouncement(data: AnnouncementDTO) {
    return this.Post(data, API_URL + API_ENDPOINTS.Announcement);
  }

  UpdateAnnouncement(id:number ,data:AnnouncementDTO){
return this.Update(id,data, API_URL + API_ENDPOINTS.Announcement);
  }

  DeleteAnnouncement(id:number){
return this.Delete(id, API_URL + API_ENDPOINTS.Announcement);
  }
}
