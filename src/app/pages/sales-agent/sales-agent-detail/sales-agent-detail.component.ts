import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { table } from 'console';
import jsPDF from 'jspdf';
import { formatDate } from "@angular/common";
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, startWith } from 'rxjs/operators';
import { AccountsReceviableReport, Statement } from 'src/app/models/accountDTO';
import { BaseResponse } from 'src/app/models/IApiResponse';
import { Reconcilation } from 'src/app/models/reconcilationReportDTO';
import { Recon, ReconData } from 'src/app/models/reconData';
import { SalesInvoice, Transactions } from 'src/app/models/TransactionsDTO';
import { Address, PaymentAndBilling, UserDetailDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SalesService } from 'src/app/services/APIServices/sales.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import autoTable from 'jspdf-autotable'
export class SearchAndFilter {
  start:Date
  end:Date
  sortBy:string
  AccountId:number;
}
@Component({
  selector: 'app-sales-agent-detail',
  templateUrl: './sales-agent-detail.component.html',
  styleUrls: ['./sales-agent-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SalesAgentDetailComponent implements OnInit {
  isVisible: boolean;
  userDetailId = 0;
  customerDetail:UserDetailDTO;
  address:Address;
  paymentAndBilling:PaymentAndBilling;
  paymentDue:number;
  cardLoading:boolean;
  page:number;
  totalPages:number;
  pageSize=10;
  fullName:string;
  listData:SalesInvoice[]=[];
  report:AccountsReceviableReport;
  statement:Statement[]=[];
  salesAgents:UserDetailDTO[]=[];
  filtersalesAgents:Observable<UserDetailDTO[]>;
  SearchForm:FormGroup;
  isEditMode=true;
  displayModal=false;
  userId:string;
  documentId:number;
  reconModal=false;
  reconcilationData:Subject<Reconcilation>= null;
  openingBalance:any;
  customerSubject:Subscription;
  dateStatus='';
  salesAgentStatus='';
  uploadUrl=environment.api_url+"api/SalesInvoice/UploadExcel";
  customerObserverSubject:Subject<UserDetailDTO> = new Subject();
  fileUrl:Subject<string> = new Subject();
  Agent:Subject<UserDetailDTO> =  new Subject();
  reconData:ReconData[];
  dateAndFilters:FormGroup;
  reconcilationReport:Reconcilation;
  ReconReport=false;
  includeLogo:boolean=true;
  includeName:boolean=true;
  entity:UserDetailDTO;
  _data:Reconcilation;
  constructor(private _router: Router,
    private fb:FormBuilder,
    private _sharedService:SharedService,

    private alert:AlertService,
    private route: ActivatedRoute,
    private service:SalesAgentService,
    ) {

      this.SearchForm=this.fb.group({
        from:[null,Validators.required],
        to:[null,Validators.required],
        salesAgentId:[null,Validators.required],
        documentId:[null,Validators.required],
        isFileUploaded:[null,Validators.required],
        isColumMapped:[null,Validators.required],
      });
      this.dateAndFilters=this.fb.group({
        start:[null,Validators.required],
        end:[null,Validators.required],
        sortBy:[null]
      })
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




          }
          else{
            console.log('failed fetching');
          }

         });

      });
      _sharedService.reconData.subscribe(res=>{
        this.reconData=res;
        console.log('Recon',this.reconData)
        this.SearchForm.controls.isColumMapped.setValue(true);
        this.reconModal=false;
       });


    }
    get f(){return this.SearchForm.controls }
    index = 0;
    disable = false;
    onIndexChange(index: number): void {
      this.index = index;
    }

    loading=false;


  openModal(){
    this._sharedService.paymentForm.next(null);
  }
  reconHandleCancel(){
    this.reconModal=false;
  }


  navigateWithState() {
    var data ={
      params:JSON.stringify(this.customerDetail)}
    this._router.navigateByUrl('/sales-agent/statement', { state:data });
  }
  statementList:any[];

  async FetchStatement($event)
  {
    console.log($event)
    this.service.GetSalesAgentStatement(this.userDetailId,this.page,this.pageSize).subscribe(async res=>{
      if((await res))
        this.statementList=res.dynamicResult.data;
        this.totalPages=res.dynamicResult.totalPages;
        
        console.log('Logger',res);
      });
  }
 async ngOnInit(): Promise<void> {
   this._sharedService.formSubmited.subscribe(res=>{

     this.service.GetSaleAgentDetail(this.userDetailId).subscribe(async res=>{
      if(res.isSuccessfull){
        this.customerDetail=res.dynamicResult as UserDetailDTO;

        this.listData=this.customerDetail.salesInvoicePersons;
        this.Agent.next(res.dynamicResult as UserDetailDTO);
        (await this.service.GetReceviableStatementReport(res.dynamicResult.defaultAccountId)).subscribe(res=>{
          if(res.dynamicResult){
            console.log(res.dynamicResult)
           this.report=res.dynamicResult as AccountsReceviableReport;
           this.statement=(res.dynamicResult as AccountsReceviableReport).statement;
           this.paymentDue=this.report.totalBalance;
           this.SearchForm.controls.salesAgentId.setValue(this.customerDetail.id);
          }


        });
        this.userId=this.customerDetail.userId;

        this.customerObserverSubject.next(this.customerDetail);
        console.log('r',res.dynamicResult);
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
    this.route.queryParams.subscribe(async params => {
      this.userDetailId = +params['salesAgent'] || 0;
      this.openingBalance=+params['agentBalance']

      // redirect if userDetailId is null or undefined
      if (!this.userDetailId) {
        this._router.navigate(['/sales-agent'])
      } else {
        
        this.page=10;
        this.service.GetSalesAgentStatement(this.userDetailId,this.page,this.pageSize).subscribe(async res=>{
          if((await res))
            this.statementList=res.dynamicResult.data;
            this.totalPages=res.dynamicResult.totalPages;
            
            console.log('Logger',res);
          });
        
        
         await this.service.GetSaleAgentDetail(this.userDetailId).subscribe(async res=>{
        if(res.isSuccessfull){
          this.customerDetail=res.dynamicResult as UserDetailDTO;

          this.listData=this.customerDetail.salesInvoicePersons;
          this.Agent.next(res.dynamicResult as UserDetailDTO);
          (await this.service.GetReceviableStatementReport(res.dynamicResult.defaultAccountId)).subscribe(res=>{
            if(res.dynamicResult){
              console.log(res.dynamicResult)
             this.report=res.dynamicResult as AccountsReceviableReport;
             this.statement=(res.dynamicResult as AccountsReceviableReport).statement;
             this.paymentDue=this.report.totalBalance;
             this.SearchForm.controls.salesAgentId.setValue(this.customerDetail.id);
            }


          });
          this.userId=this.customerDetail.userId;

          this.customerObserverSubject.next(this.customerDetail);
          console.log('r',res.dynamicResult);
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

       this.service.salesAgentSelectListObserver$.subscribe(res=>{
        this.salesAgents=res;
      });
      this.service.GetSalesAgents();
       this.filtersalesAgents= this.SearchForm.controls.salesAgentId.valueChanges.pipe(

        startWith(''),
          map(value => typeof value === 'string' ? value : value),
        map(address => address ? this._filterSalesAgent(address) : this.salesAgents?.slice())

      );

      }

    });

  }

  search(){
    this.loading=true;
    var data = this.dateAndFilters.value as SearchAndFilter;
    data.AccountId=this.customerDetail.defaultAccountId;
    this.statement=[];
    this.service.SearchAndFilter(data).subscribe(res=>{
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
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      if(info.file.response){
        var response = info.file.response as BaseResponse;
        this.documentId=response.dynamicResult?.id;
        this.fileUrl.next(response.dynamicResult?.blobURI);
        this.SearchForm.controls.isFileUploaded.setValue(true);
        this.SearchForm.controls.documentId.setValue(this.documentId);

      }
    } else if (info.file.status === 'error') {
      this.alert.error(`${info.file.name} file upload failed.`);
    }
  }
  formatDate(res) {
    var date = new Date(`${res} UTC`);
    return date
  }
  startChange(event:any)
  {
    if(event.value){
      console.log('moid chal raha h ')
      const date = this.formatDate(event.value);
      this.SearchForm.controls.from.setValue(date.toISOString());
     console.log("startChange",event.value)
    }

  }
  endChange(event:any)
  {
    if(event.value){
      const date = this.formatDate(event.value);
      this.SearchForm.controls.to.setValue(date.toISOString());
     console.log("endChange",event.value)
    }

  }
  endDateFilterChange(event:any)
  {
    if(event.value){
      var date = this.formatDate(event.value);
      this.dateAndFilters.controls.end.setValue(date.toUTCString());
    }

  }
  startDateFilterChange(event:any)
  {
    if(event.value){
    var date = this.formatDate(event.value);
    this.dateAndFilters.controls.start.setValue(date.toUTCString());
   console.log("startDateFilterChange",event.value)
    }
  }

  editDetail(){
    console.log('working');
    this.customerObserverSubject.next(this.customerDetail);
    this.isVisible = true;

  }
  openReconModal(){
    this.reconModal=true;
  }
  handleCancel() {
    this.isVisible = false
  }

  displaySalesAgent(id) {

    if(this.salesAgents && id){
      return this.salesAgents.find(x=>x.id===id).displayNameAs;
    }
    // return this.insuranceCompanys? this.insuranceCompanys.filter(x=>x.id==id).displayNameAs:undefined;
  }
  private _filterSalesAgent(value: string) {
    return this.salesAgents? this.salesAgents?.filter(option => option.displayNameAs?.toLowerCase().includes(value?value.toString().toLowerCase():"")):[];
  }
  submitReconcilation(){
  var data = this.SearchForm.value as Recon;

    data.reconData=this.reconData;
    localStorage.setItem(data.salesAgentId.toString(),JSON.stringify(data));
    this.service.Process(data).subscribe(res=>{
      if(res.isSuccessfull){
        this.ReconReport=true;
        this.reconcilationReport= res.dynamicResult as Reconcilation;
        // this.reconcilationData.next(res.dynamicResult as Reconcilation);
        this._data=(res.dynamicResult as Reconcilation);

        console.log(res.dynamicResult);
      }


    })

  }
  header = [['Date', 'Name', 'Policy#','Company','Insurance Type',
    'Make & Model', 'Tran Ref #', 'Debit','Credit','Balance']];
  tableData=[];

  DownloadPDF()
  {
    var options:Intl.DateTimeFormatOptions = { localeMatcher:'best fit', year: '2-digit', month: 'long', day: '2-digit' };
    var pdf = new jsPDF('landscape','px');
    this.statement.forEach(x=>{
      let datetoday = formatDate(x.date,'mediumDate','en-AE').toString();
      this.tableData.push([
       datetoday,x.name,x.policyNumber,x.company,
       x.insuranceType,x.vehicle,x.transactionRefNumber,x.debit,x.credit,x.balance])
      }
    );
    var img = new Image();
    img.src = 'assets/images/logo.png';

    var customer = "Accounts Statement to : "+ this.customerDetail.displayNameAs;

    autoTable(pdf, {
      head: this.header,
    body: this.tableData,
    theme:'striped',

    // didDrawPage: function(data) {
    //   // Header

    //   pdf.setFontSize(20);
    //   pdf.setTextColor(85);
    //   pdf.text(customer,50, -5 );
    //    pdf.addImage(img, 'png', 230,-5 , 150, 100,'SLOW');
    //   pdf.setFontSize(20);
    //   pdf.setTextColor(85);
    //   pdf.setFont('poppins');




    //   // Footer
    //   var str = "Page " + pdf.internal.pages
    //   // Total page number plugin only available in jspdf v1.0+
    //   if (typeof pdf.putTotalPages === 'function') {
    //     str = str + " of " + pdf.internal.pages;
    //   }
    //   pdf.setFontSize(10);

    //   // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    //   var pageSize = pdf.internal.pageSize;
    //   var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    //   // pdf.text(str, data.settings.margin.left, pageHeight - 10);
    // },

    // margin: {
    //   top: 200,
    //   bottom:50,
    //   right:20,
    //   left:20
    // }




    // styles: { fillColor: [0, 0, 51] },

    // didDrawCell: data => {
    //     console.log(data.column.index)
    //   data.cell.width=15;
    // }
    });




    // // Open PDF document in browser's new tab
    // pdf.output('dataurlnewwindow')

    // Download PDF doc
    pdf.save(`${this.customerDetail.displayNameAs+Date.now()}.pdf`);
  }
  DownloadXCL(){

  }

}
