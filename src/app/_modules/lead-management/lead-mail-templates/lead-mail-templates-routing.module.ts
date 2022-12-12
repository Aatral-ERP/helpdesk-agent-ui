import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadMailSentStatusComponent } from 'src/app/_lead-management/lead-mail-sent-status/lead-mail-sent-status.component';
import { LeadMailSettingsComponent } from 'src/app/_lead-management/lead-mail-settings/lead-mail-settings.component';
import { LeadMailTemplatesComponent } from 'src/app/_lead-management/lead-mail-templates/lead-mail-templates.component';

const routes: Routes = [
  { path: 'templates', component: LeadMailTemplatesComponent },
  { path: 'settings', component: LeadMailSettingsComponent },
  { path: 'sent-status', component: LeadMailSentStatusComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadMailTemplatesRoutingModule { }
