import { IMyDateModel } from 'angular-mydatepicker';

export class DealPurchaseOrder {
    id: number = 0;
    purchaseOrderNo: string = '';

    trackingNo: string = '';
    requisitionNo: string = '';

    dealId: number = 0;
    subject: string = '';
    status: string = 'created';
    purchaseOrderDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    purchaseOrderDate: any = this.purchaseOrderDateObject.singleDate.jsDate;
    dueDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    dueDate: any = this.dueDateObject.singleDate.jsDate;

    exciseDuty = 0.00;
    salesCommission = 0.00;

    createdBy = '';
    modifiedBy = '';
    terms = '';
    filename = '';

    createddatetime: Date;
    lastupdatedatetime: Date;
}