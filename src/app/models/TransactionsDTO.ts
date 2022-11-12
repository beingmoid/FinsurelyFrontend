import { AccountDTO } from "./accountDTO";
import { Branch } from "./branchDTO";
import { InsuranceType } from "./insuranceTypeDTO";
import { UserDetailDTO } from "./userDTO";

export class Transactions{
    id:number;
    memo:string;
    transactionDate:Date;
    userDetailId?:number;
    salesInvoiceId?:number;
    transactionType:TransactionType;
    salesInvoice:SalesInvoice;
    userDetails:UserDetailDTO;

}

export enum TransactionType{
    Invoice=1,
    Payment,
    InsuranceCredit,
    Transfer,
    Deposit,
    Expense,
    Bill,
    Refund
}
export class SalesInvoice{
    id:number;
    customerName:string;
    salesInvoiceDate:Date;
    chassisNumber:string
    salesInvoicePersonId:number;
    salesInvoicePerson:UserDetailDTO;
    InsuranceTypeId:number;
    InsuranceType:InsuranceType;
    branchId:number;
    branch:Branch;
    bodyTypeId:number;
    bodyType:{id:number,name:string};
    policyTypeId:number;
    policyType:{id:number,name:string};
    serviceId:number;
    service:{id:number,name:string};
    insuranceCompanyId?:number;
    insuranceCompany?:UserDetailDTO;
    underWritter:string;
    paymentMethodId:number;
    paymentMethod:{id:number; name:string};
    notes:string;
    total?:number;
    saleLineItem:SaleLineItem[];
    ledgarEntries:LedgerEntries[];
    transactions:Transactions[];
    paymentStatus:PaymentStatus;
}
export enum PaymentStatus
{
    Paid=1,
    Unpaid=2,
    OverDue=3,
    Closed=4,
}
export class SaleLineItem{
    id:number;
    saleId:number;
    salesInvoice?:SalesInvoice;
    policyNumber:string;

    insuranceTypeId?:number;
    insuranceType?:{id:number;name:string};
    vehilcleId?:number;
    vehicle?:Vehicle;
    total :number;
    gross:number;
    vat:number;
    salesPrice:number;
    commission:number;
    PremiumPrice:number;
    CommisionRate:number;
    net:number;

}
export class Vehicle{
    id:number;
    make:string;
    model:string;
}
export class LedgerEntries{
    id:number;
    amount:number;
    debitAccountId?:number;
    debitAccount?:AccountDTO;
    creditAccountId?:number;
    creditAccount?:AccountDTO;
    transactionDate:Date;
    transactionId:number;
    transaction:Transactions
}



