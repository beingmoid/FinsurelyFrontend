import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BDType, Benefits, BenefitsAndDeduction, Deduction } from 'src/app/models/employeeDetailDto';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { EmployeeService } from 'src/app/services/APIServices/employee.service';

@Component({
  selector: 'app-benefits-and-deductions',
  templateUrl: './benefits-and-deductions.component.html',
  styleUrls: ['./benefits-and-deductions.component.scss']
})
export class BenefitsAndDeductionsComponent implements OnInit {
  @Input() empObserverSubject?:Subject<UserDetailDTO> = new Subject();
  empDetailId:number;
  userDetail: UserDetailDTO;
  benefitsArr:Benefits[];
  deductionArr:Deduction[];
  benefitAndDeductions:BenefitsAndDeduction[];
  selectable=true;
  removable=true;
  benefitControl:FormControl = new FormControl();

  deductionControl:FormControl = new FormControl();
  constructor(private fb:FormBuilder,
    private alert:AlertService,
    private emp:EmployeeService) {

    this.benefit=this.fb.group({

      benefitTypeId:[null],
      payStubLabel:[null],
      amount:[null],
      occurance:[null]
    });

    this.deduction=this.fb.group({
  
      deductionTypeId:[null],
      payStubLabel:[null],
      amount:[null],
      type:[null],
      occurance:[null]
    });
    this.benefitAndDeduction=this.fb.group({
      employmentDetailId:[null],
      applicableDate:[null],
      benefits:[null],
      deduction:[null]
    
    })
   }
   benefitAndDeduction:FormGroup;
  benefit:FormGroup;
  
  benefits:Benefits[]=[];
  deductions:Deduction[]=[];
  deduction:FormGroup;
  benefitType:BDType[];
  deductionType:BDType[];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  isBenefitVisible=false;
  isDeductionVisible=false;
  handleBenefitOpen(){
    this.isBenefitVisible=true;
    this.isDeductionVisible=false;
  }
  handleBenefitCancel(){
    this.isBenefitVisible=false;

  }
  handleDeductionOpen(){
    this.isDeductionVisible=true;
    this.isBenefitVisible=false;
  }
  handleDeductionCancel(){
    this.isDeductionVisible=false;
  }


  ngOnInit(): void {

    this.empObserverSubject.subscribe(res=>{
      console.log(res);
      this.userDetail=res as UserDetailDTO;
      this.empDetailId=res.employmentDetails[0].id;
      console.log(this.empDetailId);
      this.emp.GetBenefits().subscribe(res=>{
        if(res.isSuccessfull){
          this.benefitType=res.dynamicResult as BDType[];
        }
      })
      this.emp.GetDeductions().subscribe(res=>{
        if(res.isSuccessfull){
          this.deductionType=res.dynamicResult as BDType[];
        }
      })
      this.emp.GetEmpBenefitsAndDeduction(this.empDetailId).subscribe(res=>{
          if(res.isSuccessfull){
            this.benefitAndDeductions= res.dynamicResult as BenefitsAndDeduction[];
          }
      });

 
      
      
  
      
    });

  }


  private _filterBenefits(value: string) {
    if(value)
      return this.benefitsArr? this.benefitsArr?.filter(option => option.payStubLabel?.toLowerCase().includes(value.toString().toLowerCase())):[];
    else
    return;
  }
  displayBenefitFn(id) {

    if(this.benefitsArr && id){
      return this.benefitsArr.find(x=>x.id===id).payStubLabel;
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
  }
  removeBenefit(ben: Benefits): void {
    const index = this.benefits.indexOf(ben);

      if (index >= 0) {
        this.benefits.splice(index, 1);
      }

  }
  add(event: MatChipInputEvent): void {
    console.log(event)
    // const value = event.value as Benefits;

    // // Add our fruit
    // if (value) {
    //   this.fruits.push(value);
    // }

    // // Clear the input value
    // event.chipInput!.clear();

    // this.fruitCtrl.setValue(null);
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    // this.selectedBenefits.push(event.option.viewValue);
    // this.fruitInput.nativeElement.value = '';
    // this.fruitCtrl.setValue(null);
  }

  removeDeduction(ded: Deduction): void {
    const index = this.deductions.indexOf(ded);

    if (index >= 0) {
      this.deductions.splice(index, 1);
    }
  }

  OnSubmit(){
    
     var data = this.benefitAndDeduction.value as BenefitsAndDeduction;
     if(!this.empDetailId){
       return;
     }
     data.employmentDetailId=this.empDetailId;
     data.benefits=this.benefits;
     data.deduction=this.deductions;
     console.log(data);
     this.emp.SaveBenefitsAndDeduction(data).subscribe(res=>{
       if(res.isSuccessfull){
         this.alert.success("Benefits/Deductions has been updated for this employee")
         this.emp.GetEmpBenefitsAndDeduction(this.empDetailId).subscribe(res=>{
           if(res.isSuccessfull){
             this.benefitAndDeductions=res.dynamicResult as BenefitsAndDeduction[];
           }
         })
       }
       else{
        this.alert.error("Problem while updating the Benefits/Deductions for employee");
       }
     })
    //  this.emp.SaveVacationPolicy(data).subscribe(res=>{
    //    if(res.isSuccessfull){
    //      this.alert.success("Vacation has been updated for employee")
    //      this.emp.GetVacationPolicy(this.empDetailId).subscribe(res=>{
    //        if(res.isSuccessfull){
    //          this.vacations=res.dynamicResult as VacationPolicy[];
    //        }
    //      });
    //    }
    //    else{
    //      this.alert.error("Problem while updating the Vacation  for employee");
    //    }
 
    //  });
     
   }
   BenefitSubmit(){
    var data = this.benefit.value as Benefits;
    this.benefits.push(data);
   }
   DeductionSubmit(){
    var data = this.deduction.value as Deduction;
    this.deductions.push(data);
   }
}
