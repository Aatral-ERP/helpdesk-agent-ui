import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DealInvoice } from '../_sales/invoices/invoice-create/DealInvoice';
import { InvoiceEmailReminderSettings } from '../_sales/_settings/invoice-reminder/InvoiceEmailReminderSettings';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(public auth: AuthService, private http: HttpClient) { }

  saveDealInvoice(dealInvoice: DealInvoice) {

    dealInvoice.noOfProducts = dealInvoice.products.length;
    dealInvoice.modifiedBy = this.auth.getLoginEmailId();

    if (dealInvoice.id == 0)
      dealInvoice.createdBy = this.auth.getLoginEmailId();

    let req = {
      dealInvoice: dealInvoice,
      dealInvoiceProducts: dealInvoice.products,
      instituteContacts: dealInvoice.instituteContacts
    };

    return this.http.post(environment.apiUrl + 'invoice/save-deal-invoice', req);
  }

  loadNextInvoiceNo() {
    return this.http.get(environment.apiUrl + 'invoice/get-next-invoice-no');
  }

  getDealInvoice(invoiceId) {
    return this.http.get(environment.apiUrl + 'invoice/get-deal-invoice/' + invoiceId);
  }

  loadInvoicesReport(req) {
    return this.http.post(environment.apiUrl + 'invoice/get-deal-invoices-report/', req);
  }

  generateDCPDF(deliveryChallan, template) {
    let req = { deliveryChallan: deliveryChallan, templateName: template };
    return this.http.post(environment.apiUrl + 'invoice/generate-delivery-challan', req);
  }

  generateInvoicePDF(dealInvoice, template, addRoundSeal, addFullSeal, addSign, designation, exportType, detailedPricing) {
    let req = {
      dealInvoice: dealInvoice, templateName: template, designation: designation,
      addRoundSeal: addRoundSeal, addFullSeal: addFullSeal, addSign: addSign,
      exportType: exportType, signatureBy: this.auth.getLoginEmailId(),
      detailedPricing: detailedPricing
    };
    return this.http.post(environment.apiUrl + 'invoice/generate-invoice-pdf', req);
  }

  UploadGeneratedInvoicePDF(dealInvoiceId, file) {
    let form = new FormData();
    form.append('dealInvoiceId', dealInvoiceId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'invoice/upload-generated-invoice-pdf', form);
  }

  UploadInvoiceSatisfactoyPDF(dealInvoiceId, file) {
    let form = new FormData();
    form.append('dealInvoiceId', dealInvoiceId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'invoice/upload-invoice-satisfactory-file', form);
  }

  UploadInvoiceWorkCompletionPDF(dealInvoiceId, file) {
    let form = new FormData();
    form.append('dealInvoiceId', dealInvoiceId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'invoice/upload-invoice-work-completion-file', form);
  }

  saveDealPayment(dealPayment) {
    dealPayment.modifiedBy = this.auth.getLoginEmailId();
    if (dealPayment.id == 0)
      dealPayment.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'invoice/save-deal-payment', dealPayment);
  }

  getDealPayments(invoiceId) {
    return this.http.get(environment.apiUrl + 'invoice/get-deal-payments/' + invoiceId);
  }

  deleteDealPayments(payment) {
    return this.http.post(environment.apiUrl + 'invoice/delete-deal-payment', payment);
  }

  generateReceipt(payment, template, receiptContent, paymentDate, billingTo, designation, addFullSeal, addRoundSeal, addSign) {
    let req = {
      payment: payment, templateName: template, receiptContent: receiptContent, paymentDate: paymentDate, billingAddress: billingTo, designation: designation, addFullSeal: addFullSeal,
      addRoundSeal: addRoundSeal, addSign: addSign, signatureBy: this.auth.getLoginEmailId()
    };
    console.log("Final_Req::::", req);
    return this.http.post(environment.apiUrl + 'invoice/create-deal-payment-receipt', req);
  }

  loadPaymentsReport(req) {
    return this.http.post(environment.apiUrl + 'invoice/get-deal-payments-report/', req);
  }

  getPendingInvoiceQuantityProducts(req) {
    return this.http.post(environment.apiUrl + 'invoice/get-pending-invoice-quantity-products/', req);
  }

  getPendingDCQuantityProducts(req) {
    return this.http.post(environment.apiUrl + 'deals/get-pending-dc-quantity-products/', req);
  }

  saveInvoiceEmail(dealEmail) {
    return this.http.post(environment.apiUrl + 'invoice/save-invoice-email', dealEmail);
  }

  UploadInvoiceEmailAttachment(dealEmailId, file) {
    let form = new FormData();
    form.append('dealEmailId', dealEmailId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'invoice/add-invoice-email-attachment', form);
  }

  sendInvoiceEmail(dealEmail) {
    return this.http.post(environment.apiUrl + 'invoice/send-invoice-email', dealEmail);
  }

  loadInvoiceEmailReminderSettings() {
    return this.http.get(environment.apiUrl + 'invoice/load-invoice-email-reminder-settings');
  }

  saveInvoiceEmailReminderSettings(setting: InvoiceEmailReminderSettings) {
    return this.http.post(environment.apiUrl + 'invoice/save-invoice-email-reminder-settings', setting);
  }

}
