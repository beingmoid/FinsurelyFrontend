import { SalesInvoice } from "./TransactionsDTO";

export class Branch{
    id:number;
    branchName:string;
    branchAddress:string;
    sales:SalesInvoice[];
}
