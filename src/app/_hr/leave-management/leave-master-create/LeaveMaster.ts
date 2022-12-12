export class LeaveMaster {
    public id: number = 0;
    public name: string;

    public annualLeave: number = 0;
    public sickLeave: number = 0;
    public casualLeave: number = 0;
    public otherLeave: number = 0;
    public permissions: number = 0;

    public carryForward: boolean;
    public maximumCarryForward: number = 0;

    public lopPerDay: number = 0;

    public createdBy: string;
    public modifiedBy: string;
    public createddatetime: Date;
    public lastupdatedatetime: Date;

}