import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { VacationPolicy } from 'src/app/models/employeeDetailDto';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { EmployeeService } from 'src/app/services/APIServices/employee.service';

@Component({
  selector: 'app-vacation-policy',
  templateUrl: './vacation-policy.component.html',
  styleUrls: ['./vacation-policy.component.scss']
})
export class VacationPolicyComponent implements OnInit {
  @Input() empObserverSubject?:Subject<UserDetailDTO> = new Subject();
  vacationForm:FormGroup;
  vacations:VacationPolicy[];
  empDetailId:number;
  userDetail:UserDetailDTO;
  constructor(private fb:FormBuilder,
    private emp:EmployeeService,
    private alert:AlertService) { 
    this.vacationForm=this.fb.group({
      annualLeavesCount:[null],
      casualLeaveCount:[null],
      sickLeaveCount:[null],
      forYear:[null]

    });
  }

  ngOnInit(): void {
    this.empObserverSubject.subscribe(res=>{

      this.userDetail=res as UserDetailDTO;
      this.empDetailId=res.employmentDetails[0].id;
      console.log(this.empDetailId);
      this.emp.GetVacationPolicy(this.empDetailId).subscribe(res=>{
        if(res.isSuccessfull){
          this.vacations=res.dynamicResult as VacationPolicy[];
        }
      });

    });
  }


 OnSubmit(formGroupDirective:FormGroupDirective){
   debugger;
    var data = this.vacationForm.value as VacationPolicy;
    if(!this.empDetailId){
      return;
    }
    data.employmentDetailId=this.empDetailId;
    
    this.emp.SaveVacationPolicy(data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success("Vacation has been updated for employee")
        this.emp.GetVacationPolicy(this.empDetailId).subscribe(res=>{
          if(res.isSuccessfull){
            this.vacations=res.dynamicResult as VacationPolicy[];
          }
        });
      }
      else{
        this.alert.error("Problem while updating the Vacation  for employee");
      }

    });
    
  }
}
