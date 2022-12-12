import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrDashboardComponent } from 'src/app/_hr/hr-dashboard/hr-dashboard.component';
import { SalaryDetailsCreateComponent } from 'src/app/_hr/salary-details-create/salary-details-create.component';
import { SalaryDetailsComponent } from 'src/app/_hr/salary-details/salary-details.component';
import { AgentRegisterComponent } from 'src/app/_onboard/agent-register/agent-register.component';
import { ViewAgentsComponent } from 'src/app/_onboard/view-agents/view-agents.component';
import { AuthGuardService } from 'src/app/_services/auth-guard.service';
import { RoleGuardService } from 'src/app/_services/role-guard.service';
import { SalaryEntriesComponent } from 'src/app/_hr/salary-entries/salary-entries.component';
import { SalaryEntriesDetailComponent } from 'src/app/_hr/salary-entries-detail/salary-entries-detail.component';


const routes: Routes = [
  { path: '', component: HrDashboardComponent },
  { path: 'dashboard', component: HrDashboardComponent },
  { path: 'salary-details', component: SalaryDetailsComponent, canActivate: [RoleGuardService] },
  { path: 'salary-details-create', component: SalaryDetailsCreateComponent, canActivate: [RoleGuardService] },
  { path: 'salary-entries', component: SalaryEntriesComponent, canActivate: [RoleGuardService] },
  { path: 'salary-entries-detail/:id', component: SalaryEntriesDetailComponent, canActivate: [RoleGuardService] },
  { path: 'agent', loadChildren: () => import('../../_modules/agent/agent.module').then(m => m.AgentModule), canActivate: [RoleGuardService] },
  { path: 'leave-management', loadChildren: () => import('../../_modules/hr/leave-management/leave-management.module').then(m => m.LeaveManagementModule), canActivate: [RoleGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
