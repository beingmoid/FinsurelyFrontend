import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Payment } from 'src/app/models/refundDTO';
import { AlertService } from 'src/app/services/alert.service';
import { PaymentService } from 'src/app/services/APIServices/payment-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

class FilterObject {
  constructor(private data: Payment) { }

}
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentSub:Subject<Payment> = new Subject<Payment>();
  form: FormGroup;

  constructor(private sharedService:SharedService,
    private alert:AlertService,
    private PaymentService:PaymentService,
    private fb: FormBuilder) {

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


  
  search:string;
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
    this.PaymentService.GetRecevingPayments().subscribe(res=>{
      if(res.isSuccessfull){

        this.listData= res.dynamicResult as Payment[];
      }
    });
  }
  EditPayment(data:Payment){
    
    this.sharedService.paymentForm.next(data);
 
  }
  DeletePayment(data:Payment){
    this.alert.confirm("Warning!","Please confirm before delete!").then(val=>{
      if(val.isConfirmed){
        this.PaymentService.DeletePayment(data.id).subscribe(res=>{
          if(res.isSuccessfull){
            this.alert.success("Payment Deleted Successfully")
          }
          else{
            this.alert.error("Internal Server Error : Payment couldn't be deleted successfully!")
          }
        });
      }
  
    });
 
  }
  openModal(){
    this.sharedService.paymentForm.next(null);
  }
}
