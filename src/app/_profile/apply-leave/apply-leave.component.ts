import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { LeaveManagementService } from 'src/app/_services/leave-management.service';
import { LeaveApplied } from './LeaveApplied';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ApplyLeaveComponent implements OnInit {

  constructor(public ls: LeaveManagementService, private snackbar: MatSnackBar, private router: Router) {

  }
  saving = false;
  halfDayDate = new Date();
  _halfDay = 'First Half';

  permissionDate: Date = new Date();
  permissionTimeFrom: Date = new Date();
  permissionTimeTo: Date = new Date();

  leaveApplied: LeaveApplied = new LeaveApplied();

  ngOnInit() {
    this.leaveApplied.agentEmailId = this.ls.auth.getLoginEmailId();
    this.leaveApplied.status = 'Applied';
  }

  applyLeave() {

    if (this.leaveApplied.leaveType == undefined || this.leaveApplied.leaveType == null || this.leaveApplied.leaveType == '') {
      this.snackbar.open('Choose Valid Leave Type');
      return;
    }

    if (this.leaveApplied.leaveType == 'Half Day') {

      if (this.halfDayDate == null || this.halfDayDate == undefined) {
        this.snackbar.open('choose valid Half Day Date');
        return;
      }

      this.halfDayDate = new Date(this.halfDayDate);

      let leaveFrom = new Date();
      let leaveTo = new Date();

      if (this._halfDay == 'First Half') {
        leaveFrom = new Date(this.halfDayDate.getFullYear(), this.halfDayDate.getMonth(), this.halfDayDate.getDate(), 10, 0);
        leaveTo = new Date(this.halfDayDate.getFullYear(), this.halfDayDate.getMonth(), this.halfDayDate.getDate(), 14, 0);
      } else {
        leaveFrom = new Date(this.halfDayDate.getFullYear(), this.halfDayDate.getMonth(), this.halfDayDate.getDate(), 14, 0);
        leaveTo = new Date(this.halfDayDate.getFullYear(), this.halfDayDate.getMonth(), this.halfDayDate.getDate(), 18, 0);
      }

      console.log(leaveFrom, leaveTo);

      this.leaveApplied.leaveFrom = leaveFrom;
      this.leaveApplied.leaveTo = leaveTo;

      this.leaveApplied.noOfDays = 0.5;

    } else if (this.leaveApplied.leaveType == 'Permission') {
      console.log(this.permissionDate, new Date(this.permissionDate));
      if (this.permissionDate == null || this.permissionDate == undefined) {
        this.snackbar.open('choose valid Permission Date');
        return;
      }

      this.permissionDate = new Date(this.permissionDate);
      this.permissionTimeFrom = new Date(this.permissionTimeFrom);
      this.permissionTimeTo = new Date(this.permissionTimeTo);

      let leaveFrom: Date = new Date(this.permissionDate.getFullYear(), this.permissionDate.getMonth(), this.permissionDate.getDate(), this.permissionTimeFrom.getHours(), this.permissionTimeFrom.getMinutes());
      let leaveTo: Date = new Date(this.permissionDate.getFullYear(), this.permissionDate.getMonth(), this.permissionDate.getDate(), this.permissionTimeTo.getHours(), this.permissionTimeTo.getMinutes());

      console.log(leaveFrom, leaveTo);

      this.leaveApplied.leaveFrom = leaveFrom;
      this.leaveApplied.leaveTo = leaveTo;

    } else {
      if (this.leaveApplied.leaveFrom == null || this.leaveApplied.leaveFrom == undefined) {
        this.snackbar.open('choose valid Leave From Date');
        return;
      }
      if (this.leaveApplied.leaveTo == null || this.leaveApplied.leaveTo == undefined) {
        this.snackbar.open('choose valid Leave To Date');
        return;
      }
    }

    console.log(new Date(this.leaveApplied.leaveFrom), new Date(this.leaveApplied.leaveTo), new Date(this.leaveApplied.leaveFrom) > new Date(this.leaveApplied.leaveTo))

    if (new Date(this.leaveApplied.leaveFrom) > new Date(this.leaveApplied.leaveTo)) {
      this.snackbar.open('To Date cannot be greater than From Date');
      return;
    }

    console.log(this.leaveApplied);

    this.saving = true;

    this.ls.applyLeave(this.leaveApplied).subscribe(resp => {
      if (resp['StatusCode'] == "00") {
        this.snackbar.open('Applied Successfully');
        this.router.navigate(['/profile/overview/applied-leave']);
      } else if (resp['StatusCode'] == "03") {
        this.snackbar.open(resp['StatusDesc']);
      } else {
        this.snackbar.open('Something went wrong');
      }
    });

  }

  clearLeave() {
    this.leaveApplied = new LeaveApplied();
    this.leaveApplied.agentEmailId = this.ls.auth.getLoginEmailId();
    this.leaveApplied.status = 'Applied';
  }

  calculateNoOfDays(event, eventFrom) {
    console.log(event, eventFrom);
    console.log(this.leaveApplied.leaveFrom, this.leaveApplied.leaveTo);

    if (eventFrom == "From")
      this.leaveApplied.leaveFrom = event;
    else
      this.leaveApplied.leaveTo = event;

    try {
      if (this.leaveApplied.leaveFrom != null && this.leaveApplied.leaveFrom !== undefined &&
        this.leaveApplied.leaveTo != null && this.leaveApplied.leaveTo !== undefined) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = this.leaveApplied.leaveFrom;
        const secondDate = this.leaveApplied.leaveTo;

        const diffDays = Math.round(Math.abs((+firstDate - +secondDate) / oneDay));
        console.log(diffDays);
        this.leaveApplied.noOfDays = diffDays + 1;
      }
    } catch (err) {
      console.error(err)
    }
  }

  changePermissionTimeFrom(event) {
    this.permissionTimeFrom = event;
    console.log(this.permissionTimeFrom);
  }

  changePermissionTimeTo(event) {
    this.permissionTimeTo = event;
    console.log(this.permissionTimeTo);
  }

  changePermissionDate(event) {
    this.permissionDate = event;
    console.log(this.permissionDate);
  }

  changeHalfDayDate(event) {
    this.halfDayDate = event;
    console.log(this.halfDayDate);
  }

}
