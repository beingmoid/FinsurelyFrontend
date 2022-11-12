import { Component, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { BodyType } from 'src/app/models/bodyType';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehicle } from 'src/app/models/TransactionsDTO';
import { AlertService } from 'src/app/services/alert.service';
import { SalesService } from 'src/app/services/APIServices/sales.service';
import { SharedService } from 'src/app/services/shared.service';
import { BodytypeService } from 'src/app/services/APIServices/bodytype.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-add-body-type',
  templateUrl: './add-body-type.component.html',
  styleUrls: ['./add-body-type.component.scss']
})
export class AddBodyTypeComponent implements OnInit {
  constructor(private fb:FormBuilder,private service:BodytypeService,
    private sharedService:SharedService,
    private modal:NzModalService,
    private alert:AlertService) { 

    this.form=this.fb.group({
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
    this.SaveBodyType(form);
  }

  SaveBodyType(form:FormGroupDirective){
    var data = this.form.value as BodyType;
    this.service.SaveBodyType(data).subscribe(res=>{
      if(res.isSuccessfull){
        
        this.service.GetBodyType();
      const ref:NzModalRef= this.modal.info();
      ref.close();
      form.resetForm();
      this.sharedService.bodyform.next('body');
        this.alert.success('New BodyType Added');

      
        
        
      }
      else{
        this.alert.error('Error while saving ..!');
      }
    })
    
  }

}
