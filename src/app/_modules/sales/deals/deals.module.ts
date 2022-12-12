import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealsRoutingModule } from './deals-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DealsOverviewComponent } from 'src/app/_sales/_entity/deals-overview/deals-overview.component';
import { MaterialModule } from 'src/app/_modules/material.module';
import { DealsNotesComponent } from 'src/app/_sales/_entity/deals-notes/deals-notes.component';
import { NgxFilesizeModule } from 'ngx-filesize';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NoteAttachmentComponent } from '../../../_sales/_entity/note-attachment/note-attachment.component';
import { DealsCreateComponent } from '../../../_sales/_entity/deals-create/deals-create.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DealsComponent } from '../../../_sales/_entity/deals/deals.component';
import { AgGridModule } from 'ag-grid-angular';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { DealsViewComponent } from '../../../_sales/_entity/deals-view/deals-view.component';
import { DealsQuotationComponent } from '../../../_sales/_entity/deals-quotation/deals-quotation.component';
import { DealsInvoiceComponent } from '../../../_sales/_entity/deals-invoice/deals-invoice.component';
import { DealsSalesOrderComponent } from '../../../_sales/_entity/deals-sales-order/deals-sales-order.component';
import { DealsEmailsComponent } from '../../../_sales/_entity/deals-emails/deals-emails.component';
import { DealsDeliveryChallanComponent } from '../../../_sales/_entity/deals-delivery-challan/deals-delivery-challan.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { DealsProformaInvoiceComponent } from '../../../_sales/_entity/deals-proforma-invoice/deals-proforma-invoice.component';
import { DealsEmailSenderComponent } from '../../../_sales/_entity/deals-email-sender/deals-email-sender.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DealsProjectImplementationComponent } from '../../../_sales/_entity/deals-project-implementation/deals-project-implementation.component';
import { DealsProjectImplementationCommentComponent } from '../../../_sales/_entity/deals-project-implementation-comment/deals-project-implementation-comment.component';
import { MomentModule } from 'ngx-moment';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DealsPurchaseOrderComponent } from 'src/app/_sales/_entity/deals-purchase-order/deals-purchase-order.component';
import { PreambleModule } from '../preamble/preamble.module';
import { DealsPaymentsComponent } from 'src/app/_sales/_entity/deals-payments/deals-payments.component';
import { TermsAndConditionsModule } from '../terms-and-conditions/terms-and-conditions.module';
import { DealsDeliveryChallanHandlerComponent } from '../../../_sales/_entity/deals-delivery-challan-handler/deals-delivery-challan-handler.component';
import { DealAmcVisitsComponent } from 'src/app/_sales/_entity/deal-amc-visits/deal-amc-visits.component';

@NgModule({
  declarations: [DealsOverviewComponent, DealsNotesComponent, NoteAttachmentComponent,
    DealsCreateComponent, DealsComponent, DealsViewComponent, DealsQuotationComponent,
    DealsInvoiceComponent, DealsPurchaseOrderComponent, DealsSalesOrderComponent,
    DealsEmailsComponent, DealsDeliveryChallanComponent, DealsProformaInvoiceComponent,
    DealsEmailSenderComponent, DealsProjectImplementationComponent, DealsPaymentsComponent,
    DealsProjectImplementationCommentComponent, DealsDeliveryChallanHandlerComponent,
    DealAmcVisitsComponent
  ],
  imports: [
    CommonModule,
    DealsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFilesizeModule,
    PreambleModule,
    NgxSkeletonLoaderModule,
    NgxDocViewerModule,
    NgMultiSelectDropDownModule,
    AgGridModule,
    AngularMyDatePickerModule,
    SignaturePadModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularEditorModule,
    MomentModule,
    TermsAndConditionsModule,
    NgxFileDropModule
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB' },
  ],
})
export class DealsModule { }
