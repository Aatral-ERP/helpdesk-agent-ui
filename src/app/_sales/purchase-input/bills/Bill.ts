import { Vendor } from 'src/app/view-vendors/Vendor';

export class Bill {

    public id: number = 0;

    public vendor: Vendor;
    public billNo: string;
    public orderNo: string;
    public billDate: Date = new Date();
    public dueDate: Date;
    public shippingTo: string;
    public billingTo: string;
    public gstType: string = 'CGST/SGST';

    products: Array<BillProduct> = [];

    public subTotal: number;
    public discount: number;
    public tax: number;
    public adjustment: number;
    public grandTotal: number;

    public noOfProducts: number;
    public terms: string;
    public createdBy: string;
    public modifiedBy: string;
    public createddatetime: string;
    public lastupdatedatetime: string;

}

export interface BillProduct {
    id: number;
    billNo: number;
    productId: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    discount: number;
    gstPercentage: number;
}

export interface BillAttachment {
    id: number;
    billId: number;
    filename: string;
    file: any;
    filetype: string;
    size: number;
}
