import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { InfoDetails } from 'src/app/info-details/infoDetails';
import { LetterpadEmail } from 'src/app/_sales/_entity/letterpad-emails/LetterpadEmail';
import { CurrencyPipe } from '@angular/common';
import { SalesService } from 'src/app/_services/sales.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentService } from 'src/app/_services/agent.service';
import { LatterpadDeal } from 'src/app/_admin/create-letterpad/LetterpadDeal';
declare var $: any;



@Component({
  selector: 'app-letterpad-email-sender',
  templateUrl: './letterpad-email-sender.component.html',
  styleUrls: ['./letterpad-email-sender.component.css']
})
export class LetterpadEmailSenderComponent implements OnInit {

  constructor(private currencyPipe: CurrencyPipe,private ss: SalesService, private snackbar: MatSnackBar,private as: AgentService) { }


  @Input() subject: string;
  @Input() message: string;
  @Input() filename: string;
  @Input() tab: string;
  @Input() dealId: string;
  @Input() deal: LatterpadDeal;

  
  

  @Output() resp = new EventEmitter<string>();

  letterEmail = new LetterpadEmail();

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

  saveDealMail()
  {
    

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
    this.ss.saveDealEmail(this.letterEmail).subscribe(res => {
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

  prepareMail() {


    console.log(this.deal, this.letterEmail);

    this.letterEmail.subject = this.subject;
    this.letterEmail.filename = this.filename;
    this.letterEmail.id = +this.dealId;
    this.letterEmail.dealId = +this.dealId;

    if (this.deal.institute.emailId != null && this.deal.institute.emailId != '') {
      this.letterEmail.mailIds = this.deal.institute.emailId;
      this.letterEmail.mailIdCC = this.deal.institute.alternateEmailId;
    } else if (this.deal.institute.alternateEmailId != null && this.deal.institute.alternateEmailId != '') {
      this.letterEmail.mailIds = this.deal.institute.alternateEmailId;
    }
    this.letterEmail.createdBy = this.ss.auth.getLoginEmailId();
    this.letterEmail.tab = this.tab;

    let message = 'Hi,<br><br>'
    if (this.tab.toUpperCase() == 'LETTERPAD') {
      message = message + 'Please see the attached Letterpad <br><br>';
      message = message + '<br>Letterpad No : #' + this.deal.id;
      message = message + '<br>Subject  :  ' + this.letterEmail.subject;
    
    }

    // if (this.infoDetails.instamojoPaymentURL != '' && this.infoDetails.instamojoPaymentURL != null && this.infoDetails.instamojoPaymentURL != undefined) {
    //   message = message + `<br><br>You can pay with below Online payment link <br> <a target=_blank href=${this.infoDetails.instamojoPaymentURL}>` + this.infoDetails.instamojoPaymentURL + `<a>`;
    // }

    message = message + '<br><br>Thanks<br>' + this.infoDetails.cmpName
      + '<br>' + this.infoDetails.cmpAddress + '<br>'
      + this.infoDetails.cmpPhone + '/' + this.infoDetails.cmpLandLine + '<br>'
      + this.infoDetails.cmpEmail + '<br>' + this.infoDetails.cmpWebsiteUrl;


    this.letterEmail.message = message;
  }

}
