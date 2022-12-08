import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AccountDTO } from '../models/accountDTO';
import { Branch } from '../models/branchDTO';
import { ReconData } from '../models/reconData';
import { Payment } from '../models/refundDTO';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  openAccountsForm = new Subject<AccountDTO>();
  accountsIsVisible=false;
  bodyform = new Subject();
  vehicleForm = new Subject();
  serviceForm = new Subject();
  paymentForm = new Subject<Payment>();
  sentPaymentForm = new Subject<Payment>();
  formSubmited = new Subject();
  restForm = new  Subject();
  closeForm = new  Subject<any>();
  PaymentcloseForm = new  Subject<any>();
  modalFromDetailPage = new Subject();
  openBranchModal = new Subject<boolean>();
  private _openBranchModalWithData = new Subject<Branch>();
  public get openBranchModalWithData() {
    return this._openBranchModalWithData;
  }
  public set openBranchModalWithData(value) {
    this._openBranchModalWithData = value;
  }
  closeBranchModal = new Subject<boolean>();
  reconData = new Subject<ReconData[]>();
  constructor() { 
    this.closeForm = new  Subject<any>();
    this.PaymentcloseForm = new  Subject<any>();
    this.paymentForm = new Subject<Payment>();
    this.sentPaymentForm = new Subject<Payment>();
  }
}
