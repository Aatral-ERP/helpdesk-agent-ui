export class DealInvoiceProducts {
    public id: number;
    public dealId: number;
    public invoiceId: number;
    public invoiceNo: string;
    public productId: number;
    public name: string;
    public description: string;
    public price: number;
    public discount: number;
    public uom: string;
    public partId: number = 1;
    public discountPercent: number;
    public quantity: number;
    public gstPercentage: number;

}