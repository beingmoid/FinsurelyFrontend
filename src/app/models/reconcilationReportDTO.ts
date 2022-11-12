import { Statement } from "./accountDTO";
import { DocumentDTO } from "./documentDTO";
import { UserDetailDTO } from "./userDTO";

export class Reconcilation{
    id:number;
    salesAgentId:number;
    salesAgent:UserDetailDTO;
    insuranceCompanyId:number;
    insuranceCompany:UserDetailDTO;
    documentId:number;
    documents:DocumentDTO;
    generatedDate:Date;
    from:Date;
    to:Date;
    statement:Statement[];
    columns:string[];
    amountDifference:number;
    noOfSalesMissing:number;
    Corrections:Corrections[];

}
export class Corrections{
    id:number;
    reconcilationReportId:number;
    name:string;
    description:string;
}