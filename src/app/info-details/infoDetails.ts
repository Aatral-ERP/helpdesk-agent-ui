export class InfoDetails {

    id: number = 1;
    cmpName: string = '';
    cmpAddress: string = '';
    cmpPhone: string = '';
    cmpWebsiteUrl: string = '';
    cmpEmail: string = '';
    cmpLandLine: string = '';
    gstNo: string = '';
    terms: string = '';
    bankDetails: string = '';
    mailContent: any;
    zipcode: any;

    sendEmail: boolean = false;
    daysBefore0: boolean = false;
    daysBefore1: boolean = false;
    daysBefore7: boolean = false;
    daysBefore15: boolean = false;
    daysBefore30: boolean = false;
    daysAfter1: boolean = false;
    daysAfter7: boolean = false;
    daysAfter15: boolean = false;
    daysAfter30: boolean = false;
    reminderEmailCC: string = '';
    reminderTemplate: string = 'Proforma_Invoice_Template_2';

    defaultReminderMailSubject = '';
    signatureAgent: string = '';
    defaultReminderMailMessage = '';

    instamojoApiKey = '';
    instamojoAuthToken = '';
    instamojoPaymentURL = '';

    cmpLogo: any;
    roundSeal: any;
    fullSeal: any;
    photo: any;

}   