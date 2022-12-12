export class Reminder {
    public id: number = 0;
    public agentEmailId: string = '';
    public subject: string = '';
    public description: string = '';
    public status: string = 'Created';
    public recurringType: string = 'One Time';
    public tag: string = '';
    public recurringId: string = '';
    public eventDateTime: Date = null;
    public createddatetime: Date = null;
}