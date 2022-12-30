import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { AnnouncementDTO } from 'src/app/models/announcementDTO';
import { AnnouncementService } from 'src/app/services/APIServices/announcement.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-view-announcements',
  templateUrl: './view-announcements.component.html',
  styleUrls: ['./view-announcements.component.scss']
})
export class ViewAnnouncementsComponent implements OnInit {
  isVisible = false;
  isEditMode = false;
  list: AnnouncementDTO[];

  announcementObserver$: Observable<AnnouncementDTO[]>;
  
  constructor(private _announcementServices: AnnouncementService,
    private _sharedService: SharedService) {

  }

  ngOnInit(): void {

    
      this._sharedService.formSubmited.subscribe((res) => {
        this.isVisible = false;
      });

      this._announcementServices.announcementObserver$.subscribe((res) => {
        if (res) {
          this.list = res;
          console.log('lisst', res)
        }
        
      })
      this._announcementServices.GetAnnouncement();

  }


  openModal() {
    this.isVisible = true;
    this.isEditMode = false;
  }
  closeModal() {
    this.isVisible = false;
  }
}
