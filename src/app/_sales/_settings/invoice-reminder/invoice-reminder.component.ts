import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { InvoiceEmailReminderSettings } from './InvoiceEmailReminderSettings';

@Component({
  selector: 'app-invoice-reminder',
  templateUrl: './invoice-reminder.component.html',
  styleUrls: ['./invoice-reminder.component.css']
})
export class InvoiceReminderComponent implements OnInit {

  constructor(private invServ: InvoiceService, private snackbar: MatSnackBar) { }

  setting: InvoiceEmailReminderSettings = new InvoiceEmailReminderSettings();
  loading = false;

  ngOnInit() {
    this.loadInvoiceEmailReminderSettings();
  }

  loadInvoiceEmailReminderSettings() {
    this.loading = true;
    this.invServ.loadInvoiceEmailReminderSettings().subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.setting = resp['InvoiceEmailReminderSettings'];
      }
    }, error => this.loading = false)
  }

  saveInvoiceEmailReminderSettings() {
    this.loading = true;
    this.invServ.saveInvoiceEmailReminderSettings(this.setting).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Saved Successfully')
        this.setting = resp['InvoiceEmailReminderSettings'];
      }
    }, error => this.loading = false)
  }

}
