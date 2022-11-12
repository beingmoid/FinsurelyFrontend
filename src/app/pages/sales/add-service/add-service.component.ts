import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Service } from 'src/app/models/bodyType';
import { AlertService } from 'src/app/services/alert.service';
import { ServiceService } from 'src/app/services/APIServices/service.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {

  constructor(private fb:FormBuilder,private service:ServiceService,
    private sharedService:SharedService,
    private alert:AlertService) { 

    this.form=this.fb.group({
      policyTypeId:[null,Validators.required],
      name:[null,Validators.required],

    });
  }
  form:FormGroup;
  isLoading=false;
  get f(){return this.form as FormGroup};
  ngOnInit(): void {
  }
  


  OnSubmit(form:FormGroupDirective){
    if(this.form.invalid){
        return;
    }
    this.SaveService(form);
  }

  
  SaveService(form:FormGroupDirective){
    var data = this.form.value as Service;
    this.service.SaveService(data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success('New Service Added');

        form.resetForm();
        this.form.reset();
        this.service.GetService();
        this.sharedService.serviceForm.next('service');
      }
      else{
        this.alert.error('Error while saving ..!');
      }
    })
    
  }
}
