import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { AccountsReceviableReport, Statement } from 'src/app/models/accountDTO';
import { SalesInvoice, Transactions } from 'src/app/models/TransactionsDTO';
import { Address, ComissionRates, PaymentAndBilling, UserDetailDTO } from 'src/app/models/userDTO';
import { AlertService } from 'src/app/services/alert.service';
import { CustomerService } from 'src/app/services/APIServices/customer.service';
import { InsuranceCompanyService } from 'src/app/services/APIServices/insurance-company.service';
import { SalesAgentService } from 'src/app/services/APIServices/sales-agent.service';
import { SharedService } from 'src/app/services/shared.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { formatDate } from "@angular/common";
import { NzTableQueryParams } from 'ng-zorro-antd';
import { PaginationParams } from 'src/app/models/paginatedResponse';

@Component({
  selector: 'app-view-detail-insurance-company',
  templateUrl: './view-detail-insurance-company.component.html',
  styleUrls: ['./view-detail-insurance-company.component.scss']

})
export class ViewDetailInsuranceCompanyComponent implements OnInit {

  isVisible: boolean;
  userDetailId = 0;
  customerDetail: UserDetailDTO;
  address: Address;
  paymentAndBilling: PaymentAndBilling;
  paymentDue: number;
  cardLoading: boolean;
  page = 1;
  totalPages: number;
  pageSize = 10;
  fullName: string;
  listData: SalesInvoice[] = [];
  comissions: ComissionRates[] = [];
  isEditMode = true;
  userId: string;
  customerSubject: Subscription;
  form: FormGroup;
  form2: FormGroup;
  tpl: string;
  nonTpl: string;
  openingBalance: number;
  totalCount = undefined;
  isloading=false;
  params: PaginationParams<number> = new PaginationParams<number>();
  totalPayable=0;
  listDataCopy: string;
  totalBalance;





  // customerObserverSubject:Subject<UserDetailDTO> = new Subject();
  report: AccountsReceviableReport;
  statement: Statement[] = [];
  paymentModal = false;
  statementList: any[];

  constructor(private _router: Router,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    private service: InsuranceCompanyService,
    private alert: AlertService,
    private imageCompression: NgxImageCompressService,
    private fb: FormBuilder,
    private _AgentService: SalesAgentService,
    ) {


    this.form = this.fb.group({
      isTpl: [null],
      isNonTpl: [null],
      rates: [null],
      isActive: [null]
    });
    this.form2 = this.fb.group({
      isTpl: [null],
      isNonTpl: [null],
      rates: [null],
      isActive: [null]
    });

    this.form = this.fb.group({
      from: new FormControl(null),
      to: new FormControl(null),
      requestExcel: new FormControl(null),
      requestPdf: new FormControl(null),
      searchQuery: new FormControl(null),

    })

  }

  searchAddress: string;


  show = false;

  chiplist = [];

