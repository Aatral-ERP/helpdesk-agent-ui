import { Component, OnInit, Input } from '@angular/core';
import { DealInvoice } from '../../invoices/invoice-create/DealInvoice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from 'src/app/_services/sales.service';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Deal } from '../deals-create/Deal';
import { Router } from '@angular/router';
import { DealInvoiceReminder } from '../deals-invoice-reminder/DealInvoiceReminder';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

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
  selector: 'app-deals-invoice',
  templateUrl: './deals-invoice.component.html',
  styleUrls: ['./deals-invoice.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DealsInvoiceComponent implements OnInit {

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  loading = false;
  showNewReminder = false;
  savingReminder = false;

  constructor(private snackbar: MatSnackBar, private ss: SalesService, private route: Router) { }

  @Input("dealId") dealId: number;
  @Input("deal") deal: Deal;

  invoices: Array<DealInvoice> = [];
  reminders: Array<DealInvoiceReminder> = [];
  newReminder = new DealInvoiceReminder();

  ngOnInit() {
    this.getDealInvoicesPreview();
  }

  getDealInvoicesPreview() {
    this.loading = true;
    this.ss.getDealInvoicesPreview(this.dealId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.invoices = resp['DealInvoices'];
      }
      this.getDealInvoicesReminders();
    }, error => this.loading = false)
  }

  getDealInvoicesReminders() {
    this.loading = true;
    this.ss.getDealInvoicesReminders(this.dealId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.reminders = resp['DealInvoiceReminders'];
      }
    }, error => this.loading = false)
  }

  EditDealInvoice(invoiceId) {
    this.route.navigateByUrl('/sales/invoices/create?edit=1&invid=' + invoiceId);
  }

  convertAsInvoice() {
    this.route.navigateByUrl('/sales/invoices/create?prefill-from-deal=1&did=' + this.dealId);
  }

  showInvoiceReminder() {
    this.newReminder = new DealInvoiceReminder();
    this.showNewReminder = true;
  }

  EditDealInvoiceReminder(rem: DealInvoiceReminder) {
    this.newReminder = rem;
    this.showNewReminder = true;
  }

  clearReminder() {
    this.newReminder = new DealInvoiceReminder();
  }

  saveInvoiceReminder() {
    if (this.newReminder.reminderDate === undefined || this.newReminder.reminderDate == null) {
      this.snackbar.open('Date cannot be empty');
      return;
    }
    this.newReminder.dealId = this.dealId;
    this.savingReminder = true;
    this.ss.saveInvoiceReminder([this.newReminder]).subscribe(resp => {
      this.savingReminder = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Invoice Reminder Added successfully'); 
        this.newReminder = new DealInvoiceReminder();
        this.showNewReminder = true;
        this.getDealInvoicesReminders();
      }
    })
  }

  deleteInvoiceReminder(rem: DealInvoiceReminder) {
    this.ss.deleteInvoiceReminder([rem]).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Invoice Reminder Deleted successfully');
        this.getDealInvoicesReminders();
      }
    })
  }

}
