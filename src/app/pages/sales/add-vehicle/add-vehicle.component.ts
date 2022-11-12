import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Vehicle } from 'src/app/models/TransactionsDTO';
import { AlertService } from 'src/app/services/alert.service';
import { SalesService } from 'src/app/services/APIServices/sales.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {

  constructor(private fb:FormBuilder,private saleService:SalesService,
    private sharedService:SharedService,
    private alert:AlertService) { 

    this.form=this.fb.group({
      make:[null,Validators.required],
      model:[null,Validators.required]
    });
  }
  form:FormGroup;
  isLoading=false;
  get f(){return this.form as FormGroup};
  ngOnInit(): void {
  }
  


  OnSubmit(formDirective:FormGroupDirective){
    if(this.form.invalid){
        return;
    }
    this.SaveVehicle(formDirective);
  }

  SaveVehicle(formDirective:FormGroupDirective){
    var data = this.form.value as Vehicle;
    this.saleService.CreateVehicle(data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success('New Vehicle Added');
formDirective.resetForm();
   
        this.form.reset();
        this.saleService.GetVehicles();
        this.sharedService.vehicleForm.next();
      }
      else{
        this.alert.error('Error while saving ..!');
      }
    })
    
  }
}
