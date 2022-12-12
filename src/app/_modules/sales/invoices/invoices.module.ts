import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from '../../material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InvoiceCreateComponent } from '../../../_sales/invoices/invoice-create/invoice-create.component';
import { InvoiceOverviewComponent } from '../../../_sales/invoices/invoice-overview/invoice-overview.component';
import { InvoicesReportComponent } from 'src/app/_sales/invoices/invoices-report/invoices-report.component';
import { InvoicesEmailSenderComponent } from 'src/app/_sales/invoices/invoices-email-sender/invoices-email-sender.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFilesizeModule } from 'ngx-filesize';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DealsPaymentsComponent } from 'src/app/_sales/invoices/deals-payments/deals-payments.component';
import { TermsAndConditionsModule } from '../terms-and-conditions/terms-and-conditions.module';
import { DealsInvoiceReminderReportsComponent } from 'src/app/_sales/_reports/deals-invoice-reminder-reports/deals-invoice-reminder-reports.component';


@NgModule({
  declarations: [InvoicesReportComponent, InvoiceCreateComponent, InvoiceOverviewComponent,
    DealsPaymentsComponent, InvoicesEmailSenderComponent,DealsInvoiceReminderReportsComponent],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMyDatePickerModule,
    NgxSkeletonLoaderModule,
    MaterialModule,
    NgxFilesizeModule,
    NgxFileDropModule,
    AngularEditorModule,
    TermsAndConditionsModule,
    NgMultiSelectDropDownModule,
  ]
})
export class InvoicesModule { }
