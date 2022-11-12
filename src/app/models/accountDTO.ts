import { UserDetailDTO } from "./userDTO";

export class AccountDTO{

    id:number;
    accountId:number;
    accountDetailTypeId:number;
    accountDetailType:AccountDetailTypeDTO;
    name:string;
    number:string;
    description:string;
    defaultTaxCode:string;
    isSubAccount:boolean;
    subAccounts:AccountDTO[];
    userDetails:UserDetailDTO[];
    asOf:Date;
    openingBalanceEquity:number;
    isDeleteApplicable?:boolean;

}
export class AccountTypeDTO{
    id:number;
    name:string;
}
export class AccountDetailTypeDTO{
    id:number;
    accountTypeId:number;
    accountType:AccountTypeDTO;
    name:string;

}

export class AccountsReceviableReport{
    statement:Statement[];
    totalBalance:number;
}
export class Statement{
    date:Date;
    policyNumber:string;
    vehicle:string;
    insuranceType:string;
    bodytype:string;
    company:string;
    policyType:string;
    service:string;
    transactionType:number;
    invoiceNumber:number;
    name:string;
    memo:string;
    accountName:string;
    amount:number;
    balance:number;
    debit:number;
    credit:number;
    transactionRefNumber:string;
    rejected:boolean
    mappingReport:MappingReport;
}
export class MappingReport{
    date:FeedResponse;
    customer:FeedResponse;
    insuranceCompany:FeedResponse;
    transactionType:FeedResponse;
    invoiceNumber:FeedResponse;
    insuranceType:FeedResponse;
    transactionRefNumber:FeedResponse;
    amount:FeedResponse;
    gross:FeedResponse;
    comission:FeedResponse;
    comissionRate:FeedResponse;
    debit:FeedResponse;
    credit:FeedResponse;
    vat:FeedResponse;
    memo:FeedResponse;
    net:FeedResponse;
    total:FeedResponse;
    balance:FeedResponse;
    vehicle:FeedResponse;
    accountName:FeedResponse;
}
export class FeedResponse{
 status:boolean;
 applicable:boolean;
}
