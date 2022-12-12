import { IMyDateModel } from 'angular-mydatepicker';

export class DealProformaInvoice {

    id: number = 0;
    proformaInvoiceNo: string = '';
    purchaseOrderNo: string = '';
    salesOrderNo: string = '';
    dealId: number = 0;
    subject: string = '';
    invoiceStatus: string = 'Proforma Invoice';
    invoiceDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    invoiceDate: any = this.invoiceDateObject.singleDate.jsDate;
    dueDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) } };
    dueDate: any = this.dueDateObject.singleDate.jsDate;

    exciseDuty = 0.00;
    salesCommission = 0.00;
    shippingCost = 0.00;
    paidAmount = 0.00;

    createdBy = '';
    modifiedBy = '';
    terms = '';
    filename = '';

    createddatetime: Date;
    lastupdatedatetime: Date;

}