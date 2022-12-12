import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AGGridButtonRendererComponent } from 'src/app/_modules/common/ag-grid-button-renderer.component';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { LeaveApplied } from 'src/app/_profile/apply-leave/LeaveApplied';
import { LeaveManagementService } from 'src/app/_services/leave-management.service';
import { NeededService } from 'src/app/_services/needed.service';
import Swal from 'sweetalert2';
import { LeaveBalance } from '../leave-balances-sheet/LeaveBalance';
import { LeaveMaster } from '../leave-master-create/LeaveMaster';
declare var $: any;

@Component({
  selector: 'app-leave-applied-report',
  templateUrl: './leave-applied-report.component.html',
  styleUrls: ['./leave-applied-report.component.css']
})
export class LeaveAppliedReportComponent implements OnInit {

  constructor(private ls: LeaveManagementService, private needed: NeededService,
    private snackbar: MatSnackBar, private datePipe: DatePipe) {
    this.frameworkComponents = {
      buttonRenderer: AGGridButtonRendererComponent,
    }
  }

  frameworkComponents: any;
  showFilterScreen = true;
  loading = false;
  saving = false;
  loadingLeavePreview = false;

  leavesApplied: Array<LeaveApplied> = [];

  _leaveApplied: LeaveApplied = null;
  _leavesAppliedAgent: Array<LeaveApplied> = [];
  _leaveMaster: LeaveMaster = null;
  _leaveBalance: LeaveBalance = null;

  _agents: Array<any> = [];

  _filters = {
    leaveType: '',
    status: 'Applied',
    reason: '',
    noOfDays: '',
    appliedBy: [],
    appliedDateObject: null,
    appliedDateFrom: null,
    appliedDateTo: null,
    leaveDateObject: null,
    leaveFrom: null,
    leaveTo: null,
    approvedBy: [],
    approvedDateObject: null,
    approvedDateFrom: null,
    approvedDateTo: null
  }

  _AgentsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'emailId',
    textField: 'firstName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

