import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ReminderService } from 'src/app/_services/reminder.service';
import { TaskViewComponent } from 'src/app/_teams/task-view/task-view.component';
import { Reminder } from '../create-reminder/Reminder';

@Component({
  selector: 'app-view-reminders',
  templateUrl: './view-reminders.component.html',
  styleUrls: ['./view-reminders.component.css']
})
export class ViewRemindersComponent implements OnInit {

  constructor(private rs: ReminderService, public dialogRef: MatDialogRef<TaskViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private snackbar: MatSnackBar) { }

  loading = false;
  recurringId = '';
  showReminder: Reminder = null;
  reminders: Array<Reminder> = [];

  ngOnInit() {
    if (this.data !== undefined) {
      if (this.data.recurringId !== undefined) {
        this.recurringId = this.data.recurringId;
      }
    }
    console.log(this.recurringId);

    this.getReminders();
  }

  getReminders() {
    this.loading = true;
    this.rs.getReminders(this.recurringId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.reminders = resp['Reminders']
      }
    }, error => this.loading = false)
  }

  deleteReminder(reminder) {
    this.deleteAllRecuringReminders([reminder]);
  }

  deleteAllRecuringReminders(reminders: Array<Reminder>) {

    this.loading = true;
    this.rs.deleteReminders(reminders).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open(reminders.length + ' deleted successfully');
        this.reminders = resp['Reminders'];
        if(reminders.find(rem=>rem.id == this.showReminder.id)){
          this.showReminder = null;
        }
        if (this.reminders.length == 0) {
          this.dialogRef.close({ action: 'Reminder Deleted', deletedReminders: reminders });
        }
        this.rs.loadReminderNotificationData();
      }
    }, error => this.loading = false)
  }

}
