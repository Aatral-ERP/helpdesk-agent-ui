export class RawMaterialRequest {
    public id: number = 0;
    public subject = '';
    public productId: number;
    public productName: string;
    public requestBy: string;
    public requestTo: number;
    public requestDate: Date = new Date();
    public approvedDate: Date;
    public createddatetime: Date;
    public lastupdatedatetime: Date;

    public status: string = 'Requested';
    public remarks: string;
    public approveRejectRemarks: string;

}