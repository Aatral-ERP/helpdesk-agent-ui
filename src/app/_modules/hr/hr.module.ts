import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { HrRoutingModule } from './hr-routing.module';
import { HrDashboardComponent } from '../../_hr/hr-dashboard/hr-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SalaryDetailsComponent } from '../../_hr/salary-details/salary-details.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AgGridModule } from 'ag-grid-angular';
import { SalaryDetailsCreateComponent } from '../../_hr/salary-details-create/salary-details-create.component';
import { SalaryEntriesComponent } from '../../_hr/salary-entries/salary-entries.component';
import { SalaryEntriesDetailComponent } from '../../_hr/salary-entries-detail/salary-entries-detail.component';

@NgModule({
  declarations: [HrDashboardComponent, SalaryDetailsComponent, SalaryDetailsCreateComponent, SalaryEntriesComponent, SalaryEntriesDetailComponent,],
  imports: [
    CommonModule,
    HrRoutingModule, FormsModule, ReactiveFormsModule, NgxSkeletonLoaderModule, NgxChartsModule,
    NgMultiSelectDropDownModule, AgGridModule, AutocompleteLibModule, AngularMyDatePickerModule
  ]
})
export class HrModule { }
