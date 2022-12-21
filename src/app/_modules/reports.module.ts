import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { TicketReportComponent } from '../_tickets/ticket-report/ticket-report.component';
import { AmcReportComponent } from '../_amc/amc-report/amc-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AgGridModule } from 'ag-grid-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { InstcontactReportComponent } from '../_institute/instcontact-report/instcontact-report.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AgentReportComponent } from '../_tickets/agent-report/agent-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgGridButtonRendererModule } from './common/ag-grid-button-renderer.module';
import { AGGridButtonRendererComponent } from './common/ag-grid-button-renderer.component';
import { CallReportComponent } from '../_tickets/call-report/call-report.component';
import { MaterialModule } from './material.module';
import { ServiceReportComponent } from '../service-report/service-report.component';


@NgModule({
  declarations: [TicketReportComponent, AmcReportComponent, InstcontactReportComponent,
    AgentReportComponent, CallReportComponent,ServiceReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    AngularMyDatePickerModule,
    NgxSkeletonLoaderModule,
    AgGridModule.withComponents([AGGridButtonRendererComponent]),
    AgGridButtonRendererModule,
    NgxChartsModule,
    AutocompleteLibModule,
    ReportsRoutingModule,
    MaterialModule,
  ], providers: [DatePipe]
})
export class ReportsModule { }
