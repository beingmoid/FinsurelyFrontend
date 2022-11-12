import { Component, OnInit } from '@angular/core';
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

  constructor(private service:BranchService,
    private sharedService:SharedService,private alert:AlertService) {

      this.sharedService.closeBranchModal.subscribe(res=>{
        this.service.GetBranch();
      });


     }
  pageSize=20;
  search:string;

  listData:Branch[];
  ngOnInit(): void {
    this.service.branchObserver$.subscribe(res=>{

      this.listData=res;

    });
    this.service.GetBranch();
  }

  showModal(){
    this.sharedService.openBranchModal.next(true);
  }
  filter(){

  }
editBranch(data:Branch){
this.sharedService.openBranchModalWithData.next(data);
}
deleteBranch(data){
  this.alert.confirm("Deleting branch would delete all data related to branch? Do you want to continue?").then(res=>{
    if(res.isConfirmed){
      this.service.DeleteBranch(data.id).subscribe(res=>{
        if(res.isSuccessfull){
          this.alert.success("Deleted successfully!")
          this.service.GetBranch();
        }
        else{
          this.alert.error("Internal Server Error!")
        }
      })
    }
  })
 
}
}
