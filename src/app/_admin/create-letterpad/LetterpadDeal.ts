import { IMyDateModel } from 'angular-mydatepicker';

export class LatterpadDeal {

    
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

    id: number = 0;

    letterPadNo = '';

    
    purchaseOrderNo: string = '';
    
    
    institute: any = {};
    billingTo: string = '';
    billingStreet1: string = '';
    billingStreet2: string = '';
    billingCity: string = '';
    billingState: string = '';
    billingCountry: string = '';
    billingZIPCode: string = '';

    

    createdBy: String = '';
    modifiedBy: String = '';

    createddatetime: Date;
    lastupdatedatetime: Date;

    //instituteId :number =0;

    

}



