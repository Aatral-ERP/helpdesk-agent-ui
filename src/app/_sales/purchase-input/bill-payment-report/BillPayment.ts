import { Vendor } from 'src/app/view-vendors/Vendor';

export class BillPayment {

    public id: number = 0;

    public vendor: Vendor;
    public billId: string;
    public referenceno: any;
    public billDate: Date = new Date()
    public gstType: string = 'CGST/SGST';
    public subTotal: number;
    public discount: number;
    public tax: number;
    public adjustment: number;
    public grandTotal: number;
    public terms: string;
    public createdBy: string;
    public modifiedBy: string;
    public createddatetime: string;
    public lastupdatedatetime: string;

}

