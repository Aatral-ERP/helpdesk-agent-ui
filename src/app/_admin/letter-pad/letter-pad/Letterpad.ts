import { IMyDateModel } from 'angular-mydatepicker';

export class Letterpad {

    id;
    receiptfilename = '';
    letterpadTimeDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    letterPadDate: Date = this.letterpadTimeDateObject.singleDate.jsDate;;

    toAddress = '';
    content='';
    subject='';
    regardText='';

    fileName = '';
    fileType ='';
    fileSize = 0

    institute: any = {};

    

}