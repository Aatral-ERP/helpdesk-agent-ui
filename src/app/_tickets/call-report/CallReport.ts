import { IMyDateModel } from 'angular-mydatepicker';

export class CallReport {
    id = 0;
    instituteId = '';
    
    receiptfilename = '';
    reporingInTimeDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    reportingInTime: Date = this.reporingInTimeDateObject.singleDate.jsDate;;

    reportingOutTimeDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    reportingOutTime: Date = this.reportingOutTimeDateObject.singleDate.jsDate;;
    
    createddatetime: Date;
    lastupdatedatetime: Date;

    problemsReported='';
    actionTaken = '';
    customerRemarks = '';
    followUpAction = '';
    descriptionOfNameSupplied = '';

    customerName ='';

    fileName = '';
    fileType ='';
    fileSize = 0



}