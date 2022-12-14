import { AccountDTO } from "./accountDTO";
import { ExpenseCategory } from "./ExpenseCategoryDTO";

export class Expenses{
    id: number;
    expenseName: string;
    expenseDate: Date;
    expenseCategory: ExpenseCategory;
    expenseAmount: number;
    expenseCategoryId: number;
    accountId: number;
    account:AccountDTO;
}