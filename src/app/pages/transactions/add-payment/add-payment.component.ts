import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AccountDTO } from 'src/app/models/accountDTO';
import { OpenBalanceDTO } from 'src/app/models/OpenBalanceDTO';
import { PaymentMethod } from 'src/app/models/preferredPaymentMethodDTO';
import { UserDetailDTO } from 'src/app/models/userDTO';
import { PaymentService } from 'src/app/services/APIServices/payment-service.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SalesService } from 'src/app/services/APIServices/sales.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Payment } from 'src/app/models/refundDTO';
import { AlertService } from 'src/app/services/alert.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;
  @Input() paymentDataSubject?: Subject<Payment> = new Subject<Payment>();
  isVisiblePayment=false;
  isEditModePayment=false;
  isLoading=false;
   salesAgents:UserDetailDTO[]=[];
   filtersalesAgents:Observable<UserDetailDTO[]>
   accounts:AccountDTO[]=[];
   filterAccounts:Observable<AccountDTO[]>
  PaymentForm:FormGroup;
  paymentMethod:PaymentMethod[];
  openBalance:OpenBalanceDTO= {
    openBalance:0
  };
  isTableLoading=false;
  BeforeSave=true;
  PaymentId:number;
  Payment:Payment;

  constructor(private fb:FormBuilder,
    private SalesAgentService:SalesAgentService,
    private service:SalesService,
    private paymentService:PaymentService,
    private alert:AlertService,
    private sharedService:SharedService
    ) {
    this.PaymentForm=this.fb.group({
      salesAgentId:[null,Validators.required],
      memo:[null],
      email:[null],
      paymentDate:[null,Validators.required],
      paymentMethodId:[null,Validators.required],
      transactionReferenceNumber:[null,Validators.required],
      depositAccountId:[null,Validators.required],
      amount:[null,Validators.required]
    });

   }
  async ngOnInit(): Promise<void> {
    this.SalesAgentService.salesAgentSelectListObserver$.subscribe(res=>{
      this.salesAgents=res;
    });
    await  this.SalesAgentService.GetSalesAgents();
    this.service.paymentMethodObserver$.subscribe(res=>{
      this.paymentMethod=res;
    });
    await  this.paymentService.GetAssetAccounts().subscribe(res=>{
      if(res.isSuccessfull){
        this.accounts=res.dynamicResult as AccountDTO[];
      }
    });
    await this.service.paymentMethodObserver$.subscribe(res=>{
      this.paymentMethod=res;
    });
    await this.service.GetPaymentMethod();
   

    
   

    this.filterAccounts= this.PaymentForm.controls.depositAccountId.valueChanges.pipe(
    
      startWith(''),
        map(value => typeof value === 'string' ? value : value),
      map(address => address ? this._filterAccounts(address) : this.accounts?.slice())
  
    );
 
    this.filtersalesAgents= this.PaymentForm.controls.salesAgentId.valueChanges.pipe(

      startWith(''),
        map(value => typeof value === 'string' ? value : value),
      map(address => address ? this._filterSalesAgent(address) : this.salesAgents?.slice())
  
    );

   this.sharedService.paymentForm.subscribe(res=>{
    this.isVisiblePayment=true;
  

      if(res){
       this.isEditModePayment=true;
            console.log(res)
            this.Payment= res as Payment;
            this.PaymentId=res.id;
            const { salesAgentId ,memo,paymentDate,paymentMethodId,transactionReferenceNumber,depositAccountId,email,
              amount }= res;
            this.PaymentForm.setValue({salesAgentId:salesAgentId,memo:memo,paymentDate:paymentDate,paymentMethodId:paymentMethodId,transactionReferenceNumber:transactionReferenceNumber,depositAccountId:depositAccountId,amount:amount,email:email});

            this.SalesAgentService.GetCurrentBalance(salesAgentId).subscribe(res=> {
              if(res.dynamicResult){
                this.openBalance= res.dynamicResult as OpenBalanceDTO;
               
              }
             });
       
      }
      else{
        this.PaymentForm.controls.amount.setValue(0.00)
  
    
      }

   });
  
    }
  

    
     

 
  
 
 getOpenBalance(event){
  console.log(event);
   this.SalesAgentService.GetCurrentBalance(event.option.value).subscribe(res=> {
    if(res.dynamicResult){
      this.openBalance= res.dynamicResult as OpenBalanceDTO;
     
    }
   });
}
  private _filterSalesAgent(value: string) {
    return this.salesAgents? this.salesAgents?.filter(option => option.displayNameAs?.toLowerCase().includes(value?value.toString().toLowerCase():"")):[];
  }
  private _filterAccounts(value: string) {
    return this.accounts? this.accounts?.filter(option => option.name?.toLowerCase().includes(value?value.toString().toLowerCase():"")):[];
  }

  displaySalesAgent(id) {

    if(this.salesAgents && id){
      return this.salesAgents.find(x=>x.id===id).displayNameAs;
    }
  }
  displayAccounts(id) {
   
    if(this.accounts && id){
     var name = this.accounts.find(x=>x.id===id)?.name;
     return name;
    }
  }
  displayPaymentMethod(id) {

    if(this.paymentMethod && id){
      return this.paymentMethod.find(x=>x.id===id).name;
    }
  }

  formatDate(res) {
    var date = new Date(`${res} UTC`);
    return date
  }
  startChange(event:any)
  {
    var date = this.formatDate(event.value);
    this.PaymentForm.controls.paymentDate.setValue(date.toISOString());
   console.log("startChange",event.value)
  }

  downloadFile() {
   
    const data = document.getElementById('inv');
    html2canvas(this.canvas.nativeElement,{scale:2}).then(canvas => {
      const img = canvas.toDataURL('image/jpg');
      var pdf = new jsPDF({
            orientation: 'l', // landscape
            unit: 'pt', // points, pixels won't work properly
            format: [canvas.width, canvas.height-10] // set needed dimensions for any element
      });
      pdf.addImage(img, 'JPEG', 0, 0, canvas.width, canvas.height-10);
      const fileName= this.displaySalesAgent(this.PaymentForm.controls.salesAgentId.value)+Date.now().toString()+".pdf";
      pdf.save(fileName);
    });
  }
  handlePaymentCancel(){
    this.isVisiblePayment=false;
    this.sharedService.closeForm.next(new Subject());
  }
  submitForm(form:FormGroupDirective){
   
    var data = this.PaymentForm.value as Payment;
    this.isLoading=true;
    if(this.PaymentId){
      this.updatePaymentReceipt(data,form);

    }
    else{
      this.savePaymentReceipt(data,form);
    }
  }
  savePaymentReceipt(data:Payment,form:FormGroupDirective){
    data.id=0;
    this.paymentService.CreatePayment(data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success("Payment Receipt saved successfully");
        this.sharedService.formSubmited.next(true)
        this.isLoading=false;
        this.BeforeSave=false;
      }
    });
  }
  updatePaymentReceipt(data:Payment,form:FormGroupDirective){
    data.id=this.PaymentId;
    this.paymentService.UpdatePayment(this.PaymentId,data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success("Payment Receipt updated successfully");
        this.sharedService.formSubmited.next(true)
        this.isLoading=false;
        this.BeforeSave=false;
      }
    });
  }

}

