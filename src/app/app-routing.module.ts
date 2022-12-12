import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './_onboard/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './_services/auth-guard.service';
import { ViewTicketComponent } from './_tickets/view-ticket/view-ticket.component';
import { AddTicketComponent } from './_tickets/add-ticket/add-ticket.component';
import { ForgetPasswordComponent } from './_onboard/forget-password/forget-password.component';
import { ProjectImplementationsComponent } from './_tickets/project-implementations/project-implementations.component';
import { GmailTicketsComponent } from './_admin/gmail-tickets/gmail-tickets.component';
import { RoleGuardService } from './_services/role-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'add-ticket', component: AddTicketComponent, canActivate: [AuthGuardService, RoleGuardService] },
  { path: 'view-ticket/:id', component: ViewTicketComponent, data: { ticketId: 0 }, canActivate: [AuthGuardService] },
  { path: 'gmail-tickets', component: GmailTicketsComponent, canActivate: [AuthGuardService,   ] },
  { path: 'project-implementations', component: ProjectImplementationsComponent, canActivate: [AuthGuardService] },
  { path: 'teams', loadChildren: () => import('./_modules/teams/teams.module').then(m => m.TeamsModule), canActivate: [AuthGuardService] },
  { path: 'institute', loadChildren: () => import('./_modules/institute.module').then(m => m.InstituteModule), canActivate: [AuthGuardService] },
  { path: 'reports', loadChildren: () => import('./_modules/reports.module').then(m => m.ReportsModule), canActivate: [AuthGuardService] },
  { path: 'admin', loadChildren: () => import('./_modules/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuardService] },
  { path: 'lead-management', loadChildren: () => import('./_modules/lead-management/lead-management.module').then(m => m.LeadManagementModule), canActivate: [AuthGuardService] },
  { path: 'sales', loadChildren: () => import('./_modules/sales/sales.module').then(m => m.SalesModule), canActivate: [AuthGuardService] },
  { path: 'purchase-inputs', loadChildren: () => import('./_modules/sales/purchase-input/purchase-input.module').then(m => m.PurchaseInputModule), canActivate: [AuthGuardService] },
  { path: 'hr', loadChildren: () => import('./_modules/hr/hr.module').then(m => m.HrModule), canActivate: [AuthGuardService] },
  { path: 'profile', loadChildren: () => import('./_modules/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuardService] },
  { path: 'product', loadChildren: () => import('./_modules/product/product.module').then(m => m.ProductModule), canActivate: [AuthGuardService] },
  { path: 'accounting', loadChildren: () => import('./_modules/accounting/accounting.module').then(m => m.AccountingModule), canActivate: [AuthGuardService] },
  { path: 'vendor', loadChildren: () => import('./_modules/vendor/vendor.module').then(m => m.VendorModule), canActivate: [AuthGuardService] },
  { path: 'chat', loadChildren: () => import('./_modules/chat/chat.module').then(m => m.ChatModule), canActivate: [AuthGuardService] },
  { path: 'tickets', loadChildren: () => import('./_modules/tickets/tickets.module').then(m => m.TicketsModule), canActivate: [AuthGuardService] },
  { path: 'reminders', loadChildren: () => import('./_modules/reminders/reminders.module').then(m => m.RemindersModule), canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
