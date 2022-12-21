import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Payment, Refund } from 'src/app/models/refundDTO';
import { RefundServiceService } from 'src/app/services/APIServices/refund-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';

class FilterObject {
  constructor(private data: Payment) { }

}
@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;

  refund: Subject<Refund> = new Subject();

  constructor(private sharedService:SharedService,
    private refundService:RefundServiceService,
     private fb: FormBuilder,
    private _alertService: AlertService) {

    this.sharedService.closeForm.subscribe(res=>{
      this.modalView=false;
    });
    this.form = this.fb.group({
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      branch: new FormControl(null),
      isPdf: new FormControl(null),
      isExcel: new FormControl(null)

    })
   }

   searchAddress: string;
   // listData: Branch[];
   nameList = [
     { text: 'Export as PDF', value: 'PDF', checked: true },
     { text: 'Export as Excel', value: 'Excel', checked: false }
   ];
 
   data = [
     {
       name: 'John Brown',
       age: 32,
       address: 'New York No. 1 Lake Park'
     },
     {
       name: 'Jim Green',
       age: 42,
       address: 'London No. 1 Lake Park'
     },
     {
       name: 'Joe Black',
       age: 32,
       address: 'Sidney No. 1 Lake Park'
     },
     {
       name: 'Jim Red',
       age: 32,
       address: 'London No. 2 Lake Park'
     }
   ];
   displayData = [...this.data];
   sortName = null;
   sortValue = null;
   listOfSearchName = [];
 
   show = false;
 
   chiplist = [];

  observerRefund:Subject<Refund> = new Subject<Refund>();
  search:string;
  isVisible=false;
  listData:any[]=[];
  pageSize=20;
  modalView=false;
  sortColumnKey: string;
  sortOn(colKey: string) {
    if (colKey) {
      this.sortColumnKey = colKey
    }
  }
  sortNamesFn = (a, b) => a[this.sortColumnKey]?.toString().localeCompare(b[this.sortColumnKey])
  sortNumbersFn = (a, b) => a[this.sortColumnKey] - b[this.sortColumnKey]

  ngOnInit(): void {
    this.sharedService.formSubmited.subscribe((res) => {
      this.isVisible = false;
    }); 

    this.refundService.refundObserver$.subscribe(res=>{
      this.listData= res as Refund[];
    })
    this.refundService.GetRefunds();
  }
  openModal(){
    this.isVisible=true;
    this.isEditMode= false;

  }
  closeModal(){
    this.isVisible=false;
  }

  editRefund(data) {
    this.refund.next(data);
    this.isVisible = true;
    this.isEditMode =true;
  }
  deleteRefund(data) {
    this._alertService.confirm('Are you sure you want to delete this?').then((res)=>{
      if(res.isConfirmed){
        this.refundService.deleteRefund(data.id).subscribe((res) => {
          if (res.isSuccessfull) {
    
            this._alertService.success('Refund SuccessFully Deleted');
            this.refundService.GetRefunds();
          }
        });
      }
    })
  
  }

}
