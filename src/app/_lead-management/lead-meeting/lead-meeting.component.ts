import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { Lead } from '../lead-create/Lead';
import { LeadMeeting } from './LeadMeeting';
declare var $: any;

@Component({
  selector: 'app-lead-meeting',
  templateUrl: './lead-meeting.component.html',
  styleUrls: ['./lead-meeting.component.css']
})
export class LeadMeetingComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LeadMeetingComponent>, private lms: LeadManagementService,
    private snackbar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) { }

  _mode = 'Create';

  saving = false;
  meeting: LeadMeeting = new LeadMeeting();
  lead: Lead = new Lead();

  ngOnInit() {
    console.log(this.data);
    if (this.data != null) {
      if (this.data.lead !== undefined)
        this.lead = this.data.lead;
      if (this.data.meeting !== undefined) {
        this.meeting = this.data.meeting;
        this._mode = 'Edit';
      }
    }
  }

  openCreateTaskModal() {
    console.log("openCreateTaskModal 2222");
    $(function () {
      $('#createTaskModal').appendTo("body").modal('show');
    });
  }

  closeDialog() {
    this.dialogRef.close({ action: 'Meeting Updated', meeting: this.meeting });
  }

  saveLeadMeeting() {
    console.log('inside LeadMeeting');
    this.meeting.leadId = this.lead.id;
    this.saving = true;
    this.lms.saveLeadMeeting(this.meeting).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == '00') {
        this.meeting = resp['LeadMeeting'];
        this.closeDialog();
      } else {
        this.snackbar.open(resp['StatusDesc']);
      }
    }, error => this.saving = false)
  }


}
