import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bulk-sales',
  templateUrl: './bulk-sales.component.html',
  styleUrls: ['./bulk-sales.component.scss']
})
export class BulkSalesComponent implements OnInit {


  formGroup:FormGroup;
  constructor(private fb:FormBuilder) {

    this.formGroup=this.fb.group({
      customerName:[null,Validators.required],
      chassisNumber:[null,Validators.required],
      salesInvoiceDate:[new Date(),Validators.required],
      policyTypeId:[null,Validators.required],
      bodyTypeId:[null],
      serviceId:[null],
      salesInvoicePersonId:[null,Validators.required],
      insuranceCompanyId:[null,Validators.required],
      insuranceTypeId:[null,Validators.required],
      branchId:[null,Validators.required],
      underWritter:[null,Validators.required],
      paymentMethodId:[null,Validators.required],
      notes:[null,Validators.required],
      total:[null,Validators.required],
      saleLineItem:this.fb.array([this.fb.group({
        policyNumber:[null,Validators.required],
        vehilcleId:[null,Validators.required],
        total:[null,Validators.required],
        gross:[null,Validators.required],
        vat:[null],
        commissionRate:[null],
        commission:[null],
        net:[null],
        salesPrice:[null,Validators.required],
        actualComission:[null]
      })])
    });

   }

   
  ngOnInit(): void {

  }

}
