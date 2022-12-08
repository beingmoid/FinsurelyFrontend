import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CaseTaskDTO } from 'src/app/models/caseTaskDTO';
import { AlertService } from 'src/app/services/alert.service';
import { TaskService } from 'src/app/services/APIServices/task.service';
import { PermissionService } from 'src/app/services/permission.service';
import { SharedService } from 'src/app/services/shared.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';



class FilterObject {

  constructor(private data: CaseTaskDTO) { }
  index: number = this.data.index;
  taskName: string = this.data.taskName;
  priorityName: string = this.data.priority.name;
  dueDate: Date = this.data.dueDate;
  assignedToName: string = this.data.assignedTo.displayNameAs;
  assignedByName: string = this.data.assignedBy.displayNameAs;
  statusName: string = this.data.status.name;
}

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.scss']
})
export class ViewTasksComponent implements OnInit, OnDestroy {

  showtask: boolean = false;
  taskdata: CaseTaskDTO = new CaseTaskDTO();
  search: string
  listData: CaseTaskDTO[] = []
  isVisible: boolean = false
  modalTitle: string = "New Task"
  caseId: number = 0;
  isEditMode: boolean = false;
  caseTaskObserverSubject: Subject<CaseTaskDTO> = new Subject();
  caseTasksSubject: Subscription;
  sortColumnKey: string;
  listDataCopy: string;
  pageSize: number = 10;
  sub: Subscription;
  form: FormGroup;

  constructor(private _notification: AlertService, 
    private _taskService: TaskService, 
    private _sharedService: SharedService, 
    public _permissionService: PermissionService ,
    private route: Router ,
    private ActivateRoute: ActivatedRoute,
    private fb: FormBuilder) {
    this._taskService.isViewed.subscribe(x => {
      this.loadData();
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


  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
   
    if(history.state.caseId){
      this.caseId = history.state.caseId;
    }else{
      this.sub = this.ActivateRoute
      .queryParams
      .subscribe(params => {
        this.caseId = +params['caseId'] || 0;
      });
    }
    
    this.caseTasksSubject = this._taskService.caseTasksObserver$.subscribe(res => {
      if (res) {
        let index = 0;
        res.forEach(element => {
          element.index = index + 1;
          index++;
        });
        this.isVisible = false;
        this.listData = res;
        this.listDataCopy = JSON.stringify(this.listData);

        let taskId = history.state.taskId;
        if (taskId) {
          this.showSingleTask(this.listData.find(p => p.id == taskId));
        }
      }

    });

    if (this.caseId && this.caseId !== 0) {
      this._taskService.getCaseTasksByCase(this.caseId);
    } else {
      this._taskService.getCaseTasks();
    }
    this.showtask = false;
  }
  ngOnDestroy() {
    if (this.caseTasksSubject) this.caseTasksSubject.unsubscribe();
  }

  handleCancel() {
    this._sharedService.restForm.next();
    this.isVisible = false
  }

  editCaseTask(data: CaseTaskDTO) {
    this.isEditMode = true;
    this.isVisible = true;
    this.caseTaskObserverSubject.next(data);
    this.showtask = false;
  }

  submissionDone(event) {
    if (event) {
      this.handleCancel();
    }
  }

  showModal() {
    this.isEditMode = false;
    this.isVisible = true;
    this.caseTaskObserverSubject.next(null);
  }

  deleteCaseTask(data) {
    this._notification.delete('Are you sure you want to delele!').then(result => {
      if (result.isConfirmed) {
        
        this._taskService.deleteCaseTask(data).subscribe(res => {
          if (res.isSuccessfull) {
            this._notification.success("Task Deleted successfully");
            this.showtask = false;
             this.route.navigate(['/tasks'], { queryParams: { caseId: this.caseId } });
              this._taskService.getCaseTasksByCase(this.caseId);

              this.loadData();
        
           
          }
          else {
            this._notification.success("Error deleting Task");
          }
        });
      } else {
        return
      }
    });

  }

  checkClass(x: string, y: string) {

    try {

      return x.toLowerCase() == y.toLowerCase();
    }
    catch {
      return false;
    }

  }



  // Sorting
  sortOn(colKey: string) {
    if (colKey) {
      this.sortColumnKey = colKey
    }
  }

  sortNamesFn = (a, b) => a[this.sortColumnKey]?.toString().localeCompare(b[this.sortColumnKey])
  sortNumbersFn = (a, b) => a[this.sortColumnKey] - b[this.sortColumnKey]


  filter() {
    this.listData = JSON.parse(this.listDataCopy);
    if (this.search !== "") {
      this.listData = this.listData.filter(item => {
        let data = new FilterObject(item);
        return Object.keys(data).some(
          k =>
            data[k] != null &&
            data[k]
              .toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())
        )
      });
    }
  }
  showSingleTask(data: CaseTaskDTO) {
    this.taskdata = data;
    this.showtask = true;
  }
}
