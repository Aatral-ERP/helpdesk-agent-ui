export class SalaryDetails {
    public employeeId: any;

    public pfNumber: any = '';
    public panNumber: any = '';
    public uanNumber: any = '';
    public esicNumber: any = '';
    public modeOfPayment: any = '';
    public lopPerDay: number = 0;

    public bankName: any = '';
    public accountNumber: any = '';
    public ifscCode: any = '';

    public properties: Array<SalaryDetailProperty> = [];

    public totalEarnings: number;
    public totalDeductions: number;
    public netPay: number;

    public salaryDate: any;
    public casualLeave: any = 0;
    public experience: any;
}

export class SalaryDetailProperty {
    id: number;
    employeeId: string;
    property: string;
    amount: number;
    propertyType: string;
}