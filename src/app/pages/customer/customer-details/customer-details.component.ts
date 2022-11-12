import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { SalesInvoice, Transactions } from 'src/app/models/TransactionsDTO';
import { Address, UserDetailDTO } from 'src/app/models/userDTO';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  isVisible: boolean;
  userDetailId = 0;
  customerDetail:UserDetailDTO;
  address:Address;

  cardLoading:boolean;
  pageSize=10;
  fullName:string;
  listData:SalesInvoice[]=[];
  isEditMode=true;
  userId:string;
  customerSubject:Subscription;
  customerObserverSubject:Subject<UserDetailDTO> = new Subject();
  totalSpending: number=0;
  constructor(private _router: Router,
    private _sharedService:SharedService,
    private route: ActivatedRoute,
    private service:CustomerService,) { 
      _sharedService.formSubmited.subscribe(async x=> {
        this.isVisible=false;
        await this.service.GetCustomerDetail(this.userDetailId).subscribe(res=>{
          if(res.isSuccessfull){
            this.customerDetail=res.dynamicResult as UserDetailDTO;
            this.userId=this.customerDetail.userId;
            this.customerObserverSubject.next(this.customerDetail);
            console.log(res.dynamicResult);
            this.fullName=this.customerDetail.title+" "+this.customerDetail.firstName+" "+this.customerDetail.middleName+" "+this.customerDetail.lastName;
          }
          else{
            console.log('failed fetching');
          }
  
         });
      })
      
    }

 async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      this.userDetailId = +params['customerId'] || 0;

      // redirect if userDetailId is null or undefined
      if (!this.userDetailId) {
        this._router.navigate(['/customer'])
      } else {
        // 
        this.customerSubject= await this.service.GetCustomerDetail(this.userDetailId).subscribe(res=>{
        if(res.isSuccessfull){
          this.customerDetail=res.dynamicResult as UserDetailDTO;
          this.userId=this.customerDetail.userId;
          this.customerObserverSubject.next(this.customerDetail);
          this.listData=this.customerDetail.customerSalesInvoice;
          this.totalSpending= this.listData.reduce((acc,val)=>{
            return acc+(val?.saleLineItem[0].total+val?.saleLineItem[0].vat);
          },0)
          console.log(res.dynamicResult);
          if(this.customerDetail.firstName && this.customerDetail.lastName){
            if(this.customerDetail.title){
              this.fullName=this.customerDetail.title+". "+this.customerDetail.firstName+" "+this.customerDetail.lastName;
            }
            else {
              this.fullName=this.customerDetail.firstName+" "+this.customerDetail.lastName;
            }
        
          }
          else if(this.customerDetail.firstName && this.customerDetail.middleName && this.customerDetail.lastName){
            if(this.customerDetail.title){
              this.fullName=this.customerDetail.title +" "+this.customerDetail.firstName+" "+this.customerDetail.middleName+" "+this.customerDetail.lastName;;
            }
            else {
              this.fullName=this.customerDetail.firstName+" "+this.customerDetail.middleName+" "+this.customerDetail.lastName;;
            }
          }
          else if(this.customerDetail.firstName && this.customerDetail.middleName){
            if(this.customerDetail.title){
              this.fullName=this.customerDetail.title +" "+this.customerDetail.firstName+" "+this.customerDetail.middleName;
            }
            else {
              this.fullName=this.customerDetail.firstName+" "+this.customerDetail.middleName;
            }
          }
          else if(this.customerDetail.firstName)
          {
            if(this.customerDetail.title){
              this.fullName=this.customerDetail.title +" "+this.customerDetail.firstName;
            }
            else {
              this.fullName=this.customerDetail.firstName;
            }
          }
          else if(this.customerDetail.middleName)
          {
            if(this.customerDetail.title){
              this.fullName=this.customerDetail.title +" "+this.customerDetail.middleName;
            }
            else {
              this.fullName=this.customerDetail.middleName;
            }
          }
          else if(this.customerDetail.lastName)
          {
            if(this.customerDetail.title){
              this.fullName=this.customerDetail.title +" "+this.customerDetail.lastName;
            }
            else {
              this.fullName=this.customerDetail.lastName;
            }
          }
          else{
            this.fullName=this.customerDetail.displayNameAs;
          }
        }
        else{
          console.log('failed fetching');
        }

       });
      }

    });

  }
  editDetail(){
    console.log('working');
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false
  }
}
