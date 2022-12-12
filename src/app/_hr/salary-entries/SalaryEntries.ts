export class SalaryEntries {
    public id: number;
    public employeeId: any;
    public employeeName: any;
    public designation: any;
    public doj: any;

    public pfNumber: any = '';
    public panNumber: any = '';
    public uanNumber: any = '';
    public esicNumber: any = '';

    public bankName: any = '';
    public accountNumber: any = '';
    public modeOfPayment: any = '';

    public salaryDate: any;
    public noOfDaysLeave: any = '';
    public noOfWorkingDays: any = '';
    
    public salaryMonth: any = '';
    public salaryYear: any = '';
    public filename: any = '';
    public status: any = '';

    public createddatetime: any;
    public lastupdatedatetime: any;

    public properties: Array<SalaryEntriesProperty> = [];

    public totalEarnings: number;
    public totalDeductions: number;
    public netPay: number;

}

export class SalaryEntriesProperty {
    id: number;
    employeeId: string;
    salaryEntryId: string;
    property: string;
    amount: number;
    propertyType: string;
}