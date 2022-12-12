import { Component, OnInit } from '@angular/core';
import { TicketService } from '../_services/ticket.service';
import { AuthService } from '../_services/auth.service';
import { AgentService } from '../_services/agent.service';
import Swal from 'sweetalert2';
import { Attendance } from '../_admin/Attendance';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RoleMaster } from '../_admin/role-create/RoleMaster';
import { Ticket } from '../_tickets/Ticket';
import { ViewTicketComponent } from '../_tickets/view-ticket/view-ticket.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private ts: TicketService, private as: AgentService, private route: Router,
    private auth: AuthService, private datePipe: DatePipe, public dialog: MatDialog) { }

  role: RoleMaster = this.auth.getLoggedInRole();
  loading = false;
  AgentDetails = this.auth.getAgentDetails();

  UnAssignedTickets: Array<Ticket> = [];
  AssignedToMeTickets: Array<Ticket> = [];
  AssignedByMeTickets: Array<Ticket> = [];
  AssignedToMeClosedTickets: Array<Ticket> = [];
  AssignedByMeClosedTickets: Array<Ticket> = [];
  attendance: Attendance;
  Stats = {
    assignedToMe: 0,
    closedCount: 0,
    institutesCount: 0,
    pendingCount: 0,
    unassginedCount: 0,
    markedAsCompleted: 0
  }

  ngOnInit() {
    this.getHomeScreenDetails();

    // navigator.geolocation.getCurrentPosition((position) => {
    //   console.log(position);
    //   this.attendance.geoCoordinates = position.coords.latitude + ',' + position.coords.longitude;
    // });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        this.attendance.geoCoordinates = position.coords.latitude + ',' + position.coords.longitude;
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: false, timeout: 10 * 1000 * 1000, maximumAge: 0 }
    );
  }

  getHomeScreenDetails() {
    this.loading = true;
    this.ts.getHomeScreenDetails().subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        this.UnAssignedTickets = res['UnAssignedTickets'];
        this.AssignedToMeTickets = res['AssignedToMeTickets'];
        this.AssignedByMeTickets = res['AssignedByMeTickets'];
        this.AssignedToMeClosedTickets = res['AssignedToMeClosedTickets'];
        this.AssignedByMeClosedTickets = res['AssignedByMeClosedTickets'];

        this.Stats = res['Stats'];
        this.attendance = res['Attendance'];
      }
    }, error => this.loading = false)
  }

  markAttendance(status) {
    if (this.attendance == null || this.attendance === undefined) {
      Swal.fire('Cannot find your Attendance', '', "info");
      return false;
    }
    let attendance_clone = Object.assign({}, this.attendance);
    attendance_clone.workingStatus = status;


    if (attendance_clone.workingStatus == 'W') {
      attendance_clone.startTime = new Date();
    }

    navigator.permissions.query({
      name: 'geolocation'
    }).then((result) => {
      console.log(result);
      if (result.state == 'granted') {
        navigator.geolocation.getCurrentPosition((position) => {
          this.attendance.geoCoordinates = position.coords.latitude + ',' + position.coords.longitude;
        });

        this.markAttendanceAPI(attendance_clone);
      } else if (result.state == 'prompt') {
        navigator.geolocation.getCurrentPosition((position) => {
          this.attendance.geoCoordinates = position.coords.latitude + ',' + position.coords.longitude;
        });

        // this.markAttendanceAPI(attendance_clone);
      } else if (result.state == 'denied') {
        alert('Location access denied. Allow Location Access to add Attendance.');
      }
    })

  }

  markAttendanceAPI(attendance_clone) {

    if (this.attendance.geoCoordinates == null || this.attendance.geoCoordinates == '') {
      alert('Cannot fetch geo-locations');
      return false;
    }

    console.log(attendance_clone);
    this.as.markAttendance(attendance_clone).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.attendance = res['Attendance'];
        this.attendance.startTime = this.datePipe.transform(this.attendance.startTime, 'hh:mm:ss');
        Swal.fire('Attendance Marked', '', 'success');
      } else {
        Swal.fire('Cannot Mark Attendance at this moment', 'Try Later Again', 'error');
      }
    })
  }

  tabToGmap(lat_lng: string) {
    if (lat_lng != null && lat_lng != undefined && lat_lng != '') {
      window.open("https://www.google.com/maps?q=" + lat_lng);
    }

  }

  openViewTicketModal(ticket) {
    console.log(ticket);
    const dialogRef = this.dialog.open(ViewTicketComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: ticket
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined && ticket !== null) {
        if (result.ticketId) {
          this.getHomeScreenDetails();
        }
      }

    });
  }

  isCrossedDueDate(dueDate: Date) {
    if (dueDate == null)
      return true;
    else if (new Date(dueDate) > new Date())
      return true;
    else
      return false;
  }
}
