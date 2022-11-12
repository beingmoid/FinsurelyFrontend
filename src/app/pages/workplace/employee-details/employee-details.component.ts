import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { EmployeeService } from 'src/app/services/APIServices/employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  empSubject:Subscription;

  empObserverSubject:Subject<UserDetailDTO> = new Subject();
  empId:number=0;
  userId="";
  empDetails:UserDetailDTO;
  constructor(private route:ActivatedRoute,
    private router:Router,
    private service:EmployeeService
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.empId = +params['id'] || 0;

      // redirect if userDetailId is null or undefined
      if (!this.empId) {
        this.router.navigate(['/workplace'])
      } else {
        // 
        this.empSubject= await this.service.GetCustomerDetail(this.empId).subscribe(res=>{
        if(res.isSuccessfull){
          this.empDetails=res.dynamicResult as UserDetailDTO;
          this.userId=this.empDetails.userId;
          this.empObserverSubject.next(this.empDetails);

          console.log(res.dynamicResult);
        }
      });

      }
    });
  }

}
