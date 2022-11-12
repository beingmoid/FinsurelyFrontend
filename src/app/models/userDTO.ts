import { CaseTaskDTO } from "./caseTaskDTO";
import { EmployeeDetails } from "./employeeDetailDto";
import { PreferredPaymentMethod } from "./preferredPaymentMethodDTO";
import { SalesInvoice, Transactions } from "./TransactionsDTO";

export class UserDTO {
   
    id?:number;
    email?:string;
    userDetails?:UserDetailDTO;
        role?:string;
      
       
}
export class CustomerDTO {
   
    id?:number;
    email?:string;
    userDetails?:UserDetailDTO;
    
}

export class UserDetailDTO{
   id?: number;
             firstName?: string;
             middleName?:string;
             lastName?: string;
             email?: string;
              title?: string
              company?: string
             displayNameAs?:string
               phone ?:string
            mobile ?:string
            fax?:string
            other ?:string
            website?:string
           billWithParent ?:boolean
           isSubCustomer ?:boolean
           defaultAccountId?:number;
           assignedTask:CaseTaskDTO[];
           imageUrl?:string;
           userDetail ?:UserDTO;
           userId?:string;
           addresses?:Address[];
           extendedUser?:{email?:string};
           attachments?:Attachments[];
           transactions?:Transactions[];
           paymentAndBilling?:PaymentAndBilling[];
           salesInvoicePersons:SalesInvoice[];
           insuranceCompanyInvoices:SalesInvoice[];
           customerSalesInvoice:SalesInvoice[];
           comissionRates:ComissionRates[];
           openBalance:number;
           employmentDetails:EmployeeDetails[];
           completedTaskPercentage?:number;
           completedTaskStatus:string;
           pendingTaskPercentage?:number;
           pendingTaskStatus:string;
           inprocessTaskPercentage?:number;
           inprocessTaskStatus:string;
        //    isCustomer??:boolean;
      
}
export class ComissionRates{
  id?:number;
  rates:number;
  isTpl:boolean;
  isNonTpl:boolean;
  isActive:boolean;
  userDetailId:number;
}
export class Attachments{
    id?:number;
    userDetailId?:number;
    attachmentUrl?:string;

}
export class Address{
    id?:number;street?:string;city?:string;state?:string;postalCode?:string;country?:string;billingAddress?:string;userDetailId?:number
}
export class PaymentAndBilling{
    id?:number;
    userDetailId?:number;
    preferredPaymentMethodId?:number;
    preferredPaymentMethod?:PreferredPaymentMethod
    termsId?:number;
    terms?:{id?:number,text?:string};
    openingBalance?:number;
    asof?:Date;

}
   
export enum PreferredDeliveryMethod
{
    None,
    PrintLater,
    SendLater
}