import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseInputRoutingModule } from './purchase-input-routing.module';
import { BillsComponent } from '../../../_sales/purchase-input/bills/bills.component';
import { BillCreateComponent } from 'src/app/_sales/purchase-input/bill-create/bill-create.component';
import { MaterialModule } from 'src/app/_modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { BillOverviewComponent } from '../../../_sales/purchase-input/bill-overview/bill-overview.component';
import { BillAttachmentComponent } from '../../../_sales/purchase-input/bill-attachment/bill-attachment.component';
import { PurchaseInputOrderCreateComponent } from '../../../_sales/purchase-input/purchase-input-order-create/purchase-input-order-create.component';
import { PurchaseInputOrdersComponent } from 'src/app/_sales/purchase-input/purchase-input-orders/purchase-input-orders.component';
import { PurchaseInputOrderOverviewComponent } from '../../../_sales/purchase-input/purchase-input-order-overview/purchase-input-order-overview.component';
import { BillPaymentComponent } from '../../../_sales/purchase-input/bill-payment/bill-payment.component';
import { BillPaymentReportComponent } from 'src/app/_sales/purchase-input/bill-payment-report/bill-payment-report.component';


@NgModule({
  declarations: [BillCreateComponent, BillsComponent, BillOverviewComponent, BillAttachmentComponent,
    PurchaseInputOrderCreateComponent, PurchaseInputOrdersComponent,
    PurchaseInputOrderOverviewComponent, BillPaymentComponent,BillPaymentReportComponent],
  imports: [
    CommonModule,
    PurchaseInputRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFilesizeModule,
    NgxSkeletonLoaderModule,
    NgMultiSelectDropDownModule,
    AgGridModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularMyDatePickerModule
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB' },
  ]
})
export class PurchaseInputModule { }
