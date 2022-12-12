import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemindersRoutingModule } from './reminders-routing.module';
import { CreateReminderComponent } from '../../_reminders/create-reminder/create-reminder.component';
import { ViewRemindersComponent } from '../../_reminders/view-reminders/view-reminders.component';
import { ViewRemindersNotificationComponent } from '../../_reminders/view-reminders-notification/view-reminders-notification.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatProgressBarModule, MatRadioModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MomentModule } from 'ngx-moment';


@NgModule({
  declarations: [CreateReminderComponent, ViewRemindersComponent, ViewRemindersNotificationComponent],
  imports: [
    CommonModule,
    RemindersRoutingModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule,
    MomentModule, MatMenuModule, MatButtonModule, MatDatepickerModule,
    MatIconModule, MatDialogModule, MatButtonModule, MatInputModule, MatProgressBarModule,
    MatSnackBarModule, MatFormFieldModule, MatButtonToggleModule, MatCheckboxModule,
    MatRadioModule, MatSelectModule
  ], exports: [ViewRemindersNotificationComponent],
  entryComponents: [CreateReminderComponent, ViewRemindersComponent]
})
export class RemindersModule { }
