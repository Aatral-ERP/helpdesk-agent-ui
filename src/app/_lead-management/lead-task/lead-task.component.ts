import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LeadTask } from './LeadTask';
declare var $: any;

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { Lead } from '../lead-create/Lead';

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
  selector: 'app-lead-task',
  templateUrl: './lead-task.component.html',
  styleUrls: ['./lead-task.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class LeadTaskComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LeadTaskComponent>, private lms: LeadManagementService,
    private snackbar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) { }

  _mode = 'Create';

  saving = false;
  task: LeadTask = new LeadTask();
  lead: Lead = new Lead();

  ngOnInit() {
    console.log(this.data);
    if (this.data != null) {
      if (this.data.lead !== undefined)
        this.lead = this.data.lead;
      if (this.data.task !== undefined) {
        this.task = this.data.task;
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
    this.dialogRef.close({ action: 'Task Updated', task: this.task });
  }

  saveLeadTask() {
    console.log('inside saveLeadTask');
    this.task.leadId = this.lead.id;
    this.saving = true;
    this.lms.saveLeadTask(this.task).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == '00') {
        this.task = resp['LeadTask'];
        this.closeDialog();
      } else {
        this.snackbar.open(resp['StatusDesc']);
      }
    }, error => this.saving = false)
  }

}
