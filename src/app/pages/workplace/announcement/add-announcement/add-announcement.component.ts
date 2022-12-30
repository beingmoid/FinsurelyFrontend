import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { AnnouncementDTO } from 'src/app/models/announcementDTO';
import { AlertService } from 'src/app/services/alert.service';
import { AnnouncementService } from 'src/app/services/APIServices/announcement.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss']
})
export class AddAnnouncementComponent implements OnInit {
form: FormGroup;
announcement: AnnouncementDTO;
  id: number;

  constructor(private fb: FormBuilder,
    private _announcementService:AnnouncementService,
    private _sharedServices: SharedService,
    private _alertServices: AlertService,
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        fullName: [null, Validators.required],
        jobTitle: [null,Validators.required],
        annoucementTitle: [null, Validators.required],
        date: [null, Validators.required],
        description: [null, Validators.required] 


      }

    )
    



  }



  onSubmit(formDirective: FormGroupDirective) {
    var data= this.form.value as AnnouncementDTO;
    if (this.form.invalid) {
      return;
    }
    else {
      

      if (this.id > 0) {
        data.id = this.id;

        this._announcementService.UpdateAnnouncement(this.id, data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertServices.success('Announcement Updated Successfully.');
            this._announcementService.GetAnnouncement();
            this._sharedServices.formSubmited.next(res);
          }
        })
      }
      else {
        data.id = 0;

        this._announcementService.CreateAnnouncement(data).subscribe((res) => {
          if (res.isSuccessfull) {
            formDirective.resetForm();
            this._alertServices.success('Announcement Inserted Successfully.');
            this._announcementService.GetAnnouncement();
            this._sharedServices.formSubmited.next(res);
          }
        })
      }

    }
    console.log('datacheck',data);

  }
}
