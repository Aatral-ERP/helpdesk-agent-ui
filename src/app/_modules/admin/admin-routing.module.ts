import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendAmcInvoiceComponent } from '../../_admin/send-amc-invoice/send-amc-invoice.component';
import { AdminComponent } from '../../_admin/admin/admin.component';
import { ViewWorkingDaysComponent } from '../../_admin/view-working-days/view-working-days.component';
import { GenerateWorkingDaysComponent } from '../../_admin/generate-working-days/generate-working-days.component';
import { AttendanceComponent } from '../../_admin/attendance/attendance.component';
import { SiteAttendanceComponent } from '../../_admin/site-attendance/site-attendance.component';
import { RoleGuardService } from '../../_services/role-guard.service';
import { InfoDetailsComponent } from '../../info-details/info-details.component';
import { MailSettingsComponent } from 'src/app/_admin/mail-settings/mail-settings.component';
import { AttendanceReportComponent } from 'src/app/_admin/attendance-report/attendance-report.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children: [
      { path: '', redirectTo: 'generate-working-days', pathMatch: 'full' },
      { path: 'send-amc-invoice', component: SendAmcInvoiceComponent, canActivate: [RoleGuardService] },
      { path: 'generate-working-days', component: GenerateWorkingDaysComponent, canActivate: [RoleGuardService] },
      { path: 'view-working-days', component: ViewWorkingDaysComponent, canActivate: [RoleGuardService] },
      { path: 'attendance', component: AttendanceComponent, canActivate: [RoleGuardService] },
      { path: 'attendance-report', component: AttendanceReportComponent, canActivate: [RoleGuardService] },
      { path: 'site-attendance', component: SiteAttendanceComponent, canActivate: [RoleGuardService] },
      { path: 'info-details', component: InfoDetailsComponent, canActivate: [RoleGuardService] },
      { path: 'mail-settings', component: MailSettingsComponent, canActivate: [RoleGuardService] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
