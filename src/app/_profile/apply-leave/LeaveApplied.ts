export class LeaveApplied {
    public id: number = 0;
    public agentEmailId: string;
    public status: string;

    public approvedRejectedBy: string;
    public approvedRejectedDate: Date;

    public noOfDays: number = 0;
    public leaveFrom: Date;
    public leaveTo: Date;
    public leaveType: string;
    public reason: string;

    public createddatetime: Date;
    public lastupdatedatetime: Date;
}