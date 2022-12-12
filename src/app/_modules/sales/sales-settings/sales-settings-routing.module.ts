import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceReminderComponent } from '../../../_sales/_settings/invoice-reminder/invoice-reminder.component';

const routes: Routes = [
  { path: 'invoice-reminder', component: InvoiceReminderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesSettingsRoutingModule { }
