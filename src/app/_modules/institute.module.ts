import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InstituteRoutingModule } from './institute-routing.module';
import { InstituteDetailComponent } from '../_institute/institute-detail/institute-detail.component';
import { AmcReminderComponent } from '../_institute/amc-reminder/amc-reminder.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InstRegistrationComponent } from '../_onboard/inst-registration/inst-registration.component';
import { AmcEntryComponent } from '../_amc/amc-entry/amc-entry.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { InstProductComponent } from '../inst-product/inst-product.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { PipeModuleModule } from './pipe-module/pipe-module.module';
import { AmcEntryEditComponent } from '../_amc/amc-entry-edit/amc-entry-edit.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AgGridModule } from 'ag-grid-angular';
import { AMCRecordsComponent } from '../_institute/amc-records/amc-records.component';
import { MaterialModule } from 'src/app/_modules/material.module';

import { InstituteImportComponent } from '../_institute/institute-import/institute-import.component';
import { InstituteDatachangeImportComponent } from '../_institute/institute-datachange-import/institute-datachange-import.component'

@NgModule({
  declarations: [InstituteDetailComponent, AmcReminderComponent, InstRegistrationComponent,
    AmcEntryComponent, InstProductComponent, AmcEntryEditComponent, AMCRecordsComponent,InstituteImportComponent, InstituteDatachangeImportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMyDatePickerModule,
    InstituteRoutingModule,
    AutocompleteLibModule,
    NgMultiSelectDropDownModule,
    PipeModuleModule, NgxSkeletonLoaderModule, AgGridModule,
    MaterialModule
  ]
})
export class InstituteModule { }
