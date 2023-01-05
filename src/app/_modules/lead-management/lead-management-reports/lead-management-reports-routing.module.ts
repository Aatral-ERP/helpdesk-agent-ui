import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadActiviesReportComponent } from 'src/app/_lead-management/lead-activies-report/lead-activies-report.component';
import { LeadReportsComponent } from 'src/app/_lead-management/lead-reports/lead-reports.component';

const routes: Routes = [
  { path: 'leads', component: LeadReportsComponent },
  { path: 'activities', component: LeadActiviesReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadManagementReportsRoutingModule { }
