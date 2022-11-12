import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { BankDetails } from 'src/app/models/employeeDetailDto';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { EmployeeService } from 'src/app/services/APIServices/employee.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  @Input() empObserverSubject?:Subject<UserDetailDTO> = new Subject();
  empDetailId:number;
  userDetail: UserDetailDTO;
  banks:BankDetails[];
  constructor(private fb:FormBuilder,
    private emp:EmployeeService,
    private alert:AlertService ) {

    this.bankForm=this.fb.group({
      accountHolderName:[null],
      accountNumber:[null],
      ibanNumber:[null],
      bankType:[null]
    });
   }
  bankForm:FormGroup;
  ngOnInit(): void {
    this.empObserverSubject.subscribe(res=>{
      console.log(res);
      this.userDetail=res as UserDetailDTO;
      this.empDetailId=res.employmentDetails[0].id;
      this.emp.GetBankDetails(this.empDetailId).subscribe(res=>{
        if(res.isSuccessfull){
          this.banks=res.dynamicResult as BankDetails[];
        }
      })
    });

  }
  OnSubmit(){
    var data = this.bankForm.value as BankDetails;
    data.employmentDetailId=this.empDetailId;
    this.emp.SaveBankDetails(data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success("Bank details have been saved!");
        this.emp.GetBankDetails(this.empDetailId).subscribe(res=>{
          if(res.isSuccessfull){
            this.banks=res.dynamicResult as BankDetails[];
          }
        });
      }
      else{
        this.alert.error("Bank details have not been saved");
      }
    })
 
  }

}
