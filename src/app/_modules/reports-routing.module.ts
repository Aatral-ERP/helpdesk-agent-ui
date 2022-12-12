import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketReportComponent } from '../_tickets/ticket-report/ticket-report.component';
import { AmcReportComponent } from '../_amc/amc-report/amc-report.component';
import { ViewInstituteComponent } from '../_onboard/view-institute/view-institute.component';
import { InstcontactReportComponent } from '../_institute/instcontact-report/instcontact-report.component';
import { RoleGuardService } from '../_services/role-guard.service';
import { AgentReportComponent } from '../_tickets/agent-report/agent-report.component';
import { CallReportComponent } from '../_tickets/call-report/call-report.component';
import { ServiceReportComponent } from '../service-report/service-report.component';



const routes: Routes = [
  { path: 'amc-report', component: AmcReportComponent, canActivate: [RoleGuardService] },
  { path: 'ticket-report', component: TicketReportComponent, canActivate: [RoleGuardService] },
  { path: 'institute-report', component: ViewInstituteComponent, canActivate: [RoleGuardService] },
  { path: 'agent-report', component: AgentReportComponent, canActivate: [RoleGuardService] },
  { path: 'institutecontact-report', component: InstcontactReportComponent, canActivate: [RoleGuardService] },
  { path: 'call-report', component: CallReportComponent, canActivate: [RoleGuardService] },
  { path: 'service-report', component: ServiceReportComponent, canActivate: [RoleGuardService] },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
