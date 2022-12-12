import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesSettingsRoutingModule } from './sales-settings-routing.module';
import { InvoiceReminderComponent } from '../../../_sales/_settings/invoice-reminder/invoice-reminder.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatProgressBarModule } from '@angular/material';


@NgModule({
  declarations: [InvoiceReminderComponent],
  imports: [
    CommonModule,
    SalesSettingsRoutingModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatProgressBarModule, MatCheckboxModule
  ]
})
export class SalesSettingsModule { }
