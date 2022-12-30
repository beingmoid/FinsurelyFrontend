import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { NzTableQueryParams } from "ng-zorro-antd";
import { NzResizeEvent } from "ng-zorro-antd/resizable";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { Subject, Subscription } from "rxjs";
import { SalesInvoice } from "src/app/models/TransactionsDTO";
import { UserDetailDTO } from "src/app/models/userDTO";
import { AlertService } from "src/app/services/alert.service";
import { SalesService } from "src/app/services/APIServices/sales.service";
import { ExportService } from "src/app/services/export.service";
import { SharedService } from "src/app/services/shared.service";
import { environment } from "src/environments/environment";
import * as XLSX from 'xlsx';
const ELEMENT_DATA=[];
class FilterObject {
  constructor(private data: any) {}

  index: number = this.data.index;
  policyNumber: string = this.data.saleLineItem[0]?.policyNumber;
  name: string = this.data.customerDetails?.displayNameAs;
  accountNumber: string = this.data.accountNumber;
  bankAccountTypeName: string = this.data.bankAccountTypeName;
  balance: number = this.data.balance;
}
@Component({
  selector: "app-view-sales",
  templateUrl: "./view-sales.component.html",
  styleUrls: ["./view-sales.component.scss"]
})
export class ViewSalesComponent implements OnInit {
  search: string;

  listData: any[] = [];
  file = {
    uid: "",
    name: "",
    status: "",
    url: "",
    thumbUrl: ""
  };
  form: FormGroup;

  defaultFileList: NzUploadFile[] = [];
  UploadUrl = environment.api_url + "api/SalesInvoice/BulkUpload";
  listDataCopy: string;
  isloading=false;
  page=1;
  pageSize=10;
  totalRows:number;
  CustomerForm: FormGroup;
  isEditMode: boolean;
  isVisible: boolean;
  sortColumnKey: string;
  modalTitle: string;
  isBulkUploadVisible = false;
  isVisible2 = false;
  isVisible3 = false;
  salesSubject: Subscription;
  salesObserverSubject: Subject<SalesInvoice> = new Subject();
  interval: NodeJS.Timeout;
  serverSideUploading=false;
  scrollConfig = {
    x: "600px"
  };
  columnTrackBy(index: number, item) {
    return item.key;
  }
  listOfSelectedSearch=[];
  constructor(
    private service: SalesService,
    private alert: AlertService,
    private sharedService: SharedService,
    private fb:FormBuilder,
    private excel:ExportService,
  ) {
    this.sharedService.formSubmited.subscribe(res => {
      this.isEditMode = false;
      this.isVisible = false;
    });
    this.form = this.fb.group({
      dateFrom: new FormControl(null),
      dateTo: new FormControl(null),
      branch: new FormControl(null),
      isPdf: new FormControl(null),
      isExcel: new FormControl(null)

    })
  }
  searchAddress: string;
  // listData: Branch[];
 
  sortName = null;
  sortValue = null;
  listOfSearchName = [];

  show = false;

  chiplist = [];

  listOfColumn = [
    {
      name: "Date",
      type: "Date",
      expression: "",
      show: true,
      width: "120px"
    },

    {
      name: "Customer /  Company",
      type: "VARCHAR",
      expression: "",
      show: true,
      width: "120px"
    },
    {
      name: "Insurance Broker",
      type: "VARCHAR",
      expression: "",
      show: true,
      width: "120px"
    },
    {
      name: "Sales Personn",
      type: "VARCHAR",
      expression: "",
      show: false,
      width: "120px"
    },
    {
      name: "Policy Number",
      type: "VARCHAR",
      expression: "",
      show: true,
      width: "120px"
    },
    {
      name: "Vehicle",
      type: "VARCHAR",
      expression: "",
      show: false,
      width: "120px"
    },
    {
      name: "Branch",
      type: "VARCHAR",
      expression: "",
      show: true,
      width: "120px"
    },
    {
      name: "Insurance Company",
      type: "VARCHAR",
      expression: "",
      show: false,
      width: "120px"
    },
    {
      name: "Payment Method",
      type: "VARCHAR",
      expression: "",
      show: false,
      width: "120px"
    },
    {
      name: "Gross",
      type: "number",
      expression: "",
      show: false,
      width: "120px"
    },
    {
      name: "NET",
      type: "number",
      expression: "",
      show: false,
      width: "120px"
    },
    {
      name: "Comission",
      type: "number",
      expression: "",
      show: false,
      width: "120px"
    },
    {
      name: "Notes",
      type: "VARCHAR",
      expression: "",
      show: false,
      width: "120px"

    }
,{
  name: "Filter",
  type: "VARCHAR",
  expression: "",
  left:true,
  show: true,
  width: "120px"
}
  ];

  selectedSearchFilters=[];
  customField=false;
  broker=false;
  agent=false;
  vehicles=false;
  branch=false;
  range=false;

  OnSelectionChange($event:string[]){
   if($event.find(x=>x==="crown")){
    this.agent=true;
   }
   else{
    this.agent=false;
   }
   if($event.find(x=>x==="calendar")){
    this.range=true;
   }
   else{
    this.range=false;
   }
   if($event.find(x=>x==="field-string")){
    this.customField=true;
   }
   else{
    this.customField=false;
   }
   if($event.find(x=>x==="insurance")){
    this.broker=true;
   }
   else{
    this.broker=false;
   }
   if($event.find(x=>x==="branches")){
    this.branch=true;
   }
   else{
    this.branch=false;
   }
   if($event.find(x=>x==="car")){
    this.vehicles=true;
   }
   else{
    this.vehicles=false;
   }
    console.log(this.selectedSearchFilters);
    console.log($event);
  }


  onQueryParamsChange(params: NzTableQueryParams): void {
    this.isloading=true;


  this.service.GetPaginated(this.page,this.pageSize);
  }
  onResize({ width }: NzResizeEvent, col: string): void {
    this.listOfColumn = this.listOfColumn.map(e =>
      e.name === col ? { ...e, width: `${width}px` } : e
    );
  }
  validateForm: FormGroup= this.fb.group({
    searchTerm:[null],
    searchOptions:[null],
    dateRange:[null],
    includeBrokers:[null],
    includeAgents:[null],
    includeVehicles:[null],
    includeBranches:[null]
  })
  isCollapse = true;


  resetForm(): void {
    this.validateForm.reset();
  }
  listOfOption: Array<{ label: string; value: string }> = [
    {label: "Policy Number",value:"Policy Number"},
    {label: "Chasis Number",value:"Chasis Number"},
    {label: "Customer Name",value:"Customer Name"},
   {label: "Gross",value:"Gross"},
   {label: "NET",value:"NET"},
   {label: "Comission%",value:"Comission%"},
   {label: "Comission Rate",value:"Comission Rate"},
   {label: "Notes",value:"Notes"},
   {label: "Total",value:"Total"},
  ];
  listOfTagOptions = [];
  inputValue?: string;
  webFrameworks = [
    { name: 'React', type: 'JavaScript', icon: 'https://zos.alipayobjects.com/rmsportal/LFIeMPzdLcLnEUe.svg' },
    { name: 'Angular', type: 'JavaScript', icon: 'https://zos.alipayobjects.com/rmsportal/PJTbxSvzYWjDZnJ.png' },
    { name: 'Dva', type: 'Javascript', icon: 'https://zos.alipayobjects.com/rmsportal/EYPwSeEJKxDtVxI.png' },
    { name: 'Flask', type: 'Python', icon: 'https://zos.alipayobjects.com/rmsportal/xaypBUijfnpAlXE.png' }
  ];

  valueWith = (data: { name: string; type: string; icon: string }): string => data.name;

