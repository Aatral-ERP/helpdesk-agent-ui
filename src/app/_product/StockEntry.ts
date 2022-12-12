export class StockEntry {
    public id: number;
    public productId: number;
    public quantity: number;
    public entryDate: Date = new Date();
    public entryBy: string;
    public remarks: string;
    public type: string = 'Credit';
    public createddatetime: Date;
}