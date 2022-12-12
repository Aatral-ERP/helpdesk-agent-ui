import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadOverviewComponent } from 'src/app/_lead-management/lead-overview/lead-overview.component';


const routes: Routes = [
  { path: ':id', redirectTo: ':id/lead' },
  { path: ':id/:tab', component: LeadOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadOverviewRoutingModule { }
