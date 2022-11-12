import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { CompensationDTO } from 'src/app/models/employeeDetailDto';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { EmployeeService } from 'src/app/services/APIServices/employee.service';

@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss']
})
export class CompensationComponent implements OnInit {
  @Input() empObserverSubject?:Subject<UserDetailDTO> = new Subject();
  employmentDetailId:number;
  CompensationForm:FormGroup;
  userDetail:UserDetailDTO;
  compensations:CompensationDTO[];

  constructor(private fb:FormBuilder,
    private emp:EmployeeService,
    private alert:AlertService) { 


    this.CompensationForm=this.fb.group({
      salaryAmount:[null],
      effectiveDate:[null],


    });

  }



  ngOnInit(): void {

    
    this.empObserverSubject.subscribe(res=>{

      this.userDetail=res as UserDetailDTO;
      this.employmentDetailId=res.employmentDetails[0].id;
      console.log(this.employmentDetailId);
      this.emp.getCompensation(this.employmentDetailId).subscribe(res=>{
        if(res.isSuccessfull){
          this.compensations=res.dynamicResult as CompensationDTO[];
        }
      });

    });
  }
  OnSubmit(formGroupDirective:FormGroupDirective){
    var data = this.CompensationForm.value as CompensationDTO;
    data.employmentDetailId=this.employmentDetailId;
    
    this.emp.SaveCompensation(data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success("Compensation has been updated for employee")
        this.emp.getCompensation(this.employmentDetailId).subscribe(res=>{
          if(res.isSuccessfull){
            this.compensations=res.dynamicResult as CompensationDTO[];
          }
        });
      }
      else{
        this.alert.error("Problem while updating the compensation  for employee");
      }

    });
    
  }
}
