import { environment } from 'src/environments/environment';

export const API_URL: string = environment.api_url;


export const API_ENDPOINTS = {

    // dummy endpoints for reusability
    DummyList: 'api/dummy/list',
    DummyAdd: 'api/dummy/add',
    DummyDelete: 'api/dummy/delete',
    DummyUpdate: 'api/dummy/update',
    DummyGet: 'api/dummy/get',
    Contacts: 'api/Contacts',
    Commission: 'api/Commission',
    Case: 'api/Case',
    LookUp: 'api/LookUp',
    RetainerSchedule: 'api/RetainerSchedule',
    Task: 'api/TaskTodo',
    Status:'api/Status',
    Note: 'api/Note',
    Priority:'api/Priority',
    StripePublishKey: 'api/StripeConfiguration/GetPublishKey',
    CheckEmail: 'api/auth/CheckEmail',
    Transaction: 'api/Transactions',
    Document: 'api/Document',
    Invoice: 'api/Invoice',
    ImmigrationDepartmentStatus: 'api/ImmigrationDepartmentStatus',
    Form: 'api/Form',
    Subscription: 'api/SubscriptionPlans',
    Auth: 'api/Auth',
    PaymentHistory: 'api/PaymentHistory',
    Roles: 'api/Roles',
    Team: 'api/TeamMembers',
    Users: 'api/Users',
    CheckIsUserEligibleForNewPswd: 'api/auth/CheckIsUserEligibleForNewPswd',
    BankAccount: 'api/BankAccount',
    BodyType:'api/BodyType',
    PolicyType:'api/PolicyType',
    Service:'api/Service',
    Audit: 'api/Audit',
    Events: 'api/Events',
    HomeData: 'api/Home/GetHomeData',
    Immigration: 'api/Immigration',
    Analytics: 'api/Analytics',
    GlobalSearch: 'api/GlobalSearch',
    Notification: 'api/Notification',
    Accounts:'api/Accounts',
    UploadFile:'api/Attachment/UploadFile',
    Customer:'api/Customer',
    Employee:'api/Employee',
    PreferredPaymentMethod:'api/PreferredPaymentMethod',
    PaymentMethod:'api/PaymentMethod',
    Terms:'api/Terms',
    UserDetail:'api/UserDetail',
    SalesInvoice:'api/SalesInvoice',
    SalesAgent:'api/Agent',
    InsuranceCompany:'api/InsuranceCompany',
    Supplier:'api/Supplier',
    Comissionrate:'api/Comissionrate',
    InsuranceType:'api/InsuranceType',
    Vehicle:'api/Vehicle',
    LedgerEntries:'api/LedgerEntries',
    Refund:'api/Refund',
    Payment:'api/Payment',
    ReceivePayment:'api/Payment/GetReceivePayments',
    SentPayment:'api/Payment/GetSentPayment',
    RPayment:'api/Payment/ReceviePayment',
    UPayment:'api/Payment/UpdateReceviePayment',
    DPayment:'api/Payment/DeleteReceviePayment',
    CSentPayment:'api/Payment/SendPayment',
    USentPayment:'api/Payment/UpdatePaymentSent',
    DSentPayment:'api/Payment/DeletePaymentSent',
    PaymentCredit:'api/PaymentCredit',
    Reconcile:'api/Reconcilation',
    GetManagers:'api/Employee/GetManagers',
    Compensation:'api/Compensation',
    Vacation:'api/VacationPolicy',
    BenefitAndDeduction:'api/BenefitsAndDeduction',
    EmployeeBenefitsAndDeductions:'api/BenefitsAndDeduction/EmployeeBenefitsAndDeductions',
    BankDetails:'api/BankDetails',
    Branch:'api/Branch',
    ExpenseCategory:'api/ExpenseCategory',
    Expenses: 'api/Expense',
    Payroll: 'api/Payroll',
    Receipts: 'api/Receipts',
    Announcement: 'api/Announcement',
    VactionApplication: 'api/VacationApplication',
    Loan: 'api/Loan',
}