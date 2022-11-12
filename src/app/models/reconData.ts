export class ReconData{
    columnName:string;
    mappedTo:number;
    allowMapping:boolean;
    compare:boolean;
}
export class Recon{

    salesAgentId:number;
    insuranceCompanyId:number;
    documentId:number;
    from:Date;
    to:Date;
    reconData:ReconData[];
}