import { IMyDateModel } from 'angular-mydatepicker';

export class Quotation {

    id: number = 0;
    subject: string = '';
    quoteNo: string = '';
    institute: any = {};
    instituteContacts: Array<any> = [];
    quoteStage: string = '';
    noOfProducts: number = 0;
    quoteDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    quoteDate: any = this.quoteDateObject.singleDate.jsDate;
    validUntilObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
    validUntil: any = this.validUntilObject.singleDate.jsDate;

    billingTo: string = '';
    billingStreet1: string = '';
    billingStreet2: string = '';
    billingCity: string = '';
    billingState: string = '';
    billingCountry: string = '';
    billingZIPCode: string = '';

    shippingTo: string = '';
    shippingStreet1: string = '';
    shippingStreet2: string = '';
    shippingCity: string = '';
    shippingState: string = '';
    shippingCountry: string = '';
    shippingZIPCode: string = '';

    products: Array<Product> = [];
    gstType: string = 'CGST/SGST';

    subTotal: number = this.getSubTotal();
    discount: number = this.getDiscount();
    tax: number = this.getTaxAmount();
    adjustment = this.getAdjustment();
    grandTotal = this.getGrandTotal();
    filename = '';
    createdBy: String = '';
    modifiedBy: String = '';

    terms: string = '';
    preparedBy: string = '';

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
    gstPercentage: number;
}

export interface Note {
    id: number;
    dealId: number;
    noteTitle: string;
    note: string;
    noteby: string;
    editedby: string;
    lastupdatedatetime: Date;
}
export interface NoteAttachment {
    id: number;
    dealId: number;
    noteId: number;
    filename: string;
    file: any;
    filetype: string;
    size: number;
    lastupdatedatetime: Date;
}