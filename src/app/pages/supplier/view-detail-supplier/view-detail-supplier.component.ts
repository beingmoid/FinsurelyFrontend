import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { SalesInvoice, Transactions } from 'src/app/models/TransactionsDTO';
import { Address, PaymentAndBilling, UserDetailDTO } from 'src/app/models/userDTO';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { InsuranceCompanyService } from 'src/app/services/APIServices/insurance-company.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SupplierService } from 'src/app/services/APIServices/supplier.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-view-detail-supplier',
  templateUrl: './view-detail-supplier.component.html',
  styleUrls: ['./view-detail-supplier.component.scss']
})
export class ViewDetailSupplierComponent implements OnInit {

  isVisible: boolean;
  userDetailId = 0;
  customerDetail:UserDetailDTO;
  address:Address;
  paymentAndBilling:PaymentAndBilling;
  paymentDue:number;
  cardLoading:boolean;
  pageSize=10;
  fullName:string;
  listData:SalesInvoice[]=[];
  isEditMode=true;
  userId:string;
  customerSubject:Subscription;
  customerObserverSubject:Subject<UserDetailDTO> = new Subject();
  constructor(private _router: Router,
    private _sharedService:SharedService,
    private route: ActivatedRoute,
    private service:SupplierService,) { 
      _sharedService.formSubmited.subscribe(async x=> {
        this.isVisible=false;
        await this.service.GetSaleAgentDetail(this.userDetailId).subscribe(res=>{
          if(res.isSuccessfull){
            this.customerDetail=res.dynamicResult as UserDetailDTO;
            this.listData=this.customerDetail.salesInvoicePersons;
            this.userId=this.customerDetail.userId;
            this.customerObserverSubject.next(this.customerDetail);
            this.paymentAndBilling=this.customerDetail.paymentAndBilling[0];
            this.address=this.customerDetail.addresses[0];
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
      })
      
    }

 async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      this.userDetailId = +params['salesAgent'] || 0;

      // redirect if userDetailId is null or undefined
      if (!this.userDetailId) {
        this._router.navigate(['/sales-agent'])
      } else {
        // 
    
         await this.service.GetSaleAgentDetail(this.userDetailId).subscribe(res=>{
        if(res.isSuccessfull){
          this.customerDetail=res.dynamicResult as UserDetailDTO;
          this.listData=this.customerDetail.salesInvoicePersons;
          this.paymentDue=this.listData.reduce((acc,val)=>{
            return acc+val.total
          },0);
          this.userId=this.customerDetail.userId;
          this.customerObserverSubject.next(this.customerDetail);
          console.log('r',res.dynamicResult);
          this.fullName=this.customerDetail.title+" "+this.customerDetail.firstName+" "+this.customerDetail.middleName+" "+this.customerDetail.lastName;
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
