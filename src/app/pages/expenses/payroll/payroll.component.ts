import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { payroll } from 'src/app/models/payrollDTO';
import { PayrollService } from 'src/app/services/APIServices/payroll.service';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {
  list: payroll[];
  pageSize = 20;
  form: FormGroup;
  isVisible = false;
  isEditMode = false;



  constructor(private fb: FormBuilder, private _payrollService: PayrollService) {
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


  ngOnInit(): void {
    this._payrollService.PayrollObserver$.subscribe(res => {
      this.list = res;
    })
    this._payrollService.GetPayroll();

  }

  showModal() {
    this.isVisible = true;
    this.isEditMode = false;
  }
  closeModal() {
    this.isVisible = false;
  }
}
