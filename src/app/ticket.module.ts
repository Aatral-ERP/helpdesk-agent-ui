import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTicketComponent } from './_tickets/add-ticket/add-ticket.component';
import { TicketsComponent } from './_tickets/tickets/tickets.component';
import { ViewTicketComponent } from './_tickets/view-ticket/view-ticket.component';
import { NgxFilesizeModule } from 'ngx-filesize';
import { AddRatingComponent } from './_tickets/add-rating/add-rating.component';
import { ViewRatingComponent } from './_tickets/view-rating/view-rating.component';
import { PipeModuleModule } from './_pipes/pipe-module.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [AddTicketComponent, TicketsComponent, ViewTicketComponent,
    AddRatingComponent, ViewRatingComponent],
  imports: [
    CommonModule,
    PipeModuleModule,
    TicketRoutingModule,
    FormsModule,
    AngularEditorModule,
    ReactiveFormsModule,
    NgxFilesizeModule
  ]
})
export class TicketModule { }
