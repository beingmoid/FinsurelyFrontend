import { AccountDTO } from "./accountDTO";
import { Branch } from "./branchDTO";

export class payroll{
    name: string;
    branch: Branch;
    branchId: number;
    startDate: Date;
    endDate: Date;
    status:PayrollStatus;
    expenseAccount:AccountDTO;
    expenseAccountId: number;
  
}
export enum PayrollStatus{
    active= 1,
    deactive,
}