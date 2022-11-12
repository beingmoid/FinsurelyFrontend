import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/models/refundDTO';
import { AlertService } from 'src/app/services/alert.service';
import { PaymentService } from 'src/app/services/APIServices/payment-service.service';
import { SharedService } from 'src/app/services/shared.service';
class FilterObject {
  constructor(private data: Payment) { }

}
@Component({
  selector: 'app-credit-payment',
  templateUrl: './credit-payment.component.html',
  styleUrls: ['./credit-payment.component.scss']
})
export class CreditPaymentComponent implements OnInit {

  constructor(private sharedService:SharedService,private paymentService: PaymentService,    private alert:AlertService,) {

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

    this.paymentService.GetSentPayments().subscribe(res=>{

      if(res.isSuccessfull){
        this.listData=res.dynamicResult as Payment[];
      }
    })
  }
  openModal(){
    this.sharedService.sentPaymentForm.next(null);
  }

  EditPayment(data:Payment){

    this.sharedService.sentPaymentForm.next(data);

  }
  DeletePayment(data:Payment){
    this.alert.confirm("Warning!","Please confirm before delete!").then(val=>{
      if(val.isConfirmed){
        this.paymentService.DeletePayment(data.id).subscribe(res=>{
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
}
