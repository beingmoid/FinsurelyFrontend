import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Service } from 'src/app/models/bodyType';
import { AlertService } from 'src/app/services/alert.service';
import { ServiceService } from 'src/app/services/APIServices/service.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.scss']
})
export class ViewServiceComponent implements OnInit {
  list: Service[];
  name = 'Service';
  isLoaded = true;
  pageSize = 20;
  isVisible = false;
  isEditMode = false;
  service: Subject<Service> = new Subject();

  serviceObserver$: Observable<Service[]>
  constructor(private _service: ServiceService, private _sharedService: SharedService, private _alertService: AlertService) {

  }

  ngOnInit(): void {

    this._sharedService.formSubmited.subscribe((res) => {
      this.isVisible = false;
    });

    this._service.ServiceObserver$.subscribe(
      (res) => {
        if (res) {  
          this.list = res;
          this.isLoaded = false;
          console.log(this.list)
        }
      }
    );
    this._service.GetService();
  }

  openModal() {
    this.isVisible = true;
    this.isEditMode= false;
  }
  closeModal() {
    this.isVisible = false;
  }
  editService(data) {
    console.log(data)
    this.service.next(data);
    this.isVisible = true;
    this.isEditMode =true;
  }
  deleteService(data) {
    this._alertService.confirm('Are you sure you want to delete this?').then((res)=>{
      if(res.isConfirmed){
        this._service.DeleteService(data.id).subscribe((res) => {
          if (res.isSuccessfull) {
    
            this._alertService.success('Service SuccessFully Deleted');
            this._service.GetService();
          }
        });
      }
    })
  
  }

}
