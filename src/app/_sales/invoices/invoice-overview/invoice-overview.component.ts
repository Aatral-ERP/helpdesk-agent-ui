import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';
import { AuthService } from 'src/app/_services/auth.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { DealInvoice } from '../invoice-create/DealInvoice';
declare var $: any;
@Component({
  selector: 'app-invoice-overview',
  templateUrl: './invoice-overview.component.html',
  styleUrls: ['./invoice-overview.component.css']
})
export class InvoiceOverviewComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    console.log('onDestroy')
    this.titleService.setTitle(environment.title);
  }

  constructor(private titleService: Title, private invServ: InvoiceService, private auth: AuthService,
    private route: Router, private actRoutor: ActivatedRoute, public su: SalesUtilService,
    private snackbar: MatSnackBar, private currencyPipe: CurrencyPipe) {
    this.invoiceId = this.actRoutor.snapshot.params['id'];

    this.actRoutor.params.subscribe(params => {
      console.log(params);

      // if (this.actRoutor.snapshot.params['tab'] == 'invoice')
      //   this.tab = 0;
      // else if (this.actRoutor.snapshot.params['tab'] == 'payments')
      //   this.tab = 1;
      // else
      this.tab = 0;
    })
  }

  shareWhatsappText = '';
  shareWhatsappTo = '+91';

  role: RoleMaster = this.invServ.auth.getLoggedInRole();

  invoice: DealInvoice = new DealInvoice();
  invoiceId = 0;
  tab = 0;
  invoiceNo = '';
  rowData = [];
  InvAmcDetails: Array<any> = [];
  reminder = false;

  showPDFTemplateOptions = false;
  showDCTemplateOptions = false;
  generatingPDF = false;
  showAddNewEmail = false;
  loading = false;
  loading_split_invoices = false;
  _split_invoices: Array<DealInvoice> = [];

  exportType = "PDF";
  addRoundSeal = true;
  addFullSeal = true;
  addSign = true;
  detailedPricing = true;
  designation = this.auth.getLoginAgentDesignation();

  ngOnInit() {
    this.loadDealInvoice();
  }

  loadDealInvoice() {
    this.loading = true;
    this.invServ.getDealInvoice(this.invoiceId).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        if (res['DealInvoice'] != null) {
          this.invoice = res['DealInvoice'];

          if (!this.role.salesAdmin) {
            if (this.invoice.createdBy != this.invServ.auth.getLoginEmailId()) {
              this.snackbar.open('You are not Creator of this Invoice #' + this.invoice.invoiceNo);
              this.route.navigateByUrl('');
            }
          }

          this.invoice.billingTo = this.invoice.billingTo.replace(/(?:\r\n|\r|\n)/g, '<br>');
          this.invoice.shippingTo = this.invoice.shippingTo.replace(/(?:\r\n|\r|\n)/g, '<br>');

          this.invoice.products = res['DealInvoiceProducts'];
          let dealInvoiceContacts: Array<any> = res['DealInvoiceContacts'];
          this.invoice.instituteContacts = [];
          this.titleService.setTitle(this.currencyPipe.transform(this.invoice.grandTotal, 'INR') + ' - ' + this.invoice.institute.instituteName);
          console.log(this.titleService.getTitle());
          dealInvoiceContacts.forEach(ic => {
            console.log(ic);
            this.invoice.instituteContacts.push(ic.instituteContact);
          })
          this.invoice.products.forEach(prod => prod.description = prod.description.replace(/(?:\r\n|\r|\n)/g, '<br>'));
          console.log(this.invoice.instituteContacts);

          if (this.invoice.terms != null)
            this.invoice.terms.replace(/(?:\r\n|\r|\n)/g, '<br>')

          if (this.invoice.purchaseOrderNo !== undefined && this.invoice.purchaseOrderNo != null && this.invoice.purchaseOrderNo != '')
            this.loadSplitInvoices();

        } else {
          this.snackbar.open('No Invoice Found');
        }
      } else {
        this.snackbar.open('No Invoice Found');
      }
      console.log("Check NO In::::", this.invoice.invoiceNo);
      //this.invoiceNo=this.invoice.invoiceNo;
      // this.inst.getAMCEntries(this.invoice.invoiceNo).subscribe(res => {
      //   console.log(res);

      //   //  this.InvAmcDetails = new Array();
      //   this.InvAmcDetails = res['InvAmcDetails'];
      // })
    }, error => this.loading = false);
  }

  loadSplitInvoices() {

    this.loading_split_invoices = true;
    this.invServ.loadInvoicesReport({ 'poNo': this.invoice.purchaseOrderNo }).subscribe(res => {
      this.loading_split_invoices = false;
      this._split_invoices = res['DealInvoices'];
    }, error => { this.loading_split_invoices = false; })

  }


  // tabChange(event) {
  //   console.log(event);

  //   if (event.index == 0)
  //     this.route.navigate(['/sales/invoices/overview/' + this.invoiceId + '/invoice']);
  //   else if (event.index == 1)
  //     this.route.navigate(['/sales/invoices/overview/' + this.invoiceId + '/payments']);
  //   else
  //     this.route.navigate(['/sales/invoices/overview/' + this.invoiceId + '/invoice']);
  // }

  routeToInstitutionDetail() {
    this.route.navigateByUrl('/institute/institute-detail?iid=' + this.invoice.institute.instituteId);
  }

  EditDealInvoice() {
    this.route.navigateByUrl('/sales/invoices/create?edit=1&invid=' + this.invoiceId);
  }

  generateDCPDF(TemplateName) {
    this.generatingPDF = true;

    this.invServ.generateDCPDF(this.invoice, TemplateName).subscribe(res => {

      this.generatingPDF = false;
      if (res['StatusCode'] == '00') {
        this.invoice.dcfilename = res['DealInvoice']['dcfilename'];
        this.snackbar.open('Generated Successfully');
        this.viewDCPDF();
      } else {
        this.snackbar.open('Something went wrong! Try again later');
      }
    })
  }

  generateInvoicePDF(TemplateName) {
    this.generatingPDF = true;

    this.invServ.generateInvoicePDF(this.invoice, TemplateName, this.addRoundSeal, this.addFullSeal,
      this.addSign, this.designation, this.exportType, this.detailedPricing).subscribe(res => {

        this.generatingPDF = false;
        if (res['StatusCode'] == '00') {
          this.invoice.filename = res['DealInvoice']['filename'];
          this.snackbar.open('Generated Successfully');
          if (this.invoice.filename.endsWith(".pdf"))
            this.viewPDF();
        } else {
          this.snackbar.open('Something went wrong! Try again later');
        }
      })
  }

  viewPDF() {
    let url = environment.apiUrl + 'download/download-invoice-pdf/view/' + this.invoiceId + '/' + this.invoice.filename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  viewWorkCompletionCertificatePDF() {
    let url = environment.apiUrl + 'download/download-invoice-pdf/view/' + this.invoiceId + '/' + this.invoice.workCompletionCertificate;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  viewSatisfactoryCertificatePDF() {
    let url = environment.apiUrl + 'download/download-invoice-pdf/view/' + this.invoiceId + '/' + this.invoice.satisfactoryCertificate;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  viewDCPDF() {
    let url = environment.apiUrl + 'download/download-delivery-challan-pdf/view/' + this.invoiceId + '/' + this.invoice.dcfilename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  downloadPDF() {
    let url = environment.apiUrl + 'download/download-invoice-pdf/download/' + this.invoiceId + '/' + this.invoice.filename;
    window.open(url, '_blank');
  }

  downloadWorkCompletionCertificatePDF() {
    let url = environment.apiUrl + 'download/download-invoice-pdf/download/' + this.invoiceId + '/' + this.invoice.workCompletionCertificate;
    window.open(url, '_blank');
  }

  downloadSatisfactoryCertificatePDF() {
    let url = environment.apiUrl + 'download/download-invoice-pdf/download/' + this.invoiceId + '/' + this.invoice.satisfactoryCertificate;
    window.open(url, '_blank');
  }

  downloadDCPDF() {
    let url = environment.apiUrl + 'download/download-delivery-challan-pdf/download/' + this.invoiceId + '/' + this.invoice.dcfilename;
    window.open(url, '_blank');
  }

  satisfactoryFileUploadChange(file: File) {
    console.log(file);

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Upload.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload!'
    }).then((result) => {
      if (result.value) {
        this.generatingPDF = true;
        this.invServ.UploadInvoiceSatisfactoyPDF(this.invoice.id, file).subscribe(res => {

          this.generatingPDF = false;
          if (res['StatusCode'] == '00') {
            this.invoice.satisfactoryCertificate = res['DealInvoice']['satisfactoryCertificate'];
            this.snackbar.open('Uploaded Successfully', 'OK');
            if (this.invoice.satisfactoryCertificate.endsWith(".pdf"))
              this.viewSatisfactoryCertificatePDF();
          } else {
            this.snackbar.open('Something went wrong! Try again later');
          }
        })
      }
    })
  }

  workCompletionFileUploadChange(file: File) {
    console.log(file);

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Upload.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload!'
    }).then((result) => {
      if (result.value) {
        this.generatingPDF = true;
        this.invServ.UploadInvoiceWorkCompletionPDF(this.invoice.id, file).subscribe(res => {

          this.generatingPDF = false;
          if (res['StatusCode'] == '00') {
            this.invoice.workCompletionCertificate = res['DealInvoice']['workCompletionCertificate'];
            this.snackbar.open('Uploaded Successfully', 'OK');
            if (this.invoice.workCompletionCertificate.endsWith(".pdf"))
              this.viewWorkCompletionCertificatePDF();
          } else {
            this.snackbar.open('Something went wrong! Try again later');
          }
        })
      }
    })
  }

  invoiceFileUploadChange(file: File) {
    console.log(file);

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Upload.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload!'
    }).then((result) => {
      if (result.value) {
        this.generatingPDF = true;
        this.invServ.UploadGeneratedInvoicePDF(this.invoice.id, file).subscribe(res => {

          this.generatingPDF = false;
          if (res['StatusCode'] == '00') {
            this.invoice.filename = res['DealInvoice']['filename'];
            this.snackbar.open('Uploaded Successfully', 'OK');
            if (this.invoice.filename.endsWith(".pdf"))
              this.viewPDF();
          } else {
            this.snackbar.open('Something went wrong! Try again later');
          }
        })
      }
    })
  }

  resp(event) {
    console.log(event);
    if (event == 'close' || event == 'success') {
      this.showAddNewEmail = false;
    }
  }

  openShareWhatsAppModal() {

    let url = environment.apiUrl + 'download/download-invoice-pdf/view/' + this.invoiceId + '/' + this.invoice.filename;

    this.shareWhatsappText = this.invoice.subject + '\n' +
      'Invoice Number : ' + this.invoice.invoiceNo + '\n\n' +
      'View Invoice by below url : \n\n' +
      url + ' \n\n'
      + 'Thanks\n' + this.auth.getLoginAgentFullName();

    console.log(this.shareWhatsappText);

    $(function () {
      $('#whatsappShareModal').appendTo("body").modal('show');
    });
  }


  shareWhatsApp() {
    let url = `https://wa.me/${this.shareWhatsappTo}?text=${encodeURI(this.shareWhatsappText)}`;
    window.open(url, '_blank');
  }

}
