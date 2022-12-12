import { IMyDateModel } from 'angular-mydatepicker';

export class DealSalesOrder {

    id: number = 0;
    purchaseOrderNo: string = '';
    salesOrderNo: string = '';
    dealId: number = 0;
    subject: string = '';
    dueDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) } };
    dueDate: any = this.dueDateObject.singleDate.jsDate;

    status: string = 'created';

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