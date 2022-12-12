import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsRoutingModule } from './tickets-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { TicketDashboardComponent } from 'src/app/_tickets/ticket-dashboard/ticket-dashboard.component';
import { MatButtonToggleModule, MatFormFieldModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { AgentPerformanceComponent } from '../../_tickets/agent-performance/agent-performance.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [TicketDashboardComponent, AgentPerformanceComponent],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    FormsModule,
    NgxChartsModule, MomentModule,
    NgMultiSelectDropDownModule,
    MatButtonToggleModule, MatProgressBarModule, MatFormFieldModule, MatInputModule
  ]
})
export class TicketsModule { }
