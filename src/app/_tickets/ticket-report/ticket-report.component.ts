import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TicketService } from 'src/app/_services/ticket.service';
import { Ticket } from '../Ticket';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Base64 } from 'js-base64';
import { MatDialog } from '@angular/material';
import { ViewTicketComponent } from '../view-ticket/view-ticket.component';
import { AGGridButtonRendererComponent } from 'src/app/_modules/common/ag-grid-button-renderer.component';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';

export const MY_CUSTOM_FORMATS = {
  fullPickerInput: 'DD/MM/YYYY',
  parseInput: 'DD/MM/YYYY',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

@Component({
  selector: 'app-ticket-report',
  templateUrl: './ticket-report.component.html',
  styleUrls: ['./ticket-report.component.css']
})
export class TicketReportComponent implements OnInit {

  constructor(private ts: TicketService, private actRoute: ActivatedRoute,
    private datePipe: DatePipe, public dialog: MatDialog) {

    if (!this.role.salesAdmin)
      this._filters.agents = [this.ts.auth.getAgentDetails()];

    this.frameworkComponents = {
      buttonRenderer: AGGridButtonRendererComponent,
    }
  }
  role: RoleMaster = this.ts.auth.getLoggedInRole();

  frameworkComponents: any;
  // institutes = [];
  // serviceUnder = '';
  // serviceType = '';
  // ticketId = '';
  // ticketPriority = '';
  // ticketStatus = '';
  // agents = [];
  // created_by_agents = [];
  // reporting_to_agents = [];
  // fromDate;
  // toDate;

  _agents = [];
  _institutes = [];
  _serviceUnder = [];
  _serviceTypes = [];
  _ticketPriority = [];
  _ticketStatus = [];

  _filters = {
    requestVersion: 'v2',

    institutes: [],
    agents: [],
    createdAgents: [],
    reportingToAgents: [],
    serviceUnder: [],
    serviceType: [],
    ticketPriority: [],
    ticketStatus: [],
    ticketId: '',

    dueDateObject: null,
    fromDueDate: null,
    toDueDate: null,

    createdDateObject: null,
    fromCreatedDate: null,
    toCreatedDate: null,

    lastModifiedDateObject: null,
    fromLastModifiedDate: null,
    toLastModifiedDate: null
  }

  loading = false;

  _agentsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'emailId',
    textField: 'firstName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'instituteId',
    textField: 'instituteName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

  tickets: Array<Ticket> = [];

  getFromDate(date) {
    // console.log(date);
    if (date == null || date === undefined)
      return null;
    else {
      let dd = date['singleDate'];
      return dd['jsDate'];
    }
  }

  getFormattedDate(date) {
    console.log(date);
    this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  getToDate(date) {
    if (date == null || date === undefined)
      return null;
    else {
      let dd = date['singleDate'];
      let formatted = dd['formatted'];
      let farr = formatted.split('/');
      let fromDate = farr[2] + '-' + farr[1] + '-' + farr[0] + 'T23:59:59';
      return new Date(fromDate);
    }
  }

  // public myDatePickerOptions: IAngularMyDpOptions = {
  //   dateRange: false,
  //   dateFormat: 'dd/mm/yyyy',
  // };

  public defMonth: IMyDefaultMonth = {
    defMonth: ''
  };

  public locale: string = 'en';

  private gridApi;
  private gridColumnApi;
  rowData = [];
  columnDefs = [{
    headerName: '', field: 'ticketId', width: 40,
    cellRenderer: 'buttonRenderer',
    cellRendererParams: {
      onClick: this.openViewTicket.bind(this),
      label: null
    }
  },
  {
    headerName: 'Id#', field: 'ticketId', sortable: true, width: 100, filter: true, resizable: true, cellRenderer: (data) => {
      return `<a href="/view-ticket/${data.value}" target="_blank">` + data.value + `</a>`;
    }
  },
  {
    headerName: 'Institute', field: 'instituteName', sortable: true, filter: true, resizable: true,
    tooltip: (data) => { return data.value }, cellRenderer: (data) => {
      return `<a href="/institute/institute-detail?iid=${data.data.institute.instituteId}" target="_blank"> ${data.value} </a>`;
    }
  },
  {
    headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true,
    tooltip: (data) => { return data.value }
    , cellRenderer: (data) => {
      return Base64.decode(data.value);
    }
  },
  { headerName: 'Category', field: 'serviceType', width: 100, sortable: true, filter: true, resizable: true },
  { headerName: 'Status', field: 'status', width: 100, sortable: true, filter: true, resizable: true },
  { headerName: 'Assigned To', field: 'assignedTo', sortable: true, filter: true, resizable: true },
  { headerName: 'Created datetime', field: 'createddatetime', width: 160, sortable: true, filter: true, resizable: true },
  { headerName: 'Lastupdate datetime', field: 'lastupdatedatetime', width: 160, sortable: true, filter: true, resizable: true },
  { headerName: 'last Updated By', field: 'lastUpdatedBy', sortable: true, filter: true, resizable: true },
  { headerName: 'Created By', field: 'createdBy', sortable: true, filter: true, resizable: true },
  { headerName: 'Assigned By', field: 'assignedBy', sortable: true, filter: true, resizable: true },
  { headerName: 'Sending Updates to', field: 'emailUpdates', tooltip: (data) => { data.value }, sortable: true, filter: true, resizable: true },
  { headerName: 'Reporter', field: 'createdBy', sortable: true, filter: true, resizable: true },
  { headerName: 'Email-Id', field: 'emailId', sortable: true, filter: true, resizable: true },
  {
    headerName: 'Product', field: 'product', sortable: true, filter: true, resizable: true,
    tooltip: (data) => { return data.value }
  },
  {
    headerName: 'Rating', field: 'rating', sortable: true, width: 100, filter: true, resizable: true, cellRenderer: (data) => {
      if (data.value != null)
        return `${data.data.rating}/5`;
      else
        return data.value;
    }
  },
  {
    headerName: 'summary', field: 'summary', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      var span = document.createElement('span');
      span.innerHTML = Base64.decode(data.value);
      console.log(Base64.decode(data.value));
      return span.innerText;
    }, tooltip: (data) => {
      var span = document.createElement('span');
      span.innerHTML = Base64.decode(data.value);
      console.log(span.innerHTML);
      return span.innerText;
    }
  },
  { headerName: 'Status', field: 'status', sortable: true, width: 100, filter: true, resizable: true },
  { headerName: 'Priority', field: 'priority', sortable: true, width: 100, filter: true, resizable: true },
  ];

  ngOnInit() {

    this.actRoute.queryParams.subscribe(params => {
      if (params['status']) {
        let _ticketStatus = params['status'];
        if (_ticketStatus == 'Assigned') {
          this._filters.ticketStatus = [_ticketStatus];
          let emailId = this.ts.auth.getLoginEmailId();
          let AgentDetails = this.ts.auth.getAgentDetails();
          this._filters.agents = [];
          this._filters.agents.push({ emailId: emailId, firstName: AgentDetails.firstName });
        } else if (_ticketStatus == 'Marked_As_Completed') {
          this._filters.ticketStatus = [_ticketStatus];
          let emailId = this.ts.auth.getLoginEmailId();
          let AgentDetails = this.ts.auth.getAgentDetails();
          this._filters.reportingToAgents = [];
          this._filters.reportingToAgents.push({ emailId: emailId, firstName: AgentDetails.firstName });
        } else if (_ticketStatus == 'Closed') {
          this._filters.ticketStatus = [_ticketStatus];
          let emailId = this.ts.auth.getLoginEmailId();
          let AgentDetails = this.ts.auth.getAgentDetails();
          this._filters.agents = [];
          this._filters.agents.push({ emailId: emailId, firstName: AgentDetails.firstName });
        } else if (_ticketStatus == 'Raised') {
          this._filters.ticketStatus = [_ticketStatus];
        }
        this.submit();
      }

    })

    this.getTicketsReportData();
  }

  submit() {

    this.rowData = []; this.loading = true;
    this.ts.getTicketsReport(this._filters).subscribe(res => {
      this.loading = false;
      let tickets = [];
      if (res['StatusCode'] == '00') {
        tickets = res['Tickets'];
      }
      tickets.forEach(ticket => {
        let _rowData: any = {};
        _rowData.ticketId = ticket.ticketId;
        _rowData.subject = ticket.subject;
        _rowData.instituteName = ticket.institute.instituteName;
        _rowData.institute = ticket.institute;
        _rowData.status = ticket.status;
        _rowData.priority = ticket.priority;
        _rowData.product = ticket.product;
        _rowData.summary = ticket.summary;
        _rowData.rating = ticket.rating;
        _rowData.serviceType = ticket.serviceType;
        _rowData.lastUpdatedBy = ticket.lastUpdatedBy;
        _rowData.createdBy = ticket.createdBy;
        _rowData.assignedTo = ticket.assignedTo;
        _rowData.assignedBy = ticket.assignedBy;
        _rowData.emailUpdates = ticket.emailUpdates;
        _rowData.emailId = ticket.emailId;
        _rowData.createddatetime = this.datePipe.transform(new Date(ticket.createddatetime), 'MMM dd, yyyy hh:mm a');
        _rowData.lastupdatedatetime = (ticket.lastupdatedatetime == null ? '' : this.datePipe.transform(new Date(ticket.lastupdatedatetime), 'MMM dd, yyyy hh:mm a'));

        this.rowData.push(_rowData);
      }, error => this.loading = false)

    });
  }

  clear() {
    window.location.href = './reports/ticket-report';
  }

  getTicketsReportData() {
    this.ts.getTicketsReportData().subscribe(res => {
      // console.log(res);
      this._institutes = res['Institutes'];
      this._serviceUnder = res['ServiceUnder'];
      this._serviceTypes = res['ServiceTypes'];
      this._ticketPriority = res['TicketPriority'];
      this._ticketStatus = res['TicketStatus'];
      this._agents = res['Agents'];
    });
  }

  //Export CSV 

  onBtnExport() {
    this.gridApi.exportDataAsCsv({ fileName: 'Ticket Report' });
  }

  openViewTicketModal(ticket) {
    console.log(ticket);
    const dialogRef = this.dialog.open(ViewTicketComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: ticket
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onGridSelectionChanged() {
    console.log(this.gridApi.getSelectedRows()[0]);

    this.openViewTicketModal(this.gridApi.getSelectedRows()[0]);

  }

  openViewTicket(event) {
    this.openViewTicketModal(event.rowData);
  }




}
