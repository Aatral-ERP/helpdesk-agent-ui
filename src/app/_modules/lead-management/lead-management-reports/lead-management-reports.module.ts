import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadManagementReportsRoutingModule } from './lead-management-reports-routing.module';
import { LeadReportsComponent } from '../../../_lead-management/lead-reports/lead-reports.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule, MatProgressBarModule } from '@angular/material';


@NgModule({
  declarations: [LeadReportsComponent],
  imports: [
    CommonModule,
    LeadManagementReportsRoutingModule,
    MatButtonToggleModule,
    FormsModule,
    AngularMyDatePickerModule,
    NgMultiSelectDropDownModule,
    NgxSkeletonLoaderModule,
    AgGridModule,
    MatProgressBarModule
  ]
})
export class LeadManagementReportsModule { }
