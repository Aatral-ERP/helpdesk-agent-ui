import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewRemindersComponent } from 'src/app/_reminders/view-reminders/view-reminders.component';


const routes: Routes = [
  { path: 'view/:recurringId', component: ViewRemindersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemindersRoutingModule { }
