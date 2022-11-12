import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { columns } from './statementConfig.json';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Columns, StatementColumns } from 'src/app/models/StatementColumns';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { AlertService } from 'src/app/services/alert.service';
import { SearchAndFilter } from '../sales-agent-detail/sales-agent-detail.component';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AccountsReceviableReport } from 'src/app/models/accountDTO';
/**
 * @title typesOfShoes
 */
@Component({
  selector: 'app-statement-view',
  templateUrl: './statement-view.component.html',
  styleUrls: ['./statement-view.component.scss']
})
export class StatementViewComponent implements OnInit {
  state$: Observable<any>;
  loading: boolean;
  statement: any[];
  report: AccountsReceviableReport;
  constructor(    private fb:FormBuilder,
    private _salesAgentService:SalesAgentService,
    private route:ActivatedRoute,
    private router:Router,
    private alert:AlertService,
    private _sharedService:SharedService) { 
    this.dateAndFilters=this.fb.group({
      start:[null],
      end:[null],
      sortBy:[null]
    })
  }
  dateAndFilters:FormGroup;
  userDetailId:number;
  includeLogo:boolean=true;
  includeName:boolean=true;
  entity:UserDetailDTO;
  columnsToDisplay:Columns[] = columns;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  ngOnInit(): void {
    this.state$ = this.route.paramMap
    .pipe(map(() => window.history.state));
    console.log(this.state$);
    this.state$.subscribe(res=>{
      if(res){
        console.log(res.params );
        this.entity=JSON.parse(res.params);
      }
    })
    this.GetSelections();
//     this.route.queryParams.subscribe(async params => {
//       this.userDetailId = +params['salesAgent'] || 0;

//       // redirect if userDetailId is null or undefined
//       if (!this.userDetailId) {
//         this.router.navigate(['/sales-agent/'])
//   }
// });
  }
  todo = [
  ];

  SelectedColumns :Columns[] =[];


  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      


    } else {
      
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
                        console.log(event.previousIndex);
            this.SelectedColumns[ event.currentIndex].selectedToDisplay=true;
    }
  }

  formatDate(res):Date {
    var date = new Date(`${res} UTC`);
    return date
  }
  endDateFilterChange(event:any)
  {
    var date = this.formatDate(event.value);
    this.dateAndFilters.controls.end.setValue(date.toISOString());
   console.log("endDateFilterChange",event.value)
  }
  startDateFilterChange(event:any)
  {
    var date = this.formatDate(event.value);
    this.dateAndFilters.controls.start.setValue(date.toISOString());
   console.log("startDateFilterChange",event.value)
  }
  UpdateSelected(){
    
    let  data = { columns:this.SelectedColumns};
    this._salesAgentService.SaveSelection(data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success("Selection Saved Successfully!")
      }
      else{
        this.alert.error("Internal Server Error")
      }
    })

  }
  GetSelections(){
    this._salesAgentService.StatementConfig().subscribe(res=>{
      if(res.isSuccessfull){
        this.SelectedColumns=res.dynamicResult.columns as Columns[];
        let selectedCols = this.SelectedColumns.map(x=>x.columnName);
        let filteredCols = this.columnsToDisplay.filter(itemDp=> !selectedCols.includes(itemDp.columnName));
        console.log(selectedCols,filteredCols);
        this.columnsToDisplay=filteredCols;
      }
    })
  }
  autoSelect(){
    this.columnsToDisplay=[];
    this.SelectedColumns=columns;
  }
  autoArrange(){
    this.SelectedColumns.sort(function(a, b) {
      return a.index - b.index;
    });
  }
  reset(){
    this.SelectedColumns=[];
    this.columnsToDisplay=columns;
  }

  search(){
    this.loading=true;
    var data = this.dateAndFilters.value as SearchAndFilter;
    data.AccountId=this.entity.defaultAccountId;
    this.statement=[];
    this._salesAgentService.SearchAndFilter(data).subscribe(res=>{
      if((res.dynamicResult as  AccountsReceviableReport).statement.length>0){
        this.report=res.dynamicResult as AccountsReceviableReport;
        this.statement=(res.dynamicResult as AccountsReceviableReport).statement;
                    this.report=res.dynamicResult as AccountsReceviableReport;
        this.statement=(res.dynamicResult as AccountsReceviableReport).statement;
     
   
      }
      else{
        this.statement=[];
      }
    
    })
    this.loading=false;
  }
}
