export class LeadTask {
    id: number = 0;
    leadId = 0;
    subject: string = '';
    description: string = '';
    priority: string = 'NotPreferred';
    status: string = 'Created';
    dueDateTime: Date = null;
    createddatetime: Date;
    lastupdatedatetime: Date;

}