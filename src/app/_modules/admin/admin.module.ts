import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SendAmcInvoiceComponent } from '../../_admin/send-amc-invoice/send-amc-invoice.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AdminComponent } from '../../_admin/admin/admin.component';
import { GenerateWorkingDaysComponent } from '../../_admin/generate-working-days/generate-working-days.component';
import { ViewWorkingDaysComponent } from '../../_admin/view-working-days/view-working-days.component';
import { AttendanceComponent } from '../../_admin/attendance/attendance.component';
import { SiteAttendanceComponent } from '../../_admin/site-attendance/site-attendance.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AMCComponent } from '../../_admin/amc/amc.component';
import { InfoDetailsComponent } from '../../info-details/info-details.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MaterialModule } from '../material.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MailSettingsComponent } from '../../_admin/mail-settings/mail-settings.component';
import { MailSettingPropertiesLeadComponent } from '../../_admin/mail-setting-properties-lead/mail-setting-properties-lead.component';
import { AttendanceReportComponent } from '../../_admin/attendance-report/attendance-report.component';
import { MailSettingPropertiesComponent } from 'src/app/_admin/mail-setting-properties/mail-setting-properties.component';
import { MailSettingTestSenderComponent } from '../../_admin/mail-setting-test-sender/mail-setting-test-sender.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [SendAmcInvoiceComponent, AdminComponent,
    ViewWorkingDaysComponent, GenerateWorkingDaysComponent, AttendanceComponent,
    SiteAttendanceComponent, AMCComponent, InfoDetailsComponent, MailSettingsComponent,
    MailSettingPropertiesLeadComponent, MailSettingPropertiesComponent, AttendanceReportComponent, MailSettingTestSenderComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AngularMyDatePickerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    AngularEditorModule,
    AutocompleteLibModule,
    MaterialModule,
    OwlDateTimeModule,
    NgxSkeletonLoaderModule,
    OwlNativeDateTimeModule,
    NgxSkeletonLoaderModule,
    AgGridModule,
  ], providers: [DatePipe],
  entryComponents: [MailSettingTestSenderComponent]
})
export class AdminModule { }
