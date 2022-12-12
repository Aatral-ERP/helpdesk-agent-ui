import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './_services/auth-guard.service';
import { AddTicketComponent } from './_tickets/add-ticket/add-ticket.component';
import { TicketsComponent } from './_tickets/tickets/tickets.component';
import { ViewTicketComponent } from './_tickets/view-ticket/view-ticket.component';


const routes: Routes = [
  { path: '', component: TicketsComponent, canActivate: [AuthGuardService] },
  { path: 'add-ticket', component: AddTicketComponent, canActivate: [AuthGuardService] },
  { path: 'view-ticket/:id', component: ViewTicketComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
