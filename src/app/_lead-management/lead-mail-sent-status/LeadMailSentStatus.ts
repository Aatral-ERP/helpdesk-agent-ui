export class LeadMailSentStatus {
    id: number = 0;
    leadId: number = 0;
    templateId: number = 0;
    mailTo: string = '';
    mailCC: string = '';
    subject: string = '';
    message: string = '';
    files: string = '';
    status: string = '';
    createddatetime: Date = null;
}