import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { payroll } from 'src/app/models/payrollDTO';
import { AlertService } from 'src/app/services/alert.service';
import { PayrollService } from 'src/app/services/APIServices/payroll.service';
import { SharedService } from 'src/app/services/shared.service';

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
  payroll: Subject<payroll> = new Subject();
  payrollObserver$: Observable<payroll[]>;


  constructor(private fb: FormBuilder,
    private _payrollService: PayrollService,
    private _alertService: AlertService,
    private _sharedService: SharedService) {
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
    this._sharedService.formSubmited.subscribe(res => {
      this.isVisible = false;
    })

  }

  showModal() {
    this.isVisible = true;
    this.isEditMode = false;
  }
  closeModal() {
    this.isVisible = false;
  }

  editPayroll(data: payroll) {


    this.payroll.next(data);
    // console.log('Parent ka subject',this.expense);
    // console.log('Parent sa Data gya',data);
    this.isVisible = true;
    this.isEditMode = true;
  }
  deletePayroll(data) {
    this._alertService.confirm('Are you sure you want to delete this?').then((res) => {
      if (res.isConfirmed) {
        this._payrollService.DeletePayroll(data.id).subscribe((res) => {
          if (res.isSuccessfull) {

            this._alertService.success('Expense SuccessFully Deleted');
            this._payrollService.GetPayroll();
          }
        });
      }
    })

  }

}
