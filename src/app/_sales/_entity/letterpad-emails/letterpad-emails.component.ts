import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from 'src/app/_services/sales.service';
import { LetterpadEmail } from './LetterpadEmail';
declare var $: any;

@Component({
  selector: 'app-letterpad-emails',
  templateUrl: './letterpad-emails.component.html',
  styleUrls: ['./letterpad-emails.component.css']
})
export class LetterpadEmailsComponent implements OnInit {

  constructor(private ss: SalesService, private snackbar: MatSnackBar) { }

  @Input("dealId") dealId: number;

  mails: Array<LetterpadEmail> = [];
  mailAttachments: Array<any> = [];

  ngOnInit() {
    this.loadEmails();
  }

  loadEmails() {
    this.ss.getDealEmail({ dealId: this.dealId }).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.mails = res['DealEmails'];
        this.mailAttachments = res['DealEmailAttachments'];

        this.mails.sort((a, b) => b.id - a.id)
      }
    })
  }

  resendDealMail(dealEmail) {
    this.snackbar.open('Sending mail...');
    this.ss.sendDealEmail(dealEmail).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.snackbar.open('Mail Sent Successfully');
      } else {
        this.snackbar.open('Failed to sent mail, Try again later');
      }
    })
  }

}

