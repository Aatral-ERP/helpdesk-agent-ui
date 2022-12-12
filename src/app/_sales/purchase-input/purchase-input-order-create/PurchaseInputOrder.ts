import { Vendor } from 'src/app/view-vendors/Vendor';

export class PurchaseInputOrder {

    public id: number = 0;

    public vendor: Vendor;
    public orderNo: string;
    public referenceNo: string;
    public orderDate: Date = new Date();
    public expectedDeliveryDate: Date;
    public shippingTo: string;
    public billingTo: string;
    public gstType: string = 'CGST/SGST';
    public filename: string = '';

    products: Array<PurchaseInputOrderProduct> = [];

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

export interface PurchaseInputOrderProduct {
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