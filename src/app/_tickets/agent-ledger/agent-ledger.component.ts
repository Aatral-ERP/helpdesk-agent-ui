import { Component, OnInit } from '@angular/core';
import { AgentLedger } from './AgentLedger';
import { AccountingService } from 'src/app/_services/accounting.service';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/_services/auth.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-agent-ledger',
  templateUrl: './agent-ledger.component.html',
  styleUrls: ['./agent-ledger.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class AgentLedgerComponent implements OnInit {

  constructor(private accServ: AccountingService, private auth: AuthService,
    private snackbar: MatSnackBar, private datePipe: DatePipe) { }

  loading = false;
  saving = false;
  showNewLedger = false;

  totalCredit = 0;
  totalDebit = 0;

  selectFile = null;
  photoLoading = false;

  addMode = 'Debit';

  ngOnInit() {
    this.getAgentLedger();
  }

  newLedger = new AgentLedger();
  ledger: Array<AgentLedger> = [];

  getAgentLedger() {
    this.loading = true;
    this.totalCredit = 0;
    this.totalDebit = 0;
    this.accServ.getAgentLedger(this.auth.getAgentDetails()).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        let _balance = 0;
        this.ledger = resp['AgentLedger'];

        this.ledger
          .sort((a, b) => +new Date(a.paymentDate) - +new Date(b.paymentDate))
          .forEach(ledg => {
            //Calculating Balance for each ledger

            if (ledg.credit > 0)
              _balance = _balance + ledg.credit;
            else if (ledg.debit > 0)
              _balance = _balance - ledg.debit;

            ledg.balance = _balance;

            // Calculating totalCredit and totalDebit
            if (ledg.credit > 0) {
              this.totalCredit = this.totalCredit + ledg.credit;
            } else if (ledg.debit > 0) {
              this.totalDebit = this.totalDebit + ledg.debit;
            }
          });
        this.ledger.sort((a, b) => +new Date(b.paymentDate) - +new Date(a.paymentDate));
      }
    }, error => this.loading = false);
  }

  addLedger() {

    if (this.addMode == 'Debit') {
      if (isNaN(this.newLedger.debit) || this.newLedger.debit == null || this.newLedger.debit <= 0) {
        this.snackbar.open('Enter Valid Debit Amount');
        return;
      }
      this.newLedger.credit = 0;
    } else if (this.addMode == 'Credit') {
      if (isNaN(this.newLedger.credit) || this.newLedger.credit == null || this.newLedger.credit <= 0) {
        this.snackbar.open('Enter Valid Credit Amount');
        return;
      }
      this.newLedger.debit = 0;
    }


    if (this.newLedger.paymentDate == null) {
      this.snackbar.open('Choose Payment Date');
      return;
    }

    this.newLedger.agentEmailId = this.auth.getLoginEmailId();

    this.saving = true;
    this.accServ.addLedger(this.newLedger).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == '00') {
        this.newLedger = new AgentLedger();
        this.showNewLedger = false;
        this.getAgentLedger();
      }
    }, error => this.saving = false);
  }

  openNewLedger() {
    this.showNewLedger = true;
    this.newLedger = new AgentLedger();
  }

  editLedger(led: AgentLedger) {
    this.newLedger = led;
    this.showNewLedger = true;
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  isEditable(_legder: AgentLedger) {

    if (_legder.debit > 0) {
      let editable_date: Date = new Date();

      let created_date: Date = new Date(_legder.createddatetime);
      created_date.setDate(new Date().getDate() + 3);

      if (editable_date < created_date) {
        return true;
      }
    }

    return false;
  }

  downlaodTransasImage(_legder: AgentLedger) {
    let canvas: any = document.createElement("canvas"),
      ctx = canvas.getContext('2d'),
      img = document.createElement("img");

    let textElement = `\n\nTrans Id #${_legder.id}\n${_legder.subject}\n\n`;
    if (_legder.credit > 0) {
      textElement = textElement + `Credited Amount : Rs.${_legder.credit}\n`;
    } else {
      textElement = textElement + `Debited Amount : Rs.${_legder.debit}\n`;
    }
    textElement = textElement + `Staff Email : ${_legder.agentEmailId}\n`;
    textElement = textElement + `Payment Date : ${this.datePipe.transform(_legder.paymentDate, 'dd/MM/yyyy')}\n\n`;
    textElement = textElement + `Trasaction Entry Time : ${this.datePipe.transform(_legder.createddatetime, 'dd/MM/yyyy h:mm a')}\n\n`;

    textElement = textElement + `Attachment : ${_legder.filename}\n\n`;

    var text = textElement.split("\n").join("\n");
    var x = 30;
    var y = 15;
    var lineheight = 30;
    var lines = text.split('\n');
    var lineLengthOrder = lines.slice(0).sort(function (a, b) {
      return b.length - a.length;
    });
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.fillStyle = "#232323";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = "middle";
    ctx.font = "20px Anonymous Pro";
    ctx.fillStyle = "#BBBBBB";
    for (var i = 0; i < lines.length; i++)
      ctx.fillText(lines[i], x, y + (i * lineheight));

    console.log(ctx.canvas.toDataURL());

    var a = document.createElement("a");
    a.href = ctx.canvas.toDataURL();
    a.download = _legder.id + '';
    a.click();

  }

  fileChange(event, ledger: AgentLedger) {
    console.log(ledger);
    this.selectFile = event.target.files[0];
    this.uploadLegderProof(ledger);
  }

  uploadLegderProof(ledger: AgentLedger) {
    this.snackbar.open('Uploading....')
    this.photoLoading = true;
    this.accServ.uploadLegderProof(this.selectFile, ledger.id).subscribe(res => {
      this.photoLoading = false;
      if (res['StatusCode'] == '00') {
        let ledger = res['AgentLedger'];
        let _legder = this.ledger.find(_led => _led.id == ledger.id);

        if (_legder !== undefined) {
          _legder.filename = ledger.filename;
          let index = this.ledger.findIndex(_led => _led.id == ledger.id);
          this.ledger[index].filename = ledger.filename;
        }

        this.snackbar.open('Uploaded Successfully');

      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => { this.photoLoading = false; })
  }

  viewLegderProof(mode, ledger: AgentLedger) {
    if (ledger.filename.toLowerCase().endsWith('png') || ledger.filename.toLowerCase().endsWith('jpeg') || ledger.filename.toLowerCase().endsWith('jpg') || ledger.filename.toLowerCase().endsWith('svg'))
      window.open(environment.contentPath + 'agent-legder-proof/image/' + mode + '/' + ledger['filename'], '_blank');
    else
      window.open(environment.contentPath + 'agent-legder-proof/pdf/' + mode + '/' + ledger['filename'], '_blank');
  }


}
