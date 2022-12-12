import { Component, OnInit } from '@angular/core';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material';
import { AccountingService } from 'src/app/_services/accounting.service';
import { AgentLedger } from 'src/app/_tickets/agent-ledger/AgentLedger';
import { AuthService } from 'src/app/_services/auth.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { AGGridButtonRendererComponent } from 'src/app/_modules/common/ag-grid-button-renderer.component';
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
  selector: 'app-staff-expense-ledger',
  templateUrl: './staff-expense-ledger.component.html',
  styleUrls: ['./staff-expense-ledger.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class StaffExpenseLedgerComponent implements OnInit {

  constructor(private accServ: AccountingService, private auth: AuthService, private snackbar: MatSnackBar,
    private currencyPipe: CurrencyPipe, private datePipe: DatePipe) {
    this.frameworkComponents = {
      buttonRenderer: AGGridButtonRendererComponent,
    }
  }

  dateObject = null;
  fromDate: Date = null;
  toDate: Date = null;

  newLedger = new AgentLedger();
  ledgerType = 'Credit';
  ledger: Array<AgentLedger> = [];
  ledger_show: Array<AgentLedger> = [];

  _agents = [];
  _selectedAgents = [];

  loading = false;
  saving = false;
  showNewLedger = false;

  totalCredit = 0;
  totalDebit = 0;

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  _agentDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'emailId',
    textField: 'firstName',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  frameworkComponents: any;

  columnDefs = [
    // {
    //   headerName: '', field: 'id', width: 40,
    //   cellRenderer: 'buttonRenderer',
    //   cellRendererParams: {
    //     onClick: this.editLedger.bind(this),
    //     label: null
    //   }
    // },
    {
      headerName: '', field: 'id', width: 40, resizable: true,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.downlaodTransasImage.bind(this),
        label: null,
        iconURL: "<i class='fa fa-download text-primary'></i>"
      }
    },
    { headerName: 'Id', field: 'id', width: 60, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }, },
    {
      headerName: 'Payment Date', field: 'paymentDate', width: 150, sortable: true, filter: true, resizable: true,
      tooltip: (data) => { return data.value },
      cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    { headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true, minWidth: 240, tooltip: (data) => { return data.value }, },
    {
      headerName: 'Credit', field: 'credit', width: 120, sortable: true, filter: true, cellRenderer: (data) => {
        if (data.value > 0)
          return this.currencyPipe.transform(data.value, 'INR');
        else
          return "";
      }
    },
    {
      headerName: 'Debit', field: 'debit', width: 120, sortable: true, filter: true, cellRenderer: (data) => {
        if (data.value > 0)
          return this.currencyPipe.transform(data.value, 'INR');
        else
          return "";
      }
    },
    {
      headerName: 'Balance', field: 'balance', width: 120, sortable: true, filter: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Attachment', field: 'filename', width: 150, sortable: true, filter: true, resizable: true,
      tooltip: (data) => { return data.value },
      cellRenderer: (data) => {
        console.log(data);
        if (data.value != null && data.value != '')
          return `<a href='${this.getLegderProofURL('view', data.value)}' target="_blank"> ${data.value} </a>`;
        else
          return "--note-attachment--";
      }
    },
    { headerName: 'Journal/Category', field: 'journal', sortable: true, filter: true, resizable: true, minWidth: 240, tooltip: (data) => { return data.value }, },
    { headerName: 'Remarks/Notes', field: 'notes', sortable: true, filter: true, minWidth: 240, tooltip: (data) => { return data.value }, },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, filter: true, resizable: true,
      tooltip: (data) => { return data.value },
      cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'MMM dd, yyyy hh:mm a');
      }
    },
  ];

  ngOnInit() {
    this.loadIncomeExpenseNeeded();
  }

  loadIncomeExpenseNeeded() {
    this.accServ.loadIncomeExpenseNeeded().subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this._agents = resp['Agents'];
      }
    })
  }

  onAgentDeSelect() {
    this.ledger = [];
    this.totalCredit = 0;
    this.totalDebit = 0;
  }

  getAgentLedger(agent) {

    this.ledger = [];
    this.totalCredit = 0;
    this.totalDebit = 0;

    this.dateObject = null;
    this.fromDate = null;
    this.toDate = null;

    this.loading = true;
    this.accServ.getAgentLedger(agent).subscribe(resp => {
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
        this.prepareLegderShow();
      }
    }, error => this.loading = false);
  }

  prepareLegderShow() {
    console.log(this.fromDate, this.toDate);
    this.ledger_show = [];
    this.ledger.filter((ledg: AgentLedger) => {
      if (this.fromDate != null && this.toDate != null) {

        let _payDate = this.datePipe.transform(new Date(ledg.paymentDate), 'yyyy-MM-dd');
        let _fromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
        let _toDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');

        return new Date(_payDate).getTime() >= new Date(_fromDate).getTime() && new Date(_payDate).getTime() <= new Date(_toDate).getTime();
      }
      else
        return true;
    }).forEach((ledg: AgentLedger) => this.ledger_show.push(ledg));

  }

  addLedger() {
    if (this.ledgerType == 'Credit') {
      if (isNaN(this.newLedger.credit) || this.newLedger.credit == null || this.newLedger.credit <= 0) {
        this.snackbar.open('Enter Valid Credit Amount');
        return;
      }
    } else if (this.ledgerType == 'Debit') {
      if (isNaN(this.newLedger.debit) || this.newLedger.credit == null || this.newLedger.debit <= 0) {
        this.snackbar.open('Enter Valid Debit Amount');
        return;
      }
    }

    if (this.newLedger.paymentDate == null) {
      this.snackbar.open('Choose Payment Date');
      return;
    }

    this.newLedger.agentEmailId = this._selectedAgents[0].emailId;

    this.saving = true;
    this.accServ.addLedger(this.newLedger).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == '00') {
        this.newLedger = new AgentLedger();
        this.showNewLedger = false;
        this.getAgentLedger(this._selectedAgents[0]);
      }
    }, error => this.saving = false);
  }

  creditExpense() {
    this.newLedger = new AgentLedger();
    this.ledgerType = 'Credit';
    this.newLedger.agentEmailId = this._selectedAgents[0].emailId;
    this.showNewLedger = true;
  }

  editLedger(led) {

    if (led.rowData.credit > 0) {
      this.newLedger = led.rowData;
      this.showNewLedger = true;
      let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 16);
    } else {
      this.snackbar.open('You cannot Edit Debit transaction, Only Agent can edit at their Legder.')
    }
  }

  changeLedgerDate() {
    this.prepareLegderShow();
  }

  getLegderProofURL(mode, filename) {
    if (filename.toLowerCase().endsWith('png') || filename.toLowerCase().endsWith('jpeg') || filename.toLowerCase().endsWith('jpg') || filename.toLowerCase().endsWith('svg'))
      return environment.contentPath + 'agent-legder-proof/image/' + mode + '/' + filename;
    else
      return environment.contentPath + 'agent-legder-proof/pdf/' + mode + '/' + filename;
  }

  downlaodTransasImage(event) {
    let _legder: AgentLedger = event.rowData;
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

    var text = textElement.split("\n").join("\n");
    var x = 30;
    var y = 15;
    var lineheight = 30;
    var lines = text.split('\n');
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

}
