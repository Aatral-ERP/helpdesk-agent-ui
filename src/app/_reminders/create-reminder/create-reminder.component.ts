import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ReminderService } from 'src/app/_services/reminder.service';
import { TaskViewComponent } from 'src/app/_teams/task-view/task-view.component';
import { ViewRemindersComponent } from '../view-reminders/view-reminders.component';
import { Reminder } from './Reminder';

@Component({
  selector: 'app-create-reminder',
  templateUrl: './create-reminder.component.html',
  styleUrls: ['./create-reminder.component.css']
})
export class CreateReminderComponent implements OnInit {

  constructor(private rs: ReminderService, public dialogRef: MatDialogRef<TaskViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private snackbar: MatSnackBar, private router: Router,
    private dialog: MatDialog) { }

  reminder: Reminder = new Reminder();
  reminders: Array<Reminder> = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();

  eventDate: string = '1';
  eventMonth: string = '1';
  eventTime: Date = null;
  eventDay: string = 'Monday';

  yearFrom = new Date().getFullYear();
  yearTo = new Date().getFullYear() + 1;

  _dates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'];

  excludeSundays = true;
  excludeSaturdays = false;

  eventDates: Array<Date> = [];

  loading = false;

  ngOnInit() {
    this.setEventTime('Today 6PM');
  }

  resetTabChange() {

    this.yearFrom = new Date().getFullYear();
    this.yearTo = new Date().getFullYear() + 1;

    this.fromDate = new Date();
    this.toDate = new Date();

    this.eventDate = '1';
    this.eventMonth = '1';
    this.eventTime = null;
    this.eventDay = 'Monday';

    this._dates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28'];

    this.excludeSundays = true;
    this.excludeSaturdays = false;
  }

  saveReminder() {

    if (this.reminder.subject == '') {
      this.snackbar.open('Subject cannot be empty');
      return;
    }

    this.prepareRemindersArray();

    this.loading = true;
    this.rs.saveReminder(this.reminders).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Saved successfully');
        this.openViewRemindersDialog(resp['RecurringId']);
        this.dialogRef.close();
        this.rs.loadReminderNotificationData();
      } else if (resp['StatusCode'] == '03') {
        this.snackbar.open(resp['StatusDesc']);
      } else {
        this.snackbar.open('Something went wrong.');
      }
    }, error => this.loading = false)
  }

  prepareRemindersArray() {

    this.reminders = [];

    if (this.reminder.recurringType == 'One Time') {

      let _reminder = Object.assign({}, this.reminder);
      _reminder.agentEmailId = this.rs.auth.getLoginEmailId();
      this.reminders.push(_reminder);

    } else if (this.reminder.recurringType == 'Recurring Daily') {
      this.eventDates.forEach((_date: Date) => {
        let _reminder = Object.assign({}, this.reminder);
        _reminder.agentEmailId = this.rs.auth.getLoginEmailId();
        _reminder.eventDateTime = new Date(_date);
        this.reminders.push(_reminder);
      })
    } else if (this.reminder.recurringType == 'Recurring Weekly') {
      this.eventDates.forEach((_date: Date) => {
        let _reminder = Object.assign({}, this.reminder);
        _reminder.agentEmailId = this.rs.auth.getLoginEmailId();
        _reminder.eventDateTime = new Date(_date);
        this.reminders.push(_reminder);
      })
    } else if (this.reminder.recurringType == 'Recurring Monthly') {
      this.eventDates.forEach((_date: Date) => {
        let _reminder = Object.assign({}, this.reminder);
        _reminder.agentEmailId = this.rs.auth.getLoginEmailId();
        _reminder.eventDateTime = new Date(_date);
        this.reminders.push(_reminder);
      })
    } else if (this.reminder.recurringType == 'Recurring Yearly') {
      this.eventDates.forEach((_date: Date) => {
        let _reminder = Object.assign({}, this.reminder);
        _reminder.agentEmailId = this.rs.auth.getLoginEmailId();
        _reminder.eventDateTime = new Date(_date);
        this.reminders.push(_reminder);
      })
    }
    console.log(this.reminders);
  }

  setEventTime(timeValue) {
    console.log('timeValue:', timeValue);
    let date: Date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    if (timeValue == 'Today 4PM') {
      date.setHours(16);
    } else if (timeValue == 'Today 6PM') {
      date.setHours(18);
    } else if (timeValue == 'Tomorrow 10AM') {
      date.setDate(new Date().getDate() + 1);
      date.setHours(10);
    } else if (timeValue == 'Tomorrow 6PM') {
      date.setDate(new Date().getDate() + 1);
      date.setHours(18);
    }

    this.reminder.eventDateTime = date;
  }

  closeDialog() {
    this.dialogRef.close({ action: 'Reminder Closed' });
  }

  openViewRemindersDialog(recurringId) {

    const dialogRef = this.dialog.open(ViewRemindersComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      autoFocus: false,
      data: { recurringId: recurringId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  calculateRDEventDays(_event, fromType) {
    if (_event == null)
      return;

    console.log(_event, fromType);
    if (fromType == 'From') {
      this.fromDate = new Date(_event);
    } else if (fromType == 'To') {
      this.toDate = new Date(_event);
    }

    console.log(this.fromDate, this.toDate);
    if (this.fromDate != null && this.toDate != null) {
      console.log(this.getRDDates(this.fromDate, this.toDate));
    }
  }

  calculateRWEventDays(_event, fromType) {
    if (_event == null)
      return;

    console.log(_event, fromType);
    if (fromType == 'From') {
      this.fromDate = new Date(_event);
    } else if (fromType == 'To') {
      this.toDate = new Date(_event);
    }

    console.log(this.fromDate, this.toDate);
    if (this.fromDate != null && this.toDate != null) {
      console.log(this.getRWDates(this.fromDate, this.toDate));
    }
  }

  calculateRMEventDays(_event, fromType) {
    if (_event == null)
      return;

    console.log(_event, fromType);
    if (fromType == 'From') {
      this.fromDate = new Date(_event);
    } else if (fromType == 'To') {
      this.toDate = new Date(_event);
    }

    console.log(this.fromDate, this.toDate);
    if (this.fromDate != null && this.toDate != null) {
      console.log(this.getRMDates(this.fromDate, this.toDate));
    }
  }

  calculateRYEventDays(_event, fromType) {
    if (_event == null)
      return;

    console.log(_event, fromType);
    if (fromType == 'From') {
      this.yearFrom = _event;
    } else if (fromType == 'To') {
      this.yearTo = _event;
    }

    console.log(this.fromDate, this.toDate);
    if (this.yearFrom != null && this.yearTo != null) {

      this.fromDate = new Date(this.yearFrom, +this.eventMonth, +this.eventDate);
      this.toDate = new Date(this.yearTo, +this.eventMonth, +this.eventDate);

      console.log(this.getRYDates(this.fromDate, this.toDate));
    }
  }

  getRYDates(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    dates.push(this.getDateTime(startDate, this.eventTime));
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(this.getDateTime(currDate.clone().toDate(), this.eventTime));
    }
    console.log(startDate.getTime(), endDate.getTime(), startDate.getTime() != endDate.getTime())
    if (startDate.getTime() != endDate.getTime())
      dates.push(this.getDateTime(endDate, this.eventTime));

    this.eventDates = [];
    dates.forEach((date: Date) => {
      console.log(date.getDate().toString(), this.eventDate, date.getDate().toString() == this.eventDate);
      if (date.getMonth().toString() == this.eventMonth && date.getDate().toString() == this.eventDate)
        this.eventDates.push(date);
    })
    return dates;
  }

  getRMDates(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');


    dates.push(this.getDateTime(startDate, this.eventTime));
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(this.getDateTime(currDate.clone().toDate(), this.eventTime));
    }
    if (startDate.getTime() != endDate.getTime())
      dates.push(this.getDateTime(endDate, this.eventTime));

    this.eventDates = [];
    dates.forEach((date: Date) => {
      console.log(date.getDate().toString(), this.eventDate, date.getDate().toString() == this.eventDate);
      if (date.getDate().toString() == this.eventDate)
        this.eventDates.push(date);
    })
    return dates;
  }

  getRWDates(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    dates.push(this.getDateTime(startDate, this.eventTime));
    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(this.getDateTime(currDate.clone().toDate(), this.eventTime));
    }
    if (startDate.getTime() != endDate.getTime())
      dates.push(this.getDateTime(endDate, this.eventTime));

    this.eventDates = [];
    dates.forEach((date: Date) => {
      if (days[date.getDay()] == this.eventDay)
        this.eventDates.push(date);
    })
    return dates;
  }

  getRDDates(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    dates.push(this.getDateTime(startDate, this.eventTime));

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates.push(this.getDateTime(currDate.clone().toDate(), this.eventTime));
    }
    if (startDate.getTime() != endDate.getTime())
      dates.push(this.getDateTime(endDate, this.eventTime));

    this.eventDates = [];
    dates.forEach((date: Date) => {
      if (days[date.getDay()] != 'Saturday' && days[date.getDay()] != 'Sunday') {
        this.eventDates.push(date);
      } else if (days[date.getDay()] == 'Sunday' && !this.excludeSundays) {
        this.eventDates.push(date);
      } else if (days[date.getDay()] == 'Saturday' && !this.excludeSaturdays) {
        this.eventDates.push(date);
      }
    })
    return dates;
  }

  getDateTime(date: Date, time: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), 0);
  }

  closeDatePicker(eventData: any, fromType, dp?: any) {
    dp.close();
  }

}
