import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Bill, BillAttachment } from '../_sales/purchase-input/bills/Bill';
import { PurchaseInputOrder } from '../_sales/purchase-input/purchase-input-order-create/PurchaseInputOrder';
import { BillPayment } from '../_sales/purchase-input/bill-payment/BillPayment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseInputService {
  constructor(public auth: AuthService, private http: HttpClient) { }

  saveBill(bill: Bill, billAttachments: Array<BillAttachment>) {

    bill.noOfProducts = bill.products.length;
    bill.modifiedBy = this.auth.getLoginEmailId();

    if (bill.id == 0)
      bill.createdBy = this.auth.getLoginEmailId();

    let req = { bill: bill, billAttachments: billAttachments, billProducts: bill.products };
    return this.http.post(environment.apiUrl + 'purchase-inputs/save-bill', req);
  }

  getBill(billId) {
    console.log(billId);
    return this.http.get(environment.apiUrl + 'purchase-inputs/get-bill/' + billId);
  }
  
  getBillPaymentDetails(req) {
    return this.http.post(environment.apiUrl + 'purchase-inputs/get-bills-payments', req);
  }

  deleteBill(bill) {
    return this.http.post(environment.apiUrl + 'purchase-inputs/delete-bill', bill);
  }

  getBills(req) {
    return this.http.post(environment.apiUrl + 'purchase-inputs/get-bills', req);
  }

  getBillAttachment(billAttachment: BillAttachment) {
    return this.http.post(environment.apiUrl + 'purchase-inputs/get-bill-attachment', billAttachment);
  }

  downloadNoteAttachmentProgress(billAttachment: BillAttachment) {

    let options = {
      responseType: 'blob' as const,
      reportProgress: true as const,
      observe: 'events' as const,
      headers: new HttpHeaders().append("Content-Type", "application/json")
    }

    return this.http.get(environment.apiUrl + '/download/bill-attachment/' + billAttachment.billId + '/' + billAttachment.filename, options);
  }

  savePurchaseInputOrder(order: PurchaseInputOrder) {

    order.noOfProducts = order.products.length;
    order.modifiedBy = this.auth.getLoginEmailId();

    if (order.id == 0)
      order.createdBy = this.auth.getLoginEmailId();

    let req = { purchaseInputOrder: order, purchaseInputOrderProducts: order.products };
    return this.http.post(environment.apiUrl + 'purchase-inputs/save-purchase-input-order', req);

  }

  getPurchaseInputOrders(req) {
    return this.http.post(environment.apiUrl + 'purchase-inputs/get-purchase-input-orders', req);
  }

  getPurchaseInputOrder(orderId: any) {
    return this.http.get(environment.apiUrl + 'purchase-inputs/get-purchase-input-order/' + orderId);
  }

  deletePurchaseInputOrder(order) {
    return this.http.post(environment.apiUrl + 'purchase-inputs/delete-purchase-input-order', order);
  }

  generatePurchaseInputOrderPDF(purchaseInputOrder, template, addRoundSeal, addFullSeal, addSign, designation) {
    let req = {
      purchaseInputOrder: purchaseInputOrder, templateName: template, designation: designation,
      addRoundSeal: addRoundSeal, addFullSeal: addFullSeal, addSign: addSign,
      signatureBy: this.auth.getLoginEmailId()
    };
    return this.http.post(environment.apiUrl + 'purchase-inputs/generate-purchase-input-order-pdf', req);
  }

  UploadGeneratedPurchaseInputOrderPDF(orderId, file) {
    let form = new FormData();
    form.append('orderId', orderId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'purchase-inputs/upload-generated-purchase-input-order-pdf', form);
  }

  saveBillPayment(billPayment: BillPayment) {
    billPayment.modifiedBy = this.auth.getLoginEmailId();
    if (billPayment.id == 0)
      billPayment.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'purchase-inputs/save-purchase-inputs-payment', billPayment);
  }

  getBillPayments(billId: number) {
    return this.http.get(environment.apiUrl + 'purchase-inputs/get-purchase-inputs-payments/' + billId);
  }

  deleteDealPayments(billPayment: BillPayment) {
    return this.http.post(environment.apiUrl + 'purchase-inputs/delete-purchase-inputs-payment', billPayment);
  }


}
