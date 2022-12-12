import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LeaveManagementRoutingModule } from './leave-management-routing.module';
import { LeaveMasterComponent } from '../../../_hr/leave-management/leave-master/leave-master.component';
import { LeaveMasterCreateComponent } from '../../../_hr/leave-management/leave-master-create/leave-master-create.component';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatButtonModule, MatCheckboxModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule } from '@angular/material';
import { AgGridButtonRendererModule } from '../../common/ag-grid-button-renderer.module';
import { AGGridButtonRendererComponent } from '../../common/ag-grid-button-renderer.component';
import { LeaveAppliedReportComponent } from '../../../_hr/leave-management/leave-applied-report/leave-applied-report.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LeaveBalancesSheetComponent } from '../../../_hr/leave-management/leave-balances-sheet/leave-balances-sheet.component';

@NgModule({
  declarations: [LeaveMasterComponent, LeaveMasterCreateComponent, LeaveAppliedReportComponent,
    LeaveBalancesSheetComponent],
  imports: [
    CommonModule,
    LeaveManagementRoutingModule,
    FormsModule,
    AgGridModule.withComponents([AGGridButtonRendererComponent]),
    AgGridButtonRendererModule,
    AngularMyDatePickerModule,
    NgMultiSelectDropDownModule,
    NgxSkeletonLoaderModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatExpansionModule, MatButtonModule, MatTabsModule
  ], providers: [DatePipe]
})
export class LeaveManagementModule { }
