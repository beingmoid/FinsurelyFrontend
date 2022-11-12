import { UserDetailDTO } from "./userDTO";

export class EmployeeDetails{

    id:number;
    managerId?:number;
    manager?:UserDetailDTO;
    userDetailId:number;
    userDetails:UserDetailDTO;
    position:string;
    hiredDate:Date;
    teamId?:number;
    team:TeamDTO;
    employeeIsActive:boolean;
    compensations:CompensationDTO[]
    vacationPolicies:VacationPolicy[];
    bankDetails:BankDetails[];
    benefitsAndDeductions:BenefitsAndDeduction[];
    employeeFiles:EmployeeFiles[];
    employmentStatus:EmploymentStatus[];
    


}
export class VacationPolicy{
    id:number;
    employmentDetailId:number;
    employmentDetails:EmployeeDetails;
    annualLeavesCount:number;
    casualLeaveCount:number;
    sickLeaveCount:number;

}
export class TeamDTO{
    id:number;
    ManagerId:number;
    manager:UserDetailDTO;
    teamName:string;
    teamMembers:[];

}
export class CompensationDTO{
    id:number;
    employmentDetailId:number;
    employmentDetails:EmployeeDetails;
    SalaryAmount:number;
    effectiveDate:Date;
    expiryDate:Date;


}
export class BenefitsAndDeduction{
    employmentDetailId:number;
    employmentDetails:EmployeeDetails;
    benefits:Benefits[];
    deduction:Deduction[];
}
export class Benefits{
    id:number;
    benefitAndDeductionId:number;
    benefitsAndDeduction:BenefitsAndDeduction;
    benefitTypeId:number;
    type:BDType
    amount:number;
    payStubLabel:string;
    occurance:number;
;
}
export class Deduction{
    id:number;
    benefitAndDeductionId:number;
    benefitsAndDeduction:BenefitsAndDeduction;
    deductionTypeId:number;
    type:BDType;
    amount:number;
    payStubLabel:string;
    occurance:number;

}
export class BDType{
    id:number;
    name:string;
    categoryId:string;
    category:BDType;
    isForBenefit?:boolean;
    isForDeduction?:boolean;
    childernTypes:BDType[];
    deductions:[];
    benefits:Benefits[];
}
export class EmployeeFiles{
    id:number;
    employmentDetailId:number;
    employmentDetails:EmployeeDetails;
    documentUrl:string;
    description:string;
}
export class BankDetails{
    id:number;
    employmentDetailId:number;
    employmentDetails:EmployeeDetails;
    accountHolderName:string;
    accountNumber:string;
    ibanNumber:string;
    bankType:number;

}
export class EmploymentStatus{
    id:number;
    employmentDetailId:number;
    employmentDetails:EmployeeDetails;
    staffOffBoardings:StaffOffBoardings[];
    leaveApplications:LeaveApplications[];

}
export class LeaveApplications{
    id:number;
    employmentStatusId:number;
    employmentStatus:EmploymentStatus;
    lastDayOfWork:Date;
    dateOfReturn:Date;
    leaveAppoved:boolean;
    leaveRejected:boolean;
    leaveNoteFromEmployee:string;

}
export class StaffOffBoardings{
    id:number;
    employmentStatusId:number;
    employmentStatus:EmploymentStatus;
    reason:string;
    lastDayOfWork:Date;
    dateOfNotice:Date;

}