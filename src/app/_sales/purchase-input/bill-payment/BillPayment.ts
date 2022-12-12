import { IMyDateModel } from 'angular-mydatepicker';

export class BillPayment {
    public id: number = 0;
    public billId: number;
    public subject: string;
    public mode: string;
    public referenceno: string;
    public drawnon: string;
    public paymentDate: Date = new Date();
    public paymentDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: this.paymentDate } };
    public amount: number;
    public gstAmount: number;
    public totalAmount: number;
    public description: string;
    public createdBy: string;
    public modifiedBy: string;
    public createddatetime: Date;
    public lastupdatedatetime: Date;
}