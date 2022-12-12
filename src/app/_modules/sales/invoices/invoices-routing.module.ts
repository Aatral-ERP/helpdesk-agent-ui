import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceCreateComponent } from 'src/app/_sales/invoices/invoice-create/invoice-create.component';
import { InvoiceOverviewComponent } from 'src/app/_sales/invoices/invoice-overview/invoice-overview.component';
import { InvoicesReportComponent } from 'src/app/_sales/invoices/invoices-report/invoices-report.component';
import { DealsInvoiceReminderReportsComponent } from 'src/app/_sales/_reports/deals-invoice-reminder-reports/deals-invoice-reminder-reports.component';

const routes: Routes = [
  { path: '', component: InvoicesReportComponent },
  { path: 'create', component: InvoiceCreateComponent },
  { path: 'overview/:id', redirectTo: 'overview/:id/invoice' },
  { path: 'overview/:id/:tab', component: InvoiceOverviewComponent },
  { path: 'reminders', component: DealsInvoiceReminderReportsComponent },
  { path: '**', component: InvoicesReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
