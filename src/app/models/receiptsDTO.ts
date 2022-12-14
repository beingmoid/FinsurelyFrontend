import { ExpenseCategory } from "./ExpenseCategoryDTO";

export class Receipts{
    name: string;
    branch: object;
    date: Date;
    expenseType: ExpenseCategory;
    amount: number;
    description: string;
}