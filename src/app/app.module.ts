import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './_onboard/login/login.component';
import { NavbarComponent } from './_onboard/navbar/navbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpConfigInterceptor } from './_config/httpconfig.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './home/home.component';
import { ViewTicketComponent } from './_tickets/view-ticket/view-ticket.component';
import { NgxFilesizeModule } from 'ngx-filesize';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { ViewInstituteComponent } from './_onboard/view-institute/view-institute.component';
import { AddTicketServiceInvoiceComponent } from './_tickets/add-ticket-service-invoice/add-ticket-service-invoice.component';
import { AddTicketComponent } from './_tickets/add-ticket/add-ticket.component';
import { ForgetPasswordComponent } from './_onboard/forget-password/forget-password.component';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PipeModuleModule } from './_modules/pipe-module/pipe-module.module';
import { SidenavComponent } from './_onboard/sidenav/sidenav.component';
import { MaterialModule } from './_modules/material.module';
import { ProjectImplementationsComponent } from './_tickets/project-implementations/project-implementations.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MomentModule } from 'ngx-moment';
import localeIn from '@angular/common/locales/en-IN';
import { registerLocaleData } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { GmailTicketsComponent } from './_admin/gmail-tickets/gmail-tickets.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MAT_DIALOG_DATA, MatDialogRef, MatCardModule } from '@angular/material';
import { RemindersModule } from './_modules/reminders/reminders.module';
import { AddSimpleTicketComponent } from './add-simple-ticket/add-simple-ticket.component';
import { DealsInvoiceReminderComponent } from './_sales/_entity/deals-invoice-reminder/deals-invoice-reminder.component';
registerLocaleData(localeIn);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SidenavComponent,
    HomeComponent,
    ViewTicketComponent,
    ViewInstituteComponent,
    AddTicketServiceInvoiceComponent,
    AddTicketComponent,
    ForgetPasswordComponent,
    ProjectImplementationsComponent,
    GmailTicketsComponent,
    AddSimpleTicketComponent,
    DealsInvoiceReminderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    MaterialModule,
    AutocompleteLibModule,
    NgxFilesizeModule,
    AngularMyDatePickerModule,
    AngularEditorModule,
    PipeModuleModule,
    MomentModule,
    MatCardModule,
    NgMultiSelectDropDownModule.forRoot(),
    AgGridModule.withComponents([]),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      closeButton: true
    }),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    RemindersModule
  ],
  providers: [DatePipe, CurrencyPipe, { provide: LOCALE_ID, useValue: 'en-IN' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ViewTicketComponent, AddSimpleTicketComponent]
})
export class AppModule { }