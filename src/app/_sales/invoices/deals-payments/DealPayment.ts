import { IMyDateModel } from 'angular-mydatepicker';

export class DealPayment {
    id = 0;
    subject = '';
    dealId = 0;
    invoiceId = 0;
    mode = '';
    referenceno = '';
    drawnon = '';
    receiptfilename = '';
    paymentDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    paymentDate: Date = this.paymentDateObject.singleDate.jsDate;;
    amount = 0.00;
    gstAmount = 0.00;
    totalAmount = 0.00;
    description = '';
    createdBy = '';
    modifiedBy = '';
    createddatetime: Date;
    lastupdatedatetime: Date;
}