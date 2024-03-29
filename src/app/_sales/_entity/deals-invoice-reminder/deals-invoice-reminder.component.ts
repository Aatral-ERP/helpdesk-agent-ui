import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { SalesService } from 'src/app/_services/sales.service';
import { DealInvoiceReminder } from './DealInvoiceReminder';

@Component({
  selector: 'app-deals-invoice-reminder',
  templateUrl: './deals-invoice-reminder.component.html',
  styleUrls: ['./deals-invoice-reminder.component.css']
})
export class DealsInvoiceReminderComponent implements OnInit {

  constructor(private ss: SalesService) {

  let fdate = new Date().setMonth(new Date().getMonth() - 1);
  let tdate = new Date().setMonth(new Date().getMonth() + 1);

    this._filters.fromDate = new Date(fdate);
    this._filters.toDate = new Date(tdate);

    this._filters.dateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(fdate),
        endJsDate: new Date(tdate)
      }
    };

   }

  loading = false;

  reminders: Array<DealInvoiceReminder> = [];

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  ngOnInit() {
    this.searchDealsInvoiceReminders();
  }

  _filters = {
    institute: new Institute(),
    fromDate: new Date(),
    toDate: new Date(),
    dateObject: {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: null,
        endJsDate: null
      }
    }
  }

  searchDealsInvoiceReminders() {
    this.loading = true;
    this.ss.searchDealsInvoiceReminders(this._filters).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == "00") {
        this.reminders = resp['DealInvoiceReminders'];
      }
    })
  }

}
