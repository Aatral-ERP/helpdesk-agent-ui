import { IMyDateModel } from 'angular-mydatepicker';

export class DealQuotation {

    id: number = 0;
    subject: string = '';
    dealId: number = 0;
    quoteNo: string = '';
    quoteStage: string = '';
    noOfProducts: number = 0;
    quoteDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    quoteDate: any = this.quoteDateObject.singleDate.jsDate;
    validUntilObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date(new Date().setMonth(new Date().getMonth() + 3)) } };
    validUntil: any = this.validUntilObject.singleDate.jsDate;

    createdBy = '';
    modifiedBy = '';
    terms = '';
    filename = '';

    createddatetime: Date;
    lastupdatedatetime: Date;

}