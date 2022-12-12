import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadReportsComponent } from 'src/app/_lead-management/lead-reports/lead-reports.component';

const routes: Routes = [
  { path: 'leads', component: LeadReportsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadManagementReportsRoutingModule { }
