import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstituteDetailComponent } from '../_institute/institute-detail/institute-detail.component';
import { InstRegistrationComponent } from '../_onboard/inst-registration/inst-registration.component';
import { AmcEntryComponent } from '../_amc/amc-entry/amc-entry.component';
import { InstProductComponent } from '../inst-product/inst-product.component';
import { RoleGuardService } from '../_services/role-guard.service';
import { AmcEntryEditComponent } from '../_amc/amc-entry-edit/amc-entry-edit.component';
import { AmcReminderComponent } from '../_institute/amc-reminder/amc-reminder.component';
import { AMCRecordsComponent } from '../_institute/amc-records/amc-records.component';
import { InstituteImportComponent } from '../_institute/institute-import/institute-import.component';
import { InstituteDatachangeImportComponent } from '../_institute/institute-datachange-import/institute-datachange-import.component';

const routes: Routes = [
  { path: 'institute-detail', component: InstituteDetailComponent, canActivate: [RoleGuardService] },
  { path: 'register', component: InstRegistrationComponent, canActivate: [RoleGuardService] },
  { path: 'amc-entry', component: AmcEntryComponent, canActivate: [RoleGuardService] },
  { path: 'amc-entry-edit', component: AmcEntryEditComponent, canActivate: [RoleGuardService] },
  { path: 'inst-product', component: InstProductComponent, canActivate: [RoleGuardService] },
  { path: 'amc-reminders', component: AmcReminderComponent, canActivate: [RoleGuardService] },
  { path: 'amc-records', component: AMCRecordsComponent, canActivate: [RoleGuardService] },
  { path: 'institute-import', component: InstituteImportComponent, canActivate: [RoleGuardService] },
  { path: 'institute-datachange-import', component: InstituteDatachangeImportComponent, canActivate: [RoleGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstituteRoutingModule { }
