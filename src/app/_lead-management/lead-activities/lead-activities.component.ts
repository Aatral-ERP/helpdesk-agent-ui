import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import Swal from 'sweetalert2';
import { Lead } from '../lead-create/Lead';
import { LeadMeetingComponent } from '../lead-meeting/lead-meeting.component';
import { LeadMeeting } from '../lead-meeting/LeadMeeting';
import { LeadTaskComponent } from '../lead-task/lead-task.component';
import { LeadTask } from '../lead-task/LeadTask';
declare var $: any;

@Component({
  selector: 'app-lead-activities',
  templateUrl: './lead-activities.component.html',
  styleUrls: ['./lead-activities.component.css']
})
export class LeadActivitiesComponent implements OnInit {

  constructor(public dialog: MatDialog, private lms: LeadManagementService) { }

  _tasks_displayedColumns: string[] = [];
  _meetings_displayedColumns: string[] = [];

  @Input() lead: Lead;

  loading = false;
  dataSource_tasks = new MatTableDataSource([]);
  dataSource_meetings = new MatTableDataSource([]);

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  tasks: Array<LeadTask> = [];
  meetings: Array<LeadMeeting> = [];

  ngOnInit() {
    this.loadLeadTasks();
    this.loadLeadMeetings();
  }

  loadLeadTasks() {
    this.loading = true;
    this.lms.loadLeadTasks(this.lead.id).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.tasks = resp['LeadTasks'];
        this._tasks_displayedColumns = ['id', 'subject', 'dueDateTime', 'priority', 'status', 'createddatetime', 'lastupdatedatetime', 'delete'];
        this.dataSource_tasks = new MatTableDataSource(this.tasks);
        this.dataSource_tasks.sort = this.sort;
      }
    }, error => this.loading = false)
  }

  loadLeadMeetings() {
    this.loading = true;
    this.lms.loadLeadMeetings(this.lead.id).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.meetings = resp['LeadMeetings'];
        this._meetings_displayedColumns = ['id', 'subject', 'fromDateTime', 'toDateTime', 'location', 'participants', 'createddatetime', 'lastupdatedatetime', 'delete'];
        this.dataSource_meetings = new MatTableDataSource(this.meetings);
        this.dataSource_meetings.sort = this.sort;
      }
    }, error => this.loading = false)
  }

  openCreateTaskModal(task?: LeadTask) {
    const dialogRef = this.dialog.open(LeadTaskComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: { lead: this.lead, task: task }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result['action'] == 'Task Updated') {
        this.loadLeadTasks();
      }
    });
  }

  openCreateMeetingModal(meeting?: LeadMeeting) {
    const dialogRef = this.dialog.open(LeadMeetingComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: { lead: this.lead, meeting: meeting }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result['action'] == 'Meeting Updated') {
        this.loadLeadMeetings();
      }
    });
  }

  getINNERText(str: string) {
    if (str != null)
      return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
    else
      return '';
  }

  deleteMeeting(meeting: LeadMeeting) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes delete!'
    }).then((result) => {
      if (result.value) {

        this.loading = true;
        this.lms.deleteLeadMeeting(meeting).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.loadLeadMeetings();
          } else {
            alert(resp['StatusDesc']);
          }
        }, error => this.loading = false)

      }
    })
  }

  deleteTask(task: LeadTask) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes delete!'
    }).then((result) => {
      if (result.value) {

        this.loading = true;
        this.lms.deleteLeadTask(task).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.loadLeadTasks();
          } else {
            alert(resp['StatusDesc']);
          }
        }, error => this.loading = false)

      }
    })
  }


}
