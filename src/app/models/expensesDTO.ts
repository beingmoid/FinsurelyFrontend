import { AccountDTO } from "./accountDTO";
import { Branch } from "./branchDTO";
import { ExpenseCategory } from "./ExpenseCategoryDTO";

export class Expenses{
    id: number;
    expenseName: string;
    expenseDate: Date;
    expenseCategory: ExpenseCategory;
    expenseAmount: number;
    expenseCategoryId: number;
    branchId: number;
    branch: Branch;
    accountId: number;
    account:AccountDTO;
}