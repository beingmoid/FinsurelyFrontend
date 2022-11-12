import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Reconcilation } from 'src/app/models/reconcilationReportDTO';
import { Recon, ReconData } from 'src/app/models/reconData';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { SalesService } from 'src/app/services/APIServices/sales.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-reconcile',
  templateUrl: './reconcile.component.html',
  styleUrls: ['./reconcile.component.scss']
})
export class ReconcileComponent implements OnInit {
@Input() fileUrl:Subject<string>;
@Input() Agent:Subject<UserDetailDTO>;
@ViewChild('stepper') stepper :ElementRef;
agentData:UserDetailDTO;
 importFileColumns:string[];
 salesColumns:{id:number,name:string}[];
 size="large"
 selected:string;
 mappingFormGroup:FormArray;
  constructor(  private _sales:SalesService,private fb:FormBuilder,
    private sharedService:SharedService) { 
    this.salesColumns= [
      {id:0,
      name:'none'},
      {
        id:1,
        name:'Transaction Type'
      },
 
      {
        id:2,
        name:'Invoice Number'
      },  {
        id:3,
        name:'Policy Number'
      }
      ,  {
        id:4,
        name:'Invoice Date'
      },  {
        id:5,
        name:'InsuranceType'
      },  {
        id:6,
        name:'Amount'
      },  {
        id:7,
        name:'Debit'
      },  {
        id:8,
        name:'Credit'
      }
      ,  {
        id:9,
        name:'Balance'
      },  {
        id:10,
        name:'Vehicle'
      },
      {
        id:11,
        name:'Name'
      },
      {
        id:12,
        name:'Transaction Ref Number'
      },
      {
        id:13,
        name:'Memo'
      },
      {
        id:14,
        name:'Account Name'
      },

         
     
     ];
     this.mappingFormGroup=this.fb.array([]);
  }
get fElement(){return this.mappingFormGroup.controls as FormGroup[]}
selectAll(item){
  console.log(item);
}
  ngOnInit(): void {
    this.Agent.subscribe(res=>{
      if(res){
        this.agentData=res;
        console.log(res)
      }
    })
    this.fileUrl.subscribe(res=>{
      if(res){
        //Start of Modal at every case
        this._sales.GetColumnHeaders(res).subscribe(res=>{
          if(res.dynamicResult){
            this.importFileColumns=res.dynamicResult as string[];
  
            console.log('naya',this.importFileColumns);
            var getLocalData = localStorage.getItem(this.agentData.id.toString())
            console.log('naya2',getLocalData,this.agentData);
            if(getLocalData!=undefined){
              var localData=JSON.parse(getLocalData) as Recon;
              localData.reconData.forEach(x=>{
                var formGroup = this.fb.group({
                  columnName:[null],
                  mappedTo:[null],
                  allowMapping:[null],
  
                  compare:[null]
                });
                formGroup.controls.columnName.setValue(x.columnName);
                formGroup.controls.mappedTo.setValue(x.mappedTo);
                formGroup.controls.allowMapping.setValue(x.allowMapping);
                formGroup.controls.compare.setValue(x.compare);
                this.mappingFormGroup.push(formGroup);
              });
            }
            else{
              this.importFileColumns.forEach(x=>{
                var formGroup = this.fb.group({
                  columnName:[null],
                  mappedTo:[null],
                  allowMapping:[null],
  
                  compare:[null]
                });
                formGroup.controls.columnName.setValue(x);
                formGroup.controls.mappedTo.setValue(0);
                formGroup.controls.allowMapping.setValue(true);
                formGroup.controls.compare.setValue(true);
                this.mappingFormGroup.push(formGroup);
              });
            }
            
          }
   
        });
      //  console.log(this.salesColumns);
      }

    });
  }
  removeSelected(event,i){
    var selected = event.target.value;
    if(this.fElement.some(x=>x.controls.mappedTo==selected)){

    }
    else{
     var item = this.salesColumns.filter(x=>x==selected);
     console.log(item)
    //  var index = this.salesColumns.find(x=>x==selected);
    }
  }
  process(){

    var data = this.mappingFormGroup.value as ReconData[];
    console.log('process',data); 
    this.sharedService.reconData.next(data);
  }
}
