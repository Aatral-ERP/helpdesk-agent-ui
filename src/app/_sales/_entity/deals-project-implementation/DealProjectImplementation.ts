export class DealProjectImplementation {

    public id: number = 0;
    public dealId: number;
    public poNo: string;
    public status: string;

    public mailAction:string;

    public manufacturingAgent: string;
    public manufacturingAssignedBy: string;
    public manufacturingFinishedBy: string;
    public manufacturingApprovedBy: string;
    public manufacturingAssignedDateTime: Date;
    public manufacturingFinishedDateTime: Date;
    public manufacturingApprovedDateTime: Date;

    public deliveryAgent: string;
    public deliveryAssignedBy: string;
    public deliveryFinishedBy: string;
    public deliveryApprovedBy: string;
    public deliveryAssignedDateTime: Date;
    public deliveryFinishedDateTime: Date;
    public deliveryApprovedDateTime: Date;

    public installedAgent: string;
    public installedAssignedBy: string;
    public installedFinishedBy: string;
    public installedApprovedBy: string;
    public installedAssignedDateTime: Date;
    public installedFinishedDateTime: Date;
    public installedApprovedDateTime: Date;

    public workCompletionBy: string;
    public workCompletionDateTime: Date;

    public createddatetime: Date;
    public lastupdatedatetime: Date;

}