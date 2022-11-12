import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Payment, Refund } from 'src/app/models/refundDTO';
import { RefundServiceService } from 'src/app/services/APIServices/refund-service.service';
import { SharedService } from 'src/app/services/shared.service';
class FilterObject {
  constructor(private data: Payment) { }

}
@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss']
})
export class RefundComponent implements OnInit {

  constructor(private sharedService:SharedService,
    private refundService:RefundServiceService) {

    this.sharedService.closeForm.subscribe(res=>{
      this.modalView=false;
    });
   }
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
    this.refundService.refundObserver$.subscribe(res=>{
      this.listData= res as Refund[];
    })
    this.refundService.GetRefunds();
  }
  openModal(){
    this.isVisible=true;
  }
  closeModal(){
    this.isVisible=false;
  }
}
