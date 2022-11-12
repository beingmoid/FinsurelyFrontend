import { AccountDTO } from "./accountDTO";
import { InsuranceType } from "./insuranceTypeDTO";
import { PaymentMethod } from "./preferredPaymentMethodDTO";
import { Transactions, Vehicle } from "./TransactionsDTO";
import { UserDetailDTO } from "./userDTO";

export class Refund{
    id:number;
    salesAgentId:number;
    salesAgent:UserDetailDTO;
    memo:string;
    email:string;
    refundDate:Date;
    paymentMethodId:number;
    paymentMethod:PaymentMethod;
    transactionReferenceNumber:string;
    refundAccountId:number;
    refundAccount:AccountDTO;
    policyNumber:string;
    insuranceTypeId:number;
    insuranceType:InsuranceType;
    vehilcleId:number;
    vehicle:Vehicle;
    messageOnReceipt:string;
    messageOnStatement:string;
    amountForSalesAgent:number;
    transactions:Transactions[];
}
export class Payment{
    id:number;
    salesAgentId:number;
    salesAgent:UserDetailDTO;
    insuranceCompanyId:number;
    insuranceCompany:UserDetailDTO;
    memo:string;
    email:string;
    paymentDate:Date;
    paymentMethodId:number;
    paymentMethod:PaymentMethod;
    transactionReferenceNumber:string;
    depositAccountId:number;
    depositAccount:AccountDTO;
    creditAccountId:number;
    creditAccount:AccountDTO;
    amount:number;
    transactions:Transactions[];
}