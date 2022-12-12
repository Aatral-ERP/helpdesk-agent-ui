import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveAppliedReportComponent } from 'src/app/_hr/leave-management/leave-applied-report/leave-applied-report.component';
import { LeaveBalancesSheetComponent } from 'src/app/_hr/leave-management/leave-balances-sheet/leave-balances-sheet.component';
import { LeaveMasterComponent } from 'src/app/_hr/leave-management/leave-master/leave-master.component';

const routes: Routes = [
  { path: 'leave-masters', component: LeaveMasterComponent },
  { path: 'leaves-applied-report', component: LeaveAppliedReportComponent },
  { path: 'leave-balances', component: LeaveBalancesSheetComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveManagementRoutingModule { }
