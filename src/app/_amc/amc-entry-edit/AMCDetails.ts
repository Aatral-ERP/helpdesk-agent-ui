import { IMyDateModel } from 'angular-mydatepicker';
export class AMCDetails {
    public institute: any;
    public product: any;
    public amcId: any;
    public id: any;
    public title: any;
    public amcAmount: any;
    public gst: any;
    public totalAmount: any;
    public serviceType: any = 'AMC';
    public transactionDetails: any;
    public description: any;
    public payMode: any = 'online';
    public paymentDate: any;
    fromDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    fromDate: any = this.fromDateObject.singleDate.jsDate;

    toDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    toDate: any = this.toDateObject.singleDate.jsDate;

    paidDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    paidDate: any = this.paidDateObject.singleDate.jsDate;

    invDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    invDate: any = this.invDateObject.singleDate.jsDate;
}