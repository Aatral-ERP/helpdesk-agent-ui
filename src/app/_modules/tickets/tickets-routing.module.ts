import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuardService } from 'src/app/_services/role-guard.service';
import { TicketDashboardComponent } from 'src/app/_tickets/ticket-dashboard/ticket-dashboard.component';


const routes: Routes = [
  { path: 'dashboard', component: TicketDashboardComponent, canActivate: [RoleGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }
