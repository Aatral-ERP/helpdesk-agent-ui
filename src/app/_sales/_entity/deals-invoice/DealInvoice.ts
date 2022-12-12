var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export class DealInvoice {

    id: number = 0;
    dealId: number = 0;

    invoiceNo: string = '';
    purchaseOrderNo: string = '';
    salesOrderNo: string = '';
    subject: string = '';
    invoiceDate: Date = new Date();
    dueDate: Date = new Date();

    gstMonth: string = months[new Date().getMonth()];
    gstYear: string = new Date().getFullYear().toString();

    invoiceStatus: string = 'created';

    exciseDuty: number = 0;
    salesCommission: number = 0;
    paidAmount: number = 0;
    shippingCost: number = 0;

    terms: string = '';
    createdBy: string = '';
    modifiedBy: string = '';

    filename: string = '';
    workCompletionCertificate: string = '';
    satisfactoryCertificate: string = '';
    dcfilename: string = '';

    dealType: string = 'Sales';
    gstType: string = 'CGST/SGST';

    amcFromDate: Date = new Date();
    amcToDate: Date = new Date(new Date().setMonth(new Date().getMonth() + 1));

    institute: any = {};
    noOfProducts: number = 0;

    billingTo: string = '';
    shippingTo: string = '';

    instituteContacts: Array<any> = [];
    products: Array<Product> = [];

    discountType: string = 'Amount';

    subTotal: number = this.getSubTotal();
    discount: number = this.getDiscount();
    tax: number = this.getTaxAmount();
    adjustment = this.getAdjustment();
    grandTotal = this.getGrandTotal();

    createddatetime: Date = new Date();
    lastupdatedatetime: Date = new Date();

    getSubTotal() {
        let resp = 0;

        this.products.forEach(prod => {
            resp = resp + (prod.price * prod.quantity);
        })
        this.subTotal = +resp.toFixed(2);
        return this.subTotal;
    }

    getDiscount() {
        let resp = 0;

        this.products.forEach(prod => {
            resp = resp + (prod.discount * prod.quantity);
        })

        this.discount = +resp.toFixed(2);
        return this.discount;
    }

    getTaxAmount() {
        let resp = 0;
        this.products.forEach(prod => {
            resp = resp + this.getGSTAmount(prod.price, prod.discount, prod.quantity, prod.gstPercentage);
        })

        this.tax = +resp.toFixed(2);
        return this.tax;
    }

    getAdjustment() {
        let subTotal = this.getSubTotal();
        let discount = this.getDiscount();
        let taxAmount = this.getTaxAmount();
        let total: number = subTotal + discount + taxAmount;
        this.adjustment = (Math.round(total) - +total).toFixed(2);

        return this.adjustment;
    }

    getGrandTotal() {
        let subTotal = this.getSubTotal();
        let discount = this.getDiscount();
        let taxAmount = this.getTaxAmount();

        this.grandTotal = Math.round((subTotal - discount) + taxAmount).toFixed(2);
        return this.grandTotal;
    }

    getTotalAmount(price, discount, quantity, gstPercentage) {
        price = +price;
        discount = +discount;
        quantity = +quantity;
        gstPercentage = +gstPercentage;

        let amount = price - discount;
        let gstAmount = amount * (gstPercentage / 100);
        let totalAmount = (amount + gstAmount) * quantity;

        return +totalAmount.toFixed(2);
    }

    getGSTAmount(price, discount, quantity, gstPercentage) {
        price = +price;
        discount = +discount;
        quantity = +quantity;
        gstPercentage = +gstPercentage;
        let amount = price - discount;

        let gstAmount = amount * (gstPercentage / 100);

        return +(gstAmount * quantity).toFixed(2);
    }

}

export interface Product {
    id: number;
    productId: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    discount: number;
    discountPercent: number;
    gstPercentage: number;
}
