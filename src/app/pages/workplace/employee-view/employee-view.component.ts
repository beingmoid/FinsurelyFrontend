import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeDetails } from 'src/app/models/employeeDetailDto';
import { Address, UserDetailDTO } from 'src/app/models/userDTO';
import { EmployeeService } from 'src/app/services/APIServices/employee.service';
interface ItemData {
  href: string;
  title: string;
  avatar: string;
  description: string;
  content: string;
}
@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.scss']
})
export class EmployeeViewComponent implements OnInit {

  dataloading=false;
  listData:UserDetailDTO[];
  search:string;
  isVisible=false;
  address:Address;
  completedTaskPercentage=0;
  pendingTaskPercentage=0;
  inprocessTaskPercentage=0;
  constructor(private empService:EmployeeService,private _router:Router) { }

  ngOnInit(): void {
    this.empService.customerObserver$.subscribe(res=>{
      if(res){
        this.listData=res;
        
        this.listData.forEach((value:UserDetailDTO,index:number,arr:UserDetailDTO[])=>{
          let totalTask = value.assignedTask.length;
          let completedTask = value.assignedTask.filter(x=>x.status.name==="completed").length;
          let pendingTask = value.assignedTask.filter(x=>x.status.name==="pending").length;
          let inprocess = value.assignedTask.filter(x=>x.status.name==="inprocess").length;
          let completedTaskPercent = ( completedTask/totalTask) * 100;
          let pendingTaskPercent = ( pendingTask/totalTask) * 100;
          let inprocessTaskPercent = ( inprocess/totalTask) * 100;
          value.completedTaskPercentage=parseInt(completedTaskPercent.toFixed(0));
           value.completedTaskStatus= value.completedTaskPercentage<50?"exception":"active"
          value.pendingTaskPercentage=parseInt(pendingTaskPercent.toFixed(0));
          value.pendingTaskStatus= value.pendingTaskPercentage<50?"exception":"active"
          value.inprocessTaskPercentage= parseInt(inprocessTaskPercent.toFixed(0));
          value.inprocessTaskStatus= value.inprocessTaskPercentage<50?"exception":"active"

        });
      }
    });
  this.empService.GetAllEmployees();
  }
  filter(){

  }
  showModal(){
    this.isVisible=true;
  }
  handleCancel(){
    this.isVisible=false;
  }
  ViewDetail(id:number){

    if (id) {
      this._router.navigate(['workplace/employee'], { queryParams: { id: id } })
    }
  }



}
