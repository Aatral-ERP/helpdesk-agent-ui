import { IMyDateModel } from 'angular-mydatepicker';

export class IncomeExpense {
    public id: number = 0;
    public toWhom: string = '';
    public subject: string = '';
    public type: string = 'Expense';
    public category: string = '';
    public invoiceNo: string = '';
    public modeOfPayment: string = 'online';
    public referenceno: string = '';
    public drawnon: string = '';
    public amount: number = 0;
    public paymentDate: Date = new Date();
    public paymentDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    public invoiceDate: Date = new Date();
    public invoiceDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    public createdBy: string;
    public modifiedBy: string;
    public remarks: string;
    public relatedTo: string = '';
    public relatedToAgentId: string = '';
    public relatedToSupplierId: string = '';
    public createddatetime: Date;
}