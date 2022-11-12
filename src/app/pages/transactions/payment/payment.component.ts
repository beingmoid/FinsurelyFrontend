import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Payment } from 'src/app/models/refundDTO';
import { AlertService } from 'src/app/services/alert.service';
import { PaymentService } from 'src/app/services/APIServices/payment-service.service';
import { SharedService } from 'src/app/services/shared.service';
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
  constructor(private sharedService:SharedService,
    private alert:AlertService,
    private PaymentService:PaymentService) {

    this.sharedService.closeForm.subscribe(res=>{
      this.modalView=false;
    });
   }
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
