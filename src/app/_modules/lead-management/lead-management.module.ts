import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadManagementRoutingModule } from './lead-management-routing.module';
import { LeadDashboardComponent } from '../../_lead-management/lead-dashboard/lead-dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [LeadDashboardComponent],
  imports: [
    CommonModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMyDatePickerModule,
    LeadManagementRoutingModule,
    MaterialModule
  ]
})
export class LeadManagementModule { }
