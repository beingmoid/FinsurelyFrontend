import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/models/refundDTO';
import { SharedService } from 'src/app/services/shared.service';
class FilterObject {
  constructor(private data: Payment) { }

}
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  constructor(private sharedService:SharedService) {

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
  }
  openModal(){
    this.modalView=true;
  }
}
