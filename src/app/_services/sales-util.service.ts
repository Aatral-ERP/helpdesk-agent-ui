import { Injectable } from '@angular/core';
import { Product } from '../_product/Product';
import { Deal } from '../_sales/_entity/deals-create/Deal';

@Injectable({
  providedIn: 'root'
})
export class SalesUtilService {

  constructor() { }

  getSubTotal(products) {
    let resp = 0;

    products.forEach(prod => {
      resp = resp + (prod.price * prod.quantity);
    })
    let subTotal = +resp.toFixed(2);
    return subTotal;
  }

  getDiscount(products) {
    let resp = 0;

    products.forEach(prod => {
      resp = resp + (prod.discount * prod.quantity);
    })

    let discount = +resp.toFixed(2);
    return discount;
  }

  getTaxAmount(products) {
    let resp = 0;
    products.forEach(prod => {
      resp = resp + this.getGSTAmount(prod.price, prod.discount, prod.quantity, prod.gstPercentage);
    })

    let tax = +resp.toFixed(2);
    return tax;
  }

  getAdjustment(products) {
    let subTotal = this.getSubTotal(products);
    let discount = this.getDiscount(products);
    let taxAmount = this.getTaxAmount(products);
    let total: number = subTotal + discount + taxAmount;
    let adjustment = +(Math.round(total) - +total).toFixed(2);

    return adjustment;
  }

  getGrandTotal(products) {
    let subTotal = this.getSubTotal(products);
    let discount = this.getDiscount(products);
    let taxAmount = this.getTaxAmount(products);

    let grandTotal = +Math.round((subTotal - discount) + taxAmount).toFixed(2);
    return grandTotal;
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

  getGridTaxableAmount(deal: Deal) {
    let resp = 0;
    resp = deal.grandTotal - deal.tax;
    return resp;
  }

  getGridCGSTAmount(deal: Deal) {
    let resp = 0;
    if (deal.gstType == "CGST/SGST") {
      return deal.tax / 2;
    }
    return resp;
  }

  getGridSGSTAmount(deal: Deal) {
    let resp = 0;
    if (deal.gstType == "CGST/SGST") {
      return deal.tax / 2;
    }
    return resp;
  }

  getGridIGSTAmount(deal: Deal) {
    let resp = 0;
    if (deal.gstType == "IGST") {
      return deal.tax;
    }
    return resp;
  }

  getPartSubTotal(products, partId): number {
    let amount = 0.00;
    products.filter(prod => prod.partId == partId).forEach(prod => {
      let _amnt = prod.price * prod.quantity;
      amount = amount + _amnt;
    });
    return amount;
  }

  getPartCounts(products): number {
    return new Set(products.map(prod => prod.partId)).size;
  }

  getMaxPartId(products): number {
    return Math.max.apply(Math, products.map(prod => prod.partId));
  }

}