  onSelect(value: string): void {
    console.log(value);
  }
  ngOnInit(): void {

    // this.selectedSearchFilters.valueChanges.subscribe(val=>{
    //   console.log('working as val',val)
    // })
    // const children: Array<{ label: string; value: string }> = [];
    // for (let i = 10; i < 36; i++) {
    //   children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    // }
    // this.listOfOption = children;
  this.isloading=true;
    this.salesSubject = this.service.salesObserver$.subscribe(res => {

      if(res){
        this.listData=[];
        this.totalRows=res.totalRows as number;
        this.listData=[...res.data]

        this.isloading=false;
      }



      // this.listData = res;
      this.listDataCopy = JSON.stringify(this.listData);
      console.log("Sales", this.listData);

    });
    this.service.GetPaginated(1,this.pageSize);
  }








  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== "uploading") {
      this.serverSideUploading = true;

      console.log(file, fileList);
    }
    if (status === "done") {
      this.defaultFileList.push(file);

      this.serverSideUploading = false;
      this.alert.success(`${file.name} file uploaded successfully.`);
    } else if (status === "error") {
      this.serverSideUploading = false;
      this.alert.error(`${file.name} file upload failed.`);
    }
  }
  loadComponent() {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy() {
    this.salesSubject.unsubscribe();
  }
  showModal() {
    // this.CustomerForm.reset();
    this.isEditMode = false;
    this.isVisible = true;
    this.salesObserverSubject.next(null);
  }
  exportExcel(): void
    {
       /* table id is passed over here */


       let element = document.getElementById('excel-table');
      let arr:any[]=[];
      console.log(this.listData)
        this.listData.forEach(function(value:SalesInvoice){

           var item={
             CustomerName:value.customerName,
            SalesAgent:value.salesInvoicePerson?.displayNameAs,
            InsuranceBroker:value.insuranceCompany?.displayNameAs,
            PolicyNumber:value.saleLineItem[0]?.policyNumber,
            Make:value.saleLineItem[0]?.vehicle?.make,
            Model:value.saleLineItem[0]?.vehicle?.model,
            Branch:value.branch?.branchName,
            InsuranceCompany:value.underWritter,
            Gross:value.saleLineItem[0]?.gross,
            VAT:value.saleLineItem[0]?.vat,
            NET:value.saleLineItem[0]?.net,
            Commission:value.saleLineItem[0]?.commission,
            Notes:value.notes,
            Total:value.saleLineItem[0]?.salesPrice};

            arr.push(item);

        });

        const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(arr);
       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();``

       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, `${Date.now()}.xlsx`);

    }


  handleCancel() {
    this.isVisible = false;
  }
  rejectedEntries = [];
  sortOn(colKey: string) {
    if (colKey) {
      this.sortColumnKey = colKey;
    }
  }
  handleUpload = (item: any) => {
    const formData = new FormData();
    formData.append(item.name, item.file as any);
    this.service.BulkUpload(formData).subscribe(
      res => {

          console.log( 'After Upload',this.rejectedEntries)
          this.rejectedEntries = res.dynamicResult as SalesInvoice[];

        item.onSuccess(item.file);
      },
      err => {
        item.onError(err, item.file);
      }
    );
  };

  sortNamesFn = (a, b) =>
    a[this.sortColumnKey]?.toString().localeCompare(b[this.sortColumnKey]);
  sortNumbersFn = (a, b) => a[this.sortColumnKey] - b[this.sortColumnKey];
  filter() {
    this.listData = JSON.parse(this.listDataCopy);
    if (this.search !== "") {
      this.listData = this.listData.filter(item => {
        let data = new FilterObject(item);
        return Object.keys(data).some(
          k =>
            data[k] != null &&
            data[k]
              .toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())
        );
      });
    }
  }

  editSales(data: SalesInvoice) {
    console.log("eDIT", data);
    this.isVisible = true;
    this.isEditMode = true;
    this.salesObserverSubject.next(data);
  }
  DeleteSales() {

  }
}
