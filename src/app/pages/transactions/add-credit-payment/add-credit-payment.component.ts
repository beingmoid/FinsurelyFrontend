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
import { InsuranceCompanyService } from 'src/app/services/APIServices/insurance-company.service';
import { PaymentCreditService } from 'src/app/services/APIServices/payment-credit.service';
import { SharedService } from 'src/app/services/shared.service';
@Component({
  selector: 'app-add-credit-payment',
  templateUrl: './add-credit-payment.component.html',
  styleUrls: ['./add-credit-payment.component.scss']
})
export class AddCreditPaymentComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;

  isVisiblePayment=false;
  isEditModePayment=false;
  isLoading=false;
   salesAgents:UserDetailDTO[]=[];
   filtersalesAgents:Observable<UserDetailDTO[]>
   insuranceCompanys:UserDetailDTO[]=[];
   filteredInsuranceCompanies:Observable<UserDetailDTO[]>;
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
    private service:SalesService,
    private insuranceCompanyService:InsuranceCompanyService,
    private paymentService:PaymentService,
    private alert:AlertService,
    private sharedService:SharedService
    ) {
    this.PaymentForm=this.fb.group({
      insuranceCompanyId:[null,Validators.required],
      email:[null],
      paymentDate:[null,Validators.required],
      paymentMethodId:[null,Validators.required],
      transactionReferenceNumber:[null,Validators.required],
      creditAccountId:[null,Validators.required],
      amount:[null,Validators.required]
    });
    this.sharedService.PaymentcloseForm.subscribe(res=>{
      this.isVisiblePayment=false;
    })

   }
 async ngOnInit(): Promise<void> {

    this.insuranceCompanyService.salesAgentSelectListObserver$.subscribe(res=>{
      if(res){
        this.insuranceCompanys=res;
        console.log(res)
      }
       
    });
    await  this.insuranceCompanyService.GetSalesAgents();
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
   

    
   

    this.filterAccounts= this.PaymentForm.controls.creditAccountId.valueChanges.pipe(
    
      startWith(''),
        map(value => typeof value === 'string' ? value : value),
      map(address => address ? this._filterAccounts(address) : this.accounts?.slice())
  
    );
 
    this.filteredInsuranceCompanies= this.PaymentForm.controls.insuranceCompanyId.valueChanges.pipe(

      startWith(''),
        map(value => typeof value === 'string' ? value : value),
      map(address => address ? this._filterInsuranceCompany(address) : this.insuranceCompanys?.slice())
  
    );

   this.sharedService.sentPaymentForm.subscribe(res=>{
    this.isVisiblePayment=true;
  

      if(res){
        console.log('sent payment',res)
       this.isEditModePayment=true;
            console.log(res)
            this.Payment= res as Payment;
            this.PaymentId=res.id;
            const { insuranceCompanyId ,paymentDate,paymentMethodId,transactionReferenceNumber,creditAccountId,email,
              amount }= res;
            this.PaymentForm.setValue({
              insuranceCompanyId:insuranceCompanyId,
              paymentDate:paymentDate,
              paymentMethodId:paymentMethodId,
              transactionReferenceNumber:transactionReferenceNumber,
              creditAccountId:creditAccountId,
              amount:amount,
              email:email});

            this.insuranceCompanyService.GetCurrentBalance(insuranceCompanyId).subscribe(res=> {
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
   this.insuranceCompanyService.GetCurrentBalance(event.option.value).subscribe(res=> {
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
  private _filterInsuranceCompany(value: string) {
    return this.insuranceCompanys? this.insuranceCompanys?.filter(option => option.displayNameAs?.toLowerCase().includes(value?value.toLowerCase():"")):[];
  }

  displaySalesAgent(id) {

    if(this.salesAgents && id){
      return this.salesAgents.find(x=>x.id===id).displayNameAs;
    }
  }
  displayAccounts(id) {

    if(this.accounts && id){
      return this.accounts.find(x=>x.id===id).name;
    }
  }
  displayPaymentMethod(id) {

    if(this.paymentMethod && id){
      return this.paymentMethod.find(x=>x.id===id).name;
    }
  }
  displayCompanyFn(id) {

    if(this.insuranceCompanys && id){
      return this.insuranceCompanys.find(x=>x.id===id).displayNameAs
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
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
    this.sharedService.PaymentcloseForm.next(new Subject());
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
    this.paymentService.SendPayment(data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success("Payment Receipt saved successfully");
        this.sharedService.formSubmited.next(true)
        this.isLoading=false;
        this.BeforeSave=false;
        form.resetForm();
      }
    });
  }
  updatePaymentReceipt(data:Payment,form:FormGroupDirective){
    data.id=this.PaymentId;
    this.paymentService.UpdateSentPayment(this.PaymentId,data).subscribe(res=>{
      if(res.isSuccessfull){
        this.alert.success("Payment Receipt updated successfully");
        this.sharedService.formSubmited.next(true)
        this.isLoading=false;
        this.BeforeSave=false;
        form.resetForm();
      }
    });
  }
}
