import { DealDCProducts } from "./DealDCProducts";

export class DeliveryChallan {
    public id: number = 0;
    public dealId: number;
    public invoiceId: number = 0;
    public invoiceNo: string;
    public stockDeductId: number;

    public products: Array<DealDCProducts> = [];

    public filename: string;
    public createddatetime: Date;
    public lastupdatedatetime: Date;

}