export class InvoiceEmail {
    public id: number;
    public invoiceId: number;
    public subject: string;
    public message: string;
    public tab: string;
    public mailIds: string;
    public mailIdCC: string;
    public createdBy: string;
    public createddatetime: Date;
    public sent: number = 0;
    public filename:string;

}