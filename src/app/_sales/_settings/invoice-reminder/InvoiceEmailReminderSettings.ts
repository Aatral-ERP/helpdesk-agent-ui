export class InvoiceEmailReminderSettings {
    id: number;
    sendReminderEmail: boolean = false;
    reminderSubjectTemplate: string;
    reminderContentTemplate: string;
    daysBefore0: boolean;
    daysBefore1: boolean;
    daysBefore7: boolean;
    daysBefore15: boolean;
    daysAfter1: boolean;
    daysAfter7: boolean;
    daysAfter15: boolean;
    daysAfter30: boolean;
}