  columnDefs = [
    {
      headerName: 'Take Action', field: 'taskId', width: 135,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.leaveApplyAction.bind(this),
        label: 'Approve/Reject'
      }
    },
    {
      headerName: 'Staff', field: 'agentEmailId', width: 200, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.getMemberName(data.value);
      }
    },
    {
      headerName: 'Leave From To Date', field: 'leaveFrom', width: 180, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.data.leaveFrom, 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(data.data.leaveTo, 'dd/MM/yyyy');
      }
    },
    { headerName: 'No of Days', field: 'noOfDays', width: 100, sortable: true, filter: true, resizable: true },
    {
      headerName: 'Status', field: 'status', width: 100, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        this.datePipe.transform(data.data.leaveFrom, 'dd/MM/yyyy') + ' - ' + this.datePipe.transform(data.data.leaveTo, 'dd/MM/yyyy');
        if (data.value == 'Approved')
          return `<span class="badge badge-success"> ${data.value} </span>`;
        else if (data.value == 'Rejected')
          return `<span class="badge badge-danger"> ${data.value} </span>`;
        if (data.value == 'Applied')
          return `<span class="badge badge-light"> ${data.value} </span>`;
      }
    },


    { headerName: 'Leave Type', width: 120, field: 'leaveType', sortable: true, filter: true, resizable: true },
    { headerName: 'Reason', field: 'reason', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Applied Date', field: 'createddatetime', width: 180, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    },
    {
      headerName: 'Approved/Rejected By', field: 'approvedRejectedBy', width: 200, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.getMemberName(data.value);
      }
    },
    {
      headerName: 'Approved/Rejected Date', field: 'approvedRejectedDate', width: 180, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    },
    {
      headerName: 'Last Modified Date', field: 'lastupdatedatetime', width: 180, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    },
  ];

  ngOnInit() {
    this.loadNeeded();
    this.searchLeaveApplied();
  }

  getMemberName(emailId) {
    let agent: Agent = this._agents.find(agent => agent.emailId == emailId);
    if (agent !== undefined)
      return agent.firstName + ' ' + agent.lastName;
    else
      return emailId;
  }

  loadNeeded() {
    this.needed.loadNeeded(['agents_min']).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this._agents = resp['agents_min'];
      }
    })
  }

  searchLeaveApplied() {
    this.loading = true;
    this.ls.searchLeaveApplied(this._filters).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.leavesApplied = resp['LeavesApplied'];
      }
    }, error => this.loading = false)
  }

  clearFilters() {

    this._filters = {
      leaveType: '',
      status: '',
      reason: '',
      noOfDays: '',
      appliedBy: [],
      appliedDateObject: null,
      appliedDateFrom: null,
      appliedDateTo: null,
      leaveDateObject: null,
      leaveFrom: null,
      leaveTo: null,
      approvedBy: [],
      approvedDateObject: null,
      approvedDateFrom: null,
      approvedDateTo: null
    }

  }

  leaveApplyAction(event) {
    console.log(event);

    this._leaveApplied = event.rowData;
    if (this._leaveApplied.reason != null)
      this._leaveApplied.reason = this._leaveApplied.reason.replace(/(?:\r\n|\r|\n)/g, '<br>')

    this._leaveMaster = null;
    this._leavesAppliedAgent = [];

    this.getMyAllAppliedLeaves(this._leaveApplied.agentEmailId);

    $(function () {
      $('#leaveActionModal').appendTo("body").modal('show');
    });

  }

  getMyAllAppliedLeaves(agentEmailId) {
    console.log(agentEmailId);
    this.loading = true;
    let agent = this._agents.find(agent => agent.emailId == agentEmailId);
    this.ls.getMyAllAppliedLeaves(agent).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this._leavesAppliedAgent = resp['LeavesApplied'];
        this._leaveMaster = resp['LeaveMaster'];
        this._leaveBalance = resp['LeaveBalance'];

        this._leavesAppliedAgent.sort((a, b) => b.id - a.id).forEach(leave => {
          if (leave.reason != null)
            leave.reason.replace(/(?:\r\n|\r|\n)/g, '<br>')
        });

      }
    }, error => this.loading = false)
  }

  approveLeave() {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to Approve this Leave.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve!'
    }).then((result) => {
      if (result.value) {

        let _leaveApplied = Object.assign({}, this._leaveApplied);
        _leaveApplied.status = 'Approved';
        _leaveApplied.approvedRejectedBy = this.ls.auth.getLoginEmailId();
        _leaveApplied.approvedRejectedDate = new Date();

        this.saving = true;
        this.ls.applyLeave(_leaveApplied).subscribe(resp => {
          this.saving = false;
          if (resp['StatusCode'] == '00') {
            this._leaveApplied = resp['LeaveApplied'];
            $(function () {
              $('#leaveActionModal').appendTo("body").modal('hide');
            });
            this.snackbar.open('Approved Leave Application');
            this.searchLeaveApplied();
          } else {
            this.snackbar.open('Something went wrong, Try Later');
          }
        }, error => this.saving = false)

      }
    })
  }

  rejectLeave() {

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to Reject this Leave.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject!'
    }).then((result) => {
      if (result.value) {

        let _leaveApplied = Object.assign({}, this._leaveApplied);
        _leaveApplied.status = 'Rejected';
        _leaveApplied.approvedRejectedBy = this.ls.auth.getLoginEmailId();
        _leaveApplied.approvedRejectedDate = new Date();

        this.saving = true;
        this.ls.applyLeave(_leaveApplied).subscribe(resp => {
          this.saving = false;
          if (resp['StatusCode'] == '00') {
            $(function () {
              $('#leaveActionModal').appendTo("body").modal('hide');
            });
            this.snackbar.open('Rejected Leave Application');
            this.searchLeaveApplied();
          }
        }, error => this.saving = false)

      }
    })
  }

  getWhichHalf(leaveFromDate: Date) {
    return new Date(leaveFromDate).getHours() == 10 ? 'First Half' : 'Second Half';
  }

}
