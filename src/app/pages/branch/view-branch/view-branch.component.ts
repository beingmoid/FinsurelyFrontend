import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Branch } from 'src/app/models/branchDTO';
import { AlertService } from 'src/app/services/alert.service';
import { BranchService } from 'src/app/services/APIServices/branch.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrls: ['./view-branch.component.scss']
})
export class ViewBranchComponent implements OnInit {
  form: FormGroup;
  constructor(private service: BranchService,
    private sharedService: SharedService, private alert: AlertService, private fb: FormBuilder) {

    this.sharedService.closeBranchModal.subscribe(res => {
      this.service.GetBranch();
    });
    this.form = this.fb.group({
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      branch: new FormControl(null),
      isPdf: new FormControl(null),
      isExcel: new FormControl(null)

    })

  }
  pageSize = 20;

  searchAddress: string;
  listData: Branch[];
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

  filter(listOfSearchName: string[], searchAddress: string): void {
    this.listOfSearchName = listOfSearchName;
    this.searchAddress = searchAddress;
    this.search();
  }

  search(): void {
    /** filter data **/
    const filterFunc = item => (this.searchAddress ? item.address.indexOf(this.searchAddress) !== -1 : true) && (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true);
    const data = this.data.filter(item => filterFunc(item));
    /** sort data **/
    if (this.sortName) {
      this.displayData = data.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
    } else {
      this.displayData = data;
    }
  }
 

  ngOnInit(): void {
    this.service.branchObserver$.subscribe(res => {

      this.listData = res;

    });
    
    this.service.GetBranch();


  }

  showModal() {
    this.sharedService.openBranchModal.next(true);
  }

  editBranch(data: Branch) {
    this.sharedService.openBranchModalWithData.next(data);
  }
  deleteBranch(data) {
    this.alert.confirm("Deleting branch would delete all data related to branch? Do you want to continue?").then(res => {
      if (res.isConfirmed) {
        this.service.DeleteBranch(data.id).subscribe(res => {
          if (res.isSuccessfull) {
            this.alert.success("Deleted successfully!")
            this.service.GetBranch();
          }
          else {
            this.alert.error("Internal Server Error!")
          }
        })
      }
    })

  }



}
