import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Quotation, NoteAttachment, Note } from '../_sales/Quotation';
import { Deal } from '../_sales/_entity/deals-create/Deal';
import { Observable, BehaviorSubject } from 'rxjs';
import { DealQuotation } from '../_sales/_entity/deals-quotation/DealQuotation';
import { DealInvoice } from '../_sales/invoices/invoice-create/DealInvoice';
import { DealPurchaseOrder } from '../_sales/_entity/deals-purchase-order/DealPurchaseOrder';
import { DealSalesOrder } from '../_sales/_entity/deals-sales-order/DealSalesOrder';
import { DeliveryChallan } from '../_sales/_entity/deals-delivery-challan/DeliveryChallan';
import { DealProformaInvoice } from '../_sales/_entity/deals-proforma-invoice/DealProformaInvoice';
import { DealProjectImplementation } from '../_sales/_entity/deals-project-implementation/DealProjectImplementation';
import { DealProjectImplementationComment } from '../_sales/_entity/deals-project-implementation-comment/DealProjectImplementationComment';
import { TermsAndConditions } from '../_sales/terms-and-conditions/TermsAndConditions';
import { DealInvoiceReminder } from '../_sales/_entity/deals-invoice-reminder/DealInvoiceReminder';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(public auth: AuthService, private http: HttpClient) { }

  viewPDF(dealId, filename) {
    let url = environment.apiUrl + 'download/download-deals-pdf/view/' + dealId + '/' + filename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  viewReceiptPDF(filename) {
    let url = environment.apiUrl + 'download/download-receipt-pdf/view/' + '/' + filename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  downloadPDF(dealId, filename) {
    let url = environment.apiUrl + 'download/download-deals-pdf/download/' + dealId + '/' + filename;
    window.open(url, '_blank');
  }

  loadQuotations(filters) {
    let req = filters;
    return this.http.post(environment.apiUrl + 'sales/get-quotations', req);
  }

  loadDeals(filters): Observable<any> {
    let req = filters;
    return this.http.post(environment.apiUrl + 'deals/get-deals', req);
  }

  getSalesNeededData(needed) {
    let req = { needed: needed }
    return this.http.post(environment.apiUrl + 'sales/get-sales-needed-data', req);
  }

  saveDeal(deal: Deal) {

    deal.noOfProducts = deal.products.length;
    deal.modifiedBy = this.auth.getLoginEmailId();

    if (deal.id == 0)
      deal.createdBy = this.auth.getLoginEmailId();

    let req = {
      deal: deal,
      dealProducts: deal.products,
      instituteContacts: deal.instituteContacts
    };

    console.log(JSON.stringify(req));
    return this.http.post(environment.apiUrl + 'deals/save-deal', req);

  }

  getDealDetails(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal/' + dealId);
  }

  deleteDeal(dealId) {
    return this.http.get(environment.apiUrl + 'deals/delete-deal/' + dealId);
  }

  saveQuotation(quotation: Quotation) {
    quotation.noOfProducts = quotation.products.length;
    quotation.modifiedBy = this.auth.getLoginEmailId();

    if (quotation.id == 0)
      quotation.createdBy = this.auth.getLoginEmailId();

    let req = {
      quotation: quotation,
      quotationProducts: quotation.products,
      instituteContacts: quotation.instituteContacts
    };

    console.log(JSON.stringify(req));
    return this.http.post(environment.apiUrl + 'sales/save-quotation', req);
  }

  saveDealQuotation(dealquotation: DealQuotation) {

    dealquotation.modifiedBy = this.auth.getLoginEmailId();
    if (dealquotation.id == 0)
      dealquotation.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'deals/save-deal-quotation', dealquotation);
  }

  getDealQuotation(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-quotation/' + dealId);
  }

  saveDealInvoice(dealInvoice: DealInvoice) {
    dealInvoice.modifiedBy = this.auth.getLoginEmailId();
    if (dealInvoice.id == 0)
      dealInvoice.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'deals/save-deal-invoice', dealInvoice);
  }

  saveDealProformaInvoice(dealProformaInvoice: DealProformaInvoice) {
    dealProformaInvoice.modifiedBy = this.auth.getLoginEmailId();
    if (dealProformaInvoice.id == 0)
      dealProformaInvoice.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'deals/save-deal-proforma-invoice', dealProformaInvoice);
  }

  saveDealSalesOrder(so: DealSalesOrder) {
    so.modifiedBy = this.auth.getLoginEmailId();
    if (so.id == 0)
      so.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'deals/save-deal-sales-order', so);
  }

  getDealSalesOrder(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-sales-order/' + dealId);
  }

  getDealPurchaseOrder(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-purchase-order/' + dealId);
  }

  saveDealPurchaseOrder(po: DealPurchaseOrder) {
    po.modifiedBy = this.auth.getLoginEmailId();
    if (po.id == 0)
      po.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'deals/save-deal-purchase-order', po);
  }

  getDealProformaInvoice(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-proforma-invoice/' + dealId);
  }

  getDealInvoice(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-invoice/' + dealId);
  }

  getQuotationDetails(quoteId) {
    return this.http.get(environment.apiUrl + 'sales/get-quotation/' + quoteId);
  }

  getAllNotes(dealId) {
    let req = { dealId: dealId }
    return this.http.post(environment.apiUrl + 'deals/get-all-notes', req);
  }

  saveNote(note: Note, noteAttachments: Array<NoteAttachment>) {
    note.editedby = this.auth.getLoginEmailId();
    if (note.id == 0) {
      note.noteby = this.auth.getLoginEmailId();
    }

    let req = { note: note, noteAttachments: noteAttachments }
    return this.http.post(environment.apiUrl + 'deals/save-notes', req);
  }

  deleteNote(note: Note) {
    return this.http.post(environment.apiUrl + 'deals/delete-notes', note);
  }

  getNoteAttachment(attachment: NoteAttachment) {
    return this.http.post(environment.apiUrl + 'deals/get-note-attachment', attachment);
  }

  downloadNoteAttachmentProgress(attachment: NoteAttachment) {

    let options = {
      responseType: 'blob' as const,
      reportProgress: true as const,
      observe: 'events' as const,
      headers: new HttpHeaders().append("Content-Type", "application/json")
    }

    return this.http.get(environment.apiUrl + '/download/note-attachment/' + attachment.dealId + '/' + attachment.noteId + '/' + attachment.filename, options);
  }

  generateQuotationPDF(dealQuotation, template, addRoundSeal, addFullSeal, addSign, designation,
    preamble, preamblePosition, exportType, detailedPricing) {
    let req = {
      dealQuotation: dealQuotation, templateName: template, designation: designation,
      addRoundSeal: addRoundSeal, addFullSeal: addFullSeal, addSign: addSign, exportType: exportType,
      signatureBy: this.auth.getLoginEmailId(), preamble: preamble, preamblePosition: preamblePosition,
      detailedPricing: detailedPricing
    };
    return this.http.post(environment.apiUrl + 'deals/generate-quotation-pdf', req);
  }

  UploadGeneratedQuotationPDF(dealQuoteId, file) {
    let form = new FormData();
    form.append('dealQuoteId', dealQuoteId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/upload-generated-quotation-pdf', form);
  }

  generateInvoicePDF(dealInvoice, template, addRoundSeal, addFullSeal, addSign, designation) {
    let req = {
      dealInvoice: dealInvoice, templateName: template, designation: designation,
      addRoundSeal: addRoundSeal, addFullSeal: addFullSeal, addSign: addSign,
      signatureBy: this.auth.getLoginEmailId()
    };
    return this.http.post(environment.apiUrl + 'deals/generate-invoice-pdf', req);
  }

  UploadGeneratedInvoicePDF(dealInvoiceId, file) {
    let form = new FormData();
    form.append('dealInvoiceId', dealInvoiceId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/upload-generated-invoice-pdf', form);
  }

  generateProformaInvoicePDF(dealProformaInvoice, template, addRoundSeal, addFullSeal, addSign,
    designation, exportType, detailedPricing) {
    let req = {
      dealProformaInvoice: dealProformaInvoice, templateName: template, designation: designation,
      addRoundSeal: addRoundSeal, addFullSeal: addFullSeal, addSign: addSign, exportType: exportType,
      signatureBy: this.auth.getLoginEmailId(), detailedPricing: detailedPricing
    };
    return this.http.post(environment.apiUrl + 'deals/generate-proforma-invoice-pdf', req);
  }

  UploadGeneratedProformaInvoicePDF(dealProformaInvoiceId, file) {
    let form = new FormData();
    form.append('dealProformaInvoiceId', dealProformaInvoiceId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/upload-generated-proforma-invoice-pdf', form);
  }

  UploadGeneratedPurchaseOrderPDF(dealPurchaseOrderId, file) {
    let form = new FormData();
    form.append('dealPurchaseOrderId', dealPurchaseOrderId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/upload-generated-purchase-order-pdf', form);
  }


  generateSalesOrderPDF(salesOrder, template, addRoundSeal, addFullSeal, addSign, designation) {
    let req = {
      salesOrder: salesOrder, templateName: template, designation: designation,
      addRoundSeal: addRoundSeal, addFullSeal: addFullSeal, addSign: addSign,
      signatureBy: this.auth.getLoginEmailId()
    };
    return this.http.post(environment.apiUrl + 'deals/generate-sales-order-pdf', req);
  }

  UploadGeneratedSalesOrderPDF(dealSalesOrderId, file) {
    let form = new FormData();
    form.append('dealSalesOrderId', dealSalesOrderId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/upload-generated-sales-order-pdf', form);
  }

  getDealInvoicesPreview(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-invoice-preview/' + dealId);
  }

  getDealInvoicesReminders(dealId) {
    return this.http.get(environment.apiUrl + 'invoice/get-invoice-reminders/' + dealId);
  }

  saveDealPayment(dealPayment) {
    dealPayment.modifiedBy = this.auth.getLoginEmailId();
    if (dealPayment.id == 0)
      dealPayment.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'deals/save-deal-payment', dealPayment);
  }

  getDealPayments(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-payments/' + dealId);
  }

  deleteDealPayments(payment) {
    return this.http.post(environment.apiUrl + 'deals/delete-deal-payment', payment);
  }

  generateReceipt(payment, template, receiptContent, paymentDate, billingTo, designation, addFullSeal, addRoundSeal, addSign) {
    let req = {
      payment: payment, templateName: template, receiptContent: receiptContent, paymentDate: paymentDate,
      billingAddress: billingTo, designation: designation, addFullSeal: addFullSeal,
      addRoundSeal: addRoundSeal, addSign: addSign, signatureBy: this.auth.getLoginEmailId()
    };
    console.log("Final_Req::::", req);
    return this.http.post(environment.apiUrl + 'deals/create-deal-payment-receipt', req);
  }

  // generateReceipt(payment, receiptContent, designation, addFullSeal, addRoundSeal, addSign) {

  //   let req = {
  //     payment: payment, receiptContent: receiptContent, designation: designation, addFullSeal: addFullSeal,
  //     addRoundSeal: addRoundSeal, addSign: addSign, signatureBy: this.auth.getLoginEmailId()
  //   };
  //   return this.http.post(environment.apiUrl + 'deals/create-deal-payment-receipt', req);
  // }

  saveDealDeliveryChallan(dc: DeliveryChallan) {
    return this.http.post(environment.apiUrl + 'deals/save-deal-delivery-challan', dc);
  }

  deleteDealDeliveryChallan(dc: DeliveryChallan) {
    return this.http.post(environment.apiUrl + 'deals/delete-deal-delivery-challan', dc);
  }

  getDealDeliveryChallan(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-delivery-challan/' + dealId);
  }

  saveDealEmail(dealEmail) {
    return this.http.post(environment.apiUrl + 'deals/save-deal-email', dealEmail);
  }

  UploadDealEmailAttachment(dealEmailId, file) {
    let form = new FormData();
    form.append('dealEmailId', dealEmailId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'deals/add-deal-email-attachment', form);
  }

  sendDealEmail(dealEmail) {
    return this.http.post(environment.apiUrl + 'deals/send-deal-email', dealEmail);
  }

  getDealEmail(dealEmail) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-email', dealEmail);
  }

  getAmcPayment(id) {
    console.log(id);
    return this.http.get(environment.apiUrl + 'deals/get-amc-payments/' + id);
  }

  loadDealQuotationsReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-quotations-report', req);
  }

  loadDealPurchaseOrdersReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-purchase-orders-report', req);
  }

  loadDealProjectImplementationsReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-project-implementations-report', req);
  }

  loadDealSalesOrdersReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-sales-orders-report', req);
  }

  loadDealProformaInvoicesReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-proforma-invoices-report', req);
  }

  loadDealDeliveryChallansReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-delivery-challans-report', req);
  }

  loadPaymentsReport(req) {
    return this.http.post(environment.apiUrl + 'deals/get-deal-payments-report/', req);
  }

  saveDealProjectImplementation(dpim: DealProjectImplementation) {
    return this.http.post(environment.apiUrl + 'deals/save-deal-project-implementation', dpim);
  }

  getDealProjectImplementation(dealId) {
    return this.http.get(environment.apiUrl + 'deals/get-deal-project-implementation/' + dealId);
  }

  getSalesDashboardData(request) {
    return this.http.post(environment.apiUrl + 'sales/get-sales-dashboard-data', request);
  }

  saveDealProjectImplementationComments(request: DealProjectImplementationComment) {
    return this.http.post(environment.apiUrl + 'deals/save-deal-project-implementation-comments', request);
  }

  deleteDealProjectImplementationComments(request: DealProjectImplementationComment) {
    return this.http.post(environment.apiUrl + 'deals/delete-deal-project-implementation-comments', request);
  }

  getAllDealProjectImplementationComments(request: DealProjectImplementationComment) {
    return this.http.post(environment.apiUrl + 'deals/get-all-deal-project-implementation-comments', request);
  }

  getPreambleDocumentsList() {
    return this.http.get(environment.apiUrl + 'sales/get-preamble-document-list');
  }

  UploadPreamblePDF(file) {
    let form = new FormData();
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'sales/upload-preamble-document', form);
  }

  deletePreamblePDF(filename) {
    return this.http.get(environment.apiUrl + 'sales/delete-preamble-document/' + filename);
  }

  loadTermsAndConditions(type: string) {
    return this.http.get(environment.apiUrl + 'sales/get-terms-and-conditions/' + type);
  }

  saveTermsAndConditions(term: TermsAndConditions) {
    return this.http.post(environment.apiUrl + 'sales/save-terms-and-conditions/', term);
  }

  deleteTermsAndConditions(term: TermsAndConditions) {
    return this.http.post(environment.apiUrl + 'sales/delete-terms-and-conditions/', term);
  }

  saveInvoiceReminder(reminders: Array<DealInvoiceReminder>) {
    return this.http.post(environment.apiUrl + 'invoice/save-invoice-reminders/', { dealInvoiceReminders: reminders });
  }

  deleteInvoiceReminder(reminders: Array<DealInvoiceReminder>) {
    return this.http.post(environment.apiUrl + 'invoice/delete-invoice-reminders/', { dealInvoiceReminders: reminders });
  }

  searchDealsInvoiceReminders(request) {
    return this.http.post(environment.apiUrl + 'invoice/search-invoice-reminders/', request);
  }


  loadDealLetterpadReport(req) {
    return this.http.post(environment.apiUrl + 'accounts/get-all-letterpad', req);
  }

  UploadGeneratedLetterPDF(id, file) {
    let form = new FormData();
    form.append('id', id);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'accounts/upload-generated-letterpad-pdf', form);
  }


}
