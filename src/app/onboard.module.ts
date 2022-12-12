import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { OnboardRoutingModule } from './onboard-routing.module';
import { AddContactComponent } from './_onboard/add-contact/add-contact.component';
import { ChangePasswordComponent } from './_onboard/change-password/change-password.component';
import { InstRegisterComponent } from './_onboard/inst-register/inst-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactsComponent } from './_onboard/contacts/contacts.component';
import { AllContactsComponent } from './_onboard/all-contacts/all-contacts.component';
import { ViewContactsComponent } from './_onboard/view-contacts/view-contacts.component';
import { MyBillsComponent } from './_onboard/my-bills/my-bills.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PurchaseInvoicesComponent } from './_purchase/purchase-invoices/purchase-invoices.component';
import { PurchasePaymentsComponent } from './_purchase/purchase-payments/purchase-payments.component';
import { AgGridModule } from 'ag-grid-angular';
import { PurchaseQuotesComponent } from './_purchase/purchase-quotes/purchase-quotes.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';


@NgModule({
  declarations: [
    AddContactComponent, ChangePasswordComponent, InstRegisterComponent, ViewContactsComponent,
    ContactsComponent, AllContactsComponent, MyBillsComponent, PurchaseQuotesComponent, PurchaseInvoicesComponent, PurchasePaymentsComponent],
  imports: [
    CommonModule,
    OnboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    NgMultiSelectDropDownModule,
    AngularMyDatePickerModule
  ], providers: [DatePipe]
})
export class OnboardModule { }
