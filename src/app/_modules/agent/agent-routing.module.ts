import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleMasterComponent } from 'src/app/_admin/role-master/role-master.component';
import { ViewAgentsComponent } from 'src/app/_onboard/view-agents/view-agents.component';
import { AgentRegisterComponent } from 'src/app/_onboard/agent-register/agent-register.component';
import { RoleGuardService } from 'src/app/_services/role-guard.service';

const routes: Routes = [
  { path: 'view-agents', component: ViewAgentsComponent, canActivate: [RoleGuardService] },
  { path: 'agent-register', component: AgentRegisterComponent, canActivate: [RoleGuardService] },
  { path: 'role-master', component: RoleMasterComponent, canActivate: [RoleGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule { }
