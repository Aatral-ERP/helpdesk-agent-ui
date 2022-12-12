import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ReminderService } from 'src/app/_services/reminder.service';
import { CreateReminderComponent } from '../create-reminder/create-reminder.component';
import { Reminder } from '../create-reminder/Reminder';
import { ViewRemindersComponent } from '../view-reminders/view-reminders.component';

@Component({
  selector: 'app-view-reminders-notification',
  templateUrl: './view-reminders-notification.component.html',
  styleUrls: ['./view-reminders-notification.component.css']
})
export class ViewRemindersNotificationComponent implements OnInit {

  constructor(private dialog: MatDialog, private rs: ReminderService) {
    // let fromdate = new Date().setDate(new Date().getDate() - 2);
    let todate = new Date().setDate(new Date().getDate() + 5);

    this._filters.eventDateTimeFrom = new Date(new Date());
    this._filters.eventDateTimeTo = new Date(todate);
  }

  loading = true;
  reminders: Array<Reminder> = [];

  _filters = {
    agentEmailId: this.rs.auth.getLoginEmailId(),
    eventDateTimeFrom: null,
    eventDateTimeTo: null
  }

  ngOnInit() {
    console.log("Reminders ngOnInit");
    this.rs.getProfileObs().subscribe(reminders => {
      console.log("Received New Data::", reminders);
      if (reminders != null) {
        this.loading = false;
        this.reminders = reminders;
        this.reminders.sort((a, b) => +new Date(b.eventDateTime) - +new Date(a.eventDateTime));
      }
    });
    this.rs.loadReminderNotificationData();
  }

  openCreateReminderDialog() {

    const dialogRef = this.dialog.open(CreateReminderComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      autoFocus: false,
      data: undefined
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  openViewRemindersDialog(reminder) {
    console.log(reminder);
    const dialogRef = this.dialog.open(ViewRemindersComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      autoFocus: false,
      data: { recurringId: reminder.recurringId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  changeStatus(reminder, status, _event) {
    _event.stopPropagation();
    console.log(reminder, status);
    let __rem = Object.assign({}, reminder);
    __rem.status = status;
    this.rs.editReminders([__rem]).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        let index = this.reminders.findIndex(rem => reminder.id == rem.id);
        this.reminders[index] = resp['Reminders'][0];
      }
    })
  }

}
