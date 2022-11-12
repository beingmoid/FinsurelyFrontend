import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControlDirective, FormGroup, FormGroupDirective, RequiredValidator, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Branch } from 'src/app/models/branchDTO';
import { ThousandSuffixesPipe } from 'src/app/pipes/thousand.suffix.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { BranchService } from 'src/app/services/APIServices/branch.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit,OnDestroy {
  isVisible=false;
  modalTitle="";
  isEditMode=false;
  id:number=0;
  form:FormGroup;
  constructor(private service:BranchService,
    private fb:FormBuilder,
    private alert:AlertService,
    private sharedService:SharedService) { 

      this.generateForm();
      this.sharedService.openBranchModal.subscribe(res=>{
        this.isVisible=true;
        this.isEditMode=false;
      });
      this.sharedService.openBranchModalWithData.subscribe(res=>{
        this.isVisible=true;
        this.isEditMode=true;
        this.form.patchValue(res);
      });
      this.sharedService.closeBranchModal.subscribe(res=>{
        this.isVisible=false;
        this.isEditMode=false;
      });
  }
  
  generateForm(){
    this.form=this.fb.group({
      branchName:[null,Validators.required],
      branchAddress:[null,Validators.required]
    });
  }

  ngOnInit(): void {
    this.sharedService.openBranchModal.subscribe(res=>{
      this.isVisible=true;
      this.modalTitle="Create new Branch";

      

    });
    this.sharedService.openBranchModalWithData.subscribe(res=>{
      if(res){
        this.isVisible=true;
        this.id=res.id;
        this.modalTitle="Update Branch";
        this.form.patchValue(res);
        this.isEditMode=true;

      }
    })
  }
  ngOnDestroy():void{
    
  }
  submitForm(formDirective:FormGroupDirective){
    
    if(this.isEditMode){
      this.UpdateBranch(this.id,formDirective);
      this.service.GetBranch();
    }
    else{
      this.CreateBranch(formDirective);
      this.service.GetBranch();
    }
  
  }

  CreateBranch(formDirective:FormGroupDirective ){
    this.id=0;
    var data = this.form.value as Branch;
    data.id=0;
    this.service.CreateBranch(data).subscribe(res=>{

      if(res.isSuccessfull){
        this.alert.success("Branch Added Successfully")
        formDirective.resetForm()
        this.sharedService.closeBranchModal.next(true);
      }
      else{
        this.alert.error("An error occured while Adding Branch")
      }

    });
  }
  UpdateBranch(id:number,formDirective: FormGroupDirective){

    var data = this.form.value as Branch;
    data.id=this.id;
    this.service.UpdateBranch(id,data).subscribe(res=>{

      if(res.isSuccessfull){
        this.alert.success("Branch Updated Successfully")
        formDirective.resetForm()
        this.sharedService.closeBranchModal.next(true);
      }
      else{
        this.alert.error("An error occured while Updating Branch")
      }

    });
  }
  handleCancel(){
    this.isVisible=false;
  }

}
