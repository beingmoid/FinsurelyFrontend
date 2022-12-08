import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/models/refundDTO';
import { SharedService } from 'src/app/services/shared.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

class FilterObject {
  constructor(private data: Payment) { }

}
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  form: FormGroup;

  constructor(private sharedService:SharedService, private fb: FormBuilder) {

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
  }
  openModal(){
    this.modalView=true;
  }
}
