import { DealDCProducts } from "./DealDCProducts";

export class DealDCProductRawMaterial {
    public id: number;
    public dealId: number;
    public invoiceNo: string;
    public rawMaterialProductId: number;
    public dcProductId: number;
    public name: string;
    public description: string;
    public uom: string;
    public quantity: number;
    public dealDCProduct: DealDCProducts;
}