  showModal() {
    this._sharedService.sentPaymentForm.next(null);
  }
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async params => {
      this.userDetailId = await +params['salesAgent'] || 0;


      this._sharedService.formSubmited.subscribe(async x => {
        this.isVisible = false;
        await this.service.GetSaleAgentDetail(this.userDetailId).subscribe(res => {
          if (res.isSuccessfull) {
            this.customerDetail = res.dynamicResult as UserDetailDTO;

            this.listData = this.customerDetail.salesInvoicePersons;
            this.userId = this.customerDetail.userId;
            this.paymentAndBilling = this.customerDetail.paymentAndBilling[0];
            this.address = this.customerDetail.addresses[0];
          }
          else {
            console.log('failed fetching');
          }

        });
      })
      // redirect if userDetailId is null or undefined
      if (!this.userDetailId) {
        this._router.navigate(['/sales-agent'])
      } else {
        //

        this.service.GetBalance(this.userDetailId).subscribe(res => {
          this.openingBalance = res.dynamicResult.balance
        });
        this.service.GetRates(this.userDetailId).subscribe(res => {
          if (res) {
            this.comissions = res.dynamicResult as ComissionRates[];

            this.tpl = this.comissions.filter(x => x.isTpl)[0]?.rates?.toString();

            this.nonTpl = this.comissions.filter(x => x.isNonTpl)[0]?.rates?.toString();
          }

        });
        console.log(this.comissions);
        await this.service.GetSaleAgentDetail(this.userDetailId).subscribe(async res => {
          if (res.isSuccessfull) {
            this.customerDetail = res.dynamicResult as UserDetailDTO;
            this.listData = this.customerDetail.insuranceCompanyInvoices;
            (await this.service.GetReceviableStatementReport(res.dynamicResult.defaultAccountId)).subscribe(res => {
              if (res.dynamicResult) {
                console.log(res.dynamicResult)
                this.report = res.dynamicResult as AccountsReceviableReport;
                this.statement = (res.dynamicResult as AccountsReceviableReport).statement;
                this.paymentDue = this.report.totalBalance;
              }


            });
            this.userId = this.customerDetail.userId;

            this.fullName = this.customerDetail.displayNameAs;
          }
          else {
            console.log('failed fetching');
          }

        });
      }

    });

    this._AgentService.salesAgentObserver$.subscribe(res=>{
      this.totalPayable=0;
      if(res){
        this.listData=res.data;
        res.data.forEach((item)=>{

          this.totalPayable+=item.openBalance;

        });
    }

    this.totalCount= res?.totalCount;
    console.log('resCHek' ,this.totalCount)
    console.log('2nd', res)

    this.listDataCopy = JSON.stringify(this.listData);
      });

    this._AgentService.GetAgentwithBalancePaginatedAsync(this.page, this.pageSize);

  }

  editDetail() {
    console.log('working');
    this.isVisible = true;

  }
  handleCancel() {
    this.isVisible = false
  }
  saveTpl() {

    var data = this.form.value as ComissionRates;
    data.isTpl = true;
    data.isNonTpl = false;
    data.isActive = true;
    data.userDetailId = this.userDetailId;
    this.service.saveComissionRate(data).subscribe(res => {
      if (res.dynamicResult) {
        this.alert.success("Saved");
        this.service.GetRates(this.userDetailId).subscribe(res => {
          if (res) {
            this.comissions = res.dynamicResult as ComissionRates[];

            this.tpl = res.dynamicResult.filter(x => x.isTpl)[0]?.rates.toString();

            this.nonTpl = res.dynamicResult.filter(x => x.isNonTpl)[0]?.rates.toString();
          }

        });
      }
      else {
        this.alert.error("Error");
      }
    })
  }
  saveNonTpl() {
    var data = this.form2.value as ComissionRates;
    data.isNonTpl = true;
    data.isTpl = false;
    data.isActive = true;
    data.userDetailId = this.userDetailId;
    this.service.saveComissionRate(data).subscribe(res => {
      if (res.dynamicResult) {
        this.alert.success("Saved");
        this.service.GetRates(this.userDetailId).subscribe(res => {

          if (res) {
            this.comissions = res.dynamicResult as ComissionRates[];

            this.tpl = this.comissions.filter(x => x.isTpl)[0].rates.toString();

            this.nonTpl = this.comissions.filter(x => x.isNonTpl)[0].rates.toString();
          }

        });
      }
      else {
        this.alert.error("Error");
      }
    })
  }
  header = [['Date', 'Type', 'Invoice#', 'Name', 'Policy#', 'Vehicle', 'Account', 'Debit', 'Credit', 'Amount', 'Balance']];
  tableData = [];
  DownloadPDF() {
    var options: Intl.DateTimeFormatOptions = { localeMatcher: 'best fit', year: '2-digit', month: 'long', day: '2-digit' };
    var pdf = new jsPDF('landscape', 'px');
    this.statement.forEach(x => {
      let datetoday = formatDate(x.date, 'mediumDate', 'en-AE').toString();
      this.tableData.push([datetoday, x.transactionType, x.invoiceNumber, x.name, x.policyNumber, x.vehicle, x.accountName, x.debit, x.credit, x.amount, x.balance])
    }
    );
    var img = new Image();
    img.src = 'assets/images/logo.png';





    var headRows = function () {
      return [{
        id: "ID",
        name: "Name",
      }];
    };

    var bodyRows = function (rowCount) {
      rowCount = rowCount || 10;
      let body = [];

      for (var i = 1; i <= rowCount; i++) {
        body.push({
          id: i,
          name: "Name " + i
        });
      }

      return body;
    }
    var customer = this.customerDetail.displayNameAs;

    autoTable(pdf, {
      head: this.header,
      body: this.tableData,

      didDrawPage: function (data) {
        // Header

        pdf.addImage(img, 'png', 5, -12, 115, 65, 'SLOW');
        pdf.setFontSize(50);
        pdf.setTextColor(20, 20, 0);
        pdf.setFont('poppins');

        pdf.text(`STATEMENT OF ACCOUNT`, 81, -5);


        // pdf.setFontSize(20);
        // pdf.setTextColor(85);
        // pdf.setFont('poppins');




        // Footer
        var str = "Page " + pdf.internal.pages
        // Total page number plugin only available in jspdf v1.0+
        if (typeof pdf.putTotalPages === 'function') {
          str = str + " of " + pdf.internal.pages;
        }
        pdf.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = pdf.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        // pdf.text(str, data.settings.margin.left, pageHeight - 10);
      },

      margin: {
        top: 150, left: 20, right: 20, bottom: 75
      }

      ,


      styles: { fillColor: [0, 0, 51] },
      didDrawCell: data => {
        console.log(data.column.index)
        data.cell.width = 15;
      }
    });




    // // Open PDF document in browser's new tab
    // pdf.output('dataurlnewwindow')

    // Download PDF doc
    pdf.save(`${this.customerDetail.displayNameAs + Date.now()}.pdf`);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.isloading=true;

    console.log('pageSizw', this.pageSize, this.page);
    
    this._AgentService.GetAgentwithBalancePaginatedAsync(this.page, this.pageSize);


  }
  searchPag() {
    var data = this.form.value as PaginationParams<number>;
    data.id = this.userDetailId;
    data.page = this.page;
    data.itemsPerPage = this.pageSize;
    this._AgentService.SearchWithPagination(data);
    this._AgentService.salesAgentStatementObserver$.subscribe((res => {
      this.statementList = res?.data;
      this.totalCount = res?.totalCount;
      this.totalBalance = res?.totalBalance;
      console.log('ye wal alog', res);
      // console.log(this.totalBalance);
      console.log('statementList', this.statementList);
      // console.log(this.totalCount);
    }))

    console.log('chcce', data)
    console.log(this.form.value);
  }
}
