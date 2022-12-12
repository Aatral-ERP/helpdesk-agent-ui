import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { InfoDetails } from 'src/app/info-details/infoDetails';
import { AgentService } from 'src/app/_services/agent.service';
import { DealInvoice } from '../invoice-create/DealInvoice';
import { InvoiceEmail } from './InvoiceEmail';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoices-email-sender',
  templateUrl: './invoices-email-sender.component.html',
  styleUrls: ['./invoices-email-sender.component.css']
})
export class InvoicesEmailSenderComponent implements OnInit {

  constructor(private is: InvoiceService, private snackbar: MatSnackBar,
    private as: AgentService, private datePipe: DatePipe) { }

  @Input() subject: string;
  @Input() message: string;
  @Input() filename: string;
  @Input() tab: string;
  @Input() invoiceId: number;
  @Input() invoice: DealInvoice;
  @Input() reminder: boolean;

  @Output() resp = new EventEmitter<string>();

  invoiceEmail = new InvoiceEmail();

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
    console.log(this.invoice, this.reminder);
    let message = 'Hi,<br><br>';

    if (!this.reminder) {
      this.invoiceEmail.subject = `${this.infoDetails.cmpName} - Invoice No: #${this.invoice.invoiceNo}`;
    } else {

      this.invoiceEmail.subject = 'Payment for Invoice #' + this.invoice.invoiceNo + ' is pending';

      message = message + `This is just a reminder that payment on invoice #${this.invoice.invoiceNo} 
      (total Rs.${this.invoice.grandTotal}), which we sent on 
      ${this.datePipe.transform(this.invoice.invoiceDate, 'MMM dd, yyyy')} is on due . 
      You can make payment to the bank account specified on the invoice.
      <br>
      If you have any questions please let us know.<br><br>`

    }

    message = message + 'Please see the attached Invoice <br><br>'
      + 'Invoice No : ' + this.invoice.invoiceNo + '<br>Payable Amount : Rs.' + this.invoice.grandTotal;

    if (this.infoDetails.instamojoPaymentURL != '' && this.infoDetails.instamojoPaymentURL != null && this.infoDetails.instamojoPaymentURL != undefined) {
      message = message + `<br><br>You can pay with below Online payment link <br> <a target=_blank href=${this.infoDetails.instamojoPaymentURL}>` + this.infoDetails.instamojoPaymentURL + `<a>`;
    }
    message = message + '<br><br>Thanks<br>' + this.infoDetails.cmpName
      + '<br>' + this.infoDetails.cmpAddress + '<br>'
      + this.infoDetails.cmpPhone + '/' + this.infoDetails.cmpLandLine + '<br>'
      + this.infoDetails.cmpEmail + '<br>' + this.infoDetails.cmpWebsiteUrl;

    this.invoiceEmail.filename = this.filename;
    this.invoiceEmail.invoiceId = +this.invoiceId;

    if (this.invoice.institute.emailId != null && this.invoice.institute.emailId != '') {
      this.invoiceEmail.mailIds = this.invoice.institute.emailId;
      this.invoiceEmail.mailIdCC = this.invoice.institute.alternateEmailId;
    } else if (this.invoice.institute.alternateEmailId != null && this.invoice.institute.alternateEmailId != '') {
      this.invoiceEmail.mailIds = this.invoice.institute.alternateEmailId;
    }
    this.invoiceEmail.createdBy = this.is.auth.getLoginEmailId();
    this.invoiceEmail.tab = this.tab;

    this.invoiceEmail.message = message;

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
    this.is.saveInvoiceEmail(this.invoiceEmail).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.uploadAttachments(res['InvoiceEmail']);
      } else {
        this.loading = false;
        this.snackbar.open('Something went wrong');
      }
    }, error => { this.loading = false; })
  }

  uploadAttachments(invoiceEmail) {
    let fileslength = this.files.length;
    let successCount = 0;
    let failedCount = 0;

    if (fileslength == 0) {
      this.sendInvoiceMail(invoiceEmail);
    } else {
      this.files.forEach(file => {
        this.is.UploadInvoiceEmailAttachment(invoiceEmail.id, file).subscribe(res => {
          if (res['StatusCode'] && res['StatusCode'] == '00')
            successCount = successCount + 1;
          else
            failedCount = failedCount + 1;

          if (fileslength == successCount + failedCount) {
            this.sendInvoiceMail(invoiceEmail);
          }
        })
      });
    }
  }

  sendInvoiceMail(invoiceEmail) {
    this.is.sendInvoiceEmail(invoiceEmail).subscribe(res => {
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
