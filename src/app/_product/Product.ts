import { Vendor } from '../view-vendors/Vendor';

export class Product {
    public id: number;
    public name: string;
    public hsn: string;
    public amchsn: string;
    public amount: number;
    public gst: number = 18;
    public amcAmount: number;
    public warranty: string = '1 years';
    public salesDescription: string;
    public amcDescription: string;
    public description: string;
    public uom: string = '';
    public stock: number;
    public finishedProduct: boolean = true;
    public maintainable: boolean = true;
    public externalProduct: boolean = false;
    public vendor: Vendor;
    public vendorAmount: number;
    public vendorAmcAmount: number;
    public category: string = '';

}