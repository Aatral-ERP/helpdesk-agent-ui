import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentProfileComponent } from 'src/app/_profile/agent-profile/agent-profile.component';
import { RoleGuardService } from 'src/app/_services/role-guard.service';
import { AgentLedgerComponent } from 'src/app/_tickets/agent-ledger/agent-ledger.component';


const routes: Routes = [
  { path: '', redirectTo: 'overview/details', canActivate: [RoleGuardService] },
  { path: 'overview', redirectTo: 'overview/details', canActivate: [RoleGuardService] },
  { path: 'overview/:tab', component: AgentProfileComponent, canActivate: [RoleGuardService] },
  { path: 'ledger', component: AgentLedgerComponent, canActivate: [RoleGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
