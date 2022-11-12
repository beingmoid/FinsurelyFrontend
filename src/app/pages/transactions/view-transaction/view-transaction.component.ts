import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Transactions, TransactionType } from 'src/app/models/TransactionsDTO';
class FilterObject {
  constructor(private data: Transactions) { }

  index: number = this.data.id;
  memo: string = this.data.memo;
  date: string = this.data.transactionDate.toDateString();
  entity: string = this.data?.userDetails?.displayNameAs;
  transactionType:TransactionType = this.data.transactionType;
}
@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent implements OnInit {


  search:string;
  listData:Transactions[];
  pageSize=10;
  sortColumnKey: string;
  sortOn(colKey: string) {
    if (colKey) {
      this.sortColumnKey = colKey
    }
  }
  sortNamesFn = (a, b) => a[this.sortColumnKey]?.toString().localeCompare(b[this.sortColumnKey])
  sortNumbersFn = (a, b) => a[this.sortColumnKey] - b[this.sortColumnKey]
  constructor() { }

  ngOnInit(): void {
  
  }
  filter(){

  }
  showModal(){

  }

}
