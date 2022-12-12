import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SalesService } from 'src/app/_services/sales.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Deal } from '../deals-create/Deal';
import { DealEmail } from '../deals-emails/DealEmail';
import { InfoDetails } from 'src/app/info-details/infoDetails';
import { AgentService } from 'src/app/_services/agent.service';
import { CurrencyPipe } from '@angular/common';
import { DealPayment } from '../../invoices/deals-payments/DealPayment';

@Component({
  selector: 'app-deals-email-sender',
  templateUrl: './deals-email-sender.component.html',
  styleUrls: ['./deals-email-sender.component.css']
})
export class DealsEmailSenderComponent implements OnInit {

  constructor(private ss: SalesService, private snackbar: MatSnackBar,
    private currencyPipe: CurrencyPipe, private as: AgentService) { }

  @Input() subject: string;
  @Input() message: string;
  @Input() filename: string;
  @Input() tab: string;
  @Input() dealId: string;
  @Input() deal: Deal;
  @Input() payment?: DealPayment;

  @Output() resp = new EventEmitter<string>();

  dealEmail = new DealEmail();

  infoDetails: InfoDetails = new InfoDetails();
  files = [];
  loading = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Summary about the ticket',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['insertImage', 'insertVideo', 'insertHorizontalRule', 'backgroundColor', 'textColor',
        'customClasses', 'link', 'unlink',]
    ]
  };

  ngOnInit() {
    this.loadInfoDetails();
  }

  sendResp(resp) {
    this.resp.next('close');
  }

  loadInfoDetails() {
    if (localStorage.getItem('infoDetails')) {
      this.infoDetails = JSON.parse(localStorage.getItem('infoDetails'));
      this.prepareMail();
    } else {
      this.as.getInfoDetails(1).subscribe(resp => {
        if (resp['StatusCode'] == '00') {
          this.infoDetails = resp['infoDetails'];
          localStorage.setItem('infoDetails', JSON.stringify(this.infoDetails));
          this.prepareMail();
        }
      });
    }
  }

  prepareMail() {


    console.log(this.deal, this.dealEmail);

    this.dealEmail.subject = this.subject;
    this.dealEmail.filename = this.filename;
    this.dealEmail.dealId = +this.dealId;

    if (this.deal.institute.emailId != null && this.deal.institute.emailId != '') {
      this.dealEmail.mailIds = this.deal.institute.emailId;
      this.dealEmail.mailIdCC = this.deal.institute.alternateEmailId;
    } else if (this.deal.institute.alternateEmailId != null && this.deal.institute.alternateEmailId != '') {
      this.dealEmail.mailIds = this.deal.institute.alternateEmailId;
    }
    this.dealEmail.createdBy = this.ss.auth.getLoginEmailId();
    this.dealEmail.tab = this.tab;

    let message = 'Dear Sir/Madam,<br><br>'
    if (this.tab.toUpperCase() == 'QUOTATION') {
      this.dealEmail.subject = `${this.infoDetails.cmpName} - Quotation No: #${this.deal.quoteNo}`;
      message = message + 'Please see the attached Quotation <br><br>'
        + 'Quotation No : ' + this.deal.quoteNo;
      message = message + '<br>Payable Amount : Rs.' + this.deal.grandTotal;
    } else if (this.tab.toUpperCase() == 'SALES ORDER') {
      this.dealEmail.subject = `${this.infoDetails.cmpName} - Sales Order No: #${this.deal.salesOrderNo}`;
      message = message + 'Please see the attached Sales Order <br><br>'
        + 'Sales Order No : ' + this.deal.salesOrderNo;
      message = message + '<br>Payable Amount : Rs.' + this.deal.grandTotal;
    } else if (this.tab.toUpperCase() == 'PROFORMA INVOICE') {
      this.dealEmail.subject = `${this.infoDetails.cmpName} - Proforma Invoice No: #${this.deal.proformaInvoiceNo}`;
      message = message + 'Please see the attached Proforma Invoice <br><br>'
        + 'Proforma Invoice No : ' + this.deal.proformaInvoiceNo;
      message = message + '<br>Payable Amount : Rs.' + this.deal.grandTotal;
    } else if (this.tab.toUpperCase() == 'INVOICE') {
      this.dealEmail.subject = `${this.infoDetails.cmpName} - Invoice No: #${this.deal.invoiceNo}`;
      message = message + 'Please see the attached Invoice <br><br>'
        + 'Invoice No : ' + this.deal.invoiceNo;
      message = message + '<br>Payable Amount : Rs.' + this.deal.grandTotal;
    } else if (this.tab.toUpperCase() == 'PAYMENT') {
      this.dealEmail.subject = `${this.infoDetails.cmpName} - Payment Received - #${this.payment.id}`;
      message = message + 'Please see the attached Payment Receipt <br><br>'
        + 'Payment Id : #' + this.payment.id;
      message = message + '<br>Invoice No : #' + this.deal.invoiceNo;
      message = message + '<br>Total Invoice Amount : Rs.' + this.deal.grandTotal;
      message = message + '<br>Paid Amount : Rs.' + this.payment.totalAmount;

      message = message + '<br><br>Reference No : ' + this.payment.referenceno;
      message = message + '<br>Drawn on : ' + this.payment.drawnon;
      message = message + '<br>Mode Of Payment : ' + this.payment.mode;
    }

    if (this.infoDetails.instamojoPaymentURL != '' && this.infoDetails.instamojoPaymentURL != null && this.infoDetails.instamojoPaymentURL != undefined) {
      message = message + `<br><br>You can pay with below Online payment link <br> <a target=_blank href=${this.infoDetails.instamojoPaymentURL}>` + this.infoDetails.instamojoPaymentURL + `<a>`;
    }

    message = message + '<br><br>Thanks<br>' + this.infoDetails.cmpName
      + '<br>' + this.infoDetails.cmpAddress + '<br>'
      + this.infoDetails.cmpPhone + '/' + this.infoDetails.cmpLandLine + '<br>'
      + this.infoDetails.cmpEmail + '<br>' + this.infoDetails.cmpWebsiteUrl;


    this.dealEmail.message = message;
  }

  saveDealMail() {

    let sizeExceed = false;
    this.files.forEach(file => {
      if (file.size > 15000000) {
        sizeExceed = true;
        this.snackbar.open('"' + file.name + '" exceeds 15MB.')
      }
    });

    if (sizeExceed) {
      return false;
    }

    this.loading = true;
    // let dealEmail = {
    //   subject: this.subject, message: this.message, dealId: this.dealId, tab: this.tab,
    //   mailIds: this.mailIds, mailIdCC: this.mailIdCC, createdBy: this.createdBy, filename: this.filename
    // }
    this.ss.saveDealEmail(this.dealEmail).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.uploadAttachments(res['DealEmail']);
      } else {
        this.loading = false;
        this.snackbar.open('Something went wrong');
      }
    }, error => { this.loading = false; })
  }

  uploadAttachments(dealEmail) {
    let fileslength = this.files.length;
    let successCount = 0;
    let failedCount = 0;

    if (fileslength == 0) {
      this.sendDealMail(dealEmail);
    } else {
      this.files.forEach(file => {
        this.ss.UploadDealEmailAttachment(dealEmail.id, file).subscribe(res => {
          if (res['StatusCode'] && res['StatusCode'] == '00')
            successCount = successCount + 1;
          else
            failedCount = failedCount + 1;

          if (fileslength == successCount + failedCount) {
            this.sendDealMail(dealEmail);
          }
        })
      });
    }
  }

  sendDealMail(dealEmail) {
    this.ss.sendDealEmail(dealEmail).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        this.snackbar.open('Mail Sent Successfully');
        this.resp.next('success');
      } else if (res['StatusCode'] == '03') {
        this.snackbar.open(res['StatusDesc']);
      } else {
        this.snackbar.open('Failed to sent mail , Try again later');
      }
    }, error => { this.loading = false; })
  }

  //File Drop Functions


  public filesDrop: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.filesDrop = files;
    for (const droppedFile of this.filesDrop) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          this.files.push(file);

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }


}
