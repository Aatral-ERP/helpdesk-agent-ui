import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/_services/ticket.service';
import { Ticket } from '../Ticket';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Base64 } from 'js-base64';

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
  selector: 'app-agent-report',
  templateUrl: './agent-report.component.html',
  styleUrls: ['./agent-report.component.css']
})
export class AgentReportComponent implements OnInit {

  ticketCount: any[] = [];
  ratings: any[] = [];
  workingDays: any[] = [];
  ticketStatCount: any[] = [];
  priorityStatus: any[] = [];
  siteAttendance: any[] = [];

  piechartview: any[] = [window.innerWidth / 2, 200];

  constructor(private ts: TicketService, private actRoute: ActivatedRoute, private datePipe: DatePipe) { }
  institutes = [];
  serviceUnder = '';
  ticketPriority = '';
  ticketStatus = '';
  agents = [];
  agent =[];
  photo=null;
  firstName = '';
  lastName ='';
  employeeId = '';
  designation = '';
  avgRate = '';

  fromDate;
  toDate;
  serviceType = '';
  chartDiv = false;

  loading = false;
  

  _agents = [];
  _institutes = [];
  _serviceUnder = [];
  _ticketPriority = [];
  _ticketStatus = [];
  _serviceType = [];
  showGrid = false;
  
  

  _agentsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'emailId',
    textField: 'firstName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
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
    // console.log(date);
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

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };

  public defMonth: IMyDefaultMonth = {
    defMonth: ''
  };

  public locale: string = 'en';

  private gridApi;
  
  
  ngOnInit() {

    this.actRoute.queryParams.subscribe(params => {
      // console.log(params);
      if (params['status']) {
        this.ticketStatus = params['status'];
        if (this.ticketStatus == 'Assigned') {
          let emailId = this.ts.auth.getLoginEmailId();
          let AgentDetails = this.ts.auth.getAgentDetails();
          // console.log(AgentDetails);
          this.agents = [];
          this.agents.push({ emailId: emailId, firstName: AgentDetails.firstName });
        }
        this.submit();
      }

    })

    this.getAgentReportData();
  }

  submit() {
    this.loading = true;
    let request = {
      agents: this.agents,
      fromDate: this.getFromDate(this.fromDate),
      toDate: this.getToDate(this.toDate),  
    }
    this.ts.getAgentReport(request).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.loading = false;
        this.agent = res['agent'];
        this.photo = res['agent']['photo'];
        this.firstName = res['agent']['firstName'];
        this.lastName = res['agent']['lastName'];
        this.employeeId = res['agent']['employeeId'];
        this.designation = res['agent']['designation'];
        this.avgRate = res['averageRating'];


        let ticketCount: Array<any> = res['ticketCount'];
        let ratings: Array<any> = res['ratings'];
        let workingDays: Array<any> = res['workingDays'];
        let ticketStatCount: Array<any> = res['ticketStatCount'];
        let priorityStatus: Array<any> = res['priorityStatus'];
        let siteAttendance: Array<any> = res['siteAttendance'];
        
        
        

          this.ticketCount = [];
          ticketCount.forEach(count => {
            this.ticketCount.push({ name: count.Date, value: count.tickets });
          });

          this.ratings = [];
          ratings.forEach(rateCount => {
          this.ratings.push({ name: rateCount.rating, value: rateCount.count });
           });


           this.workingDays = [];
           workingDays.forEach(attendace => {
          this.workingDays.push({ name: attendace.working_status, value: attendace.count });
           });

           this.ticketStatCount = [];
           ticketStatCount.forEach(tkt => {
          this.ticketStatCount.push({ name: tkt.ticket_status, value: tkt.count });
           });

           this.priorityStatus = [];
           priorityStatus.forEach(pro => {
          this.priorityStatus.push({ name: pro.priority, value: pro.count });
           });

           this.siteAttendance = [];
           siteAttendance.forEach(site => {
          this.siteAttendance.push({ name: site.start_time, value: site.count });
           });

           
      }
    });
  }

  onGridSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    // console.log(selectedRows);
  }

  clear() {
    window.location.reload();
  }

  getAgentReportData() {
    this.ts.getTicketsReportData().subscribe(res => {
      this._agents = res['Agents'];
    });
  }

  //Export CSV 

  view: any[] = [800, 300];
  viewRating: any[] = [500, 250];

  // options
  gradient: boolean = true;
  
  legend : boolean = true;
  legendTitle : String = 'Priority';
  legendPosition : String = 'below';
 
  xAxis:boolean = true;
  yAxis:boolean = true;

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';
  

  colorScheme = {
    domain: ['#A10A28', '#C7B42C', '#00ff40', '#0000ff', '#AAAAAA', '#ff0000', '#ffbf00', '#5AA454', '#ff00bf', '#ff0000', '#3399ff', '#336600']
  };

  colorSchemeAtt = {
    domain: [ '#0000ff', '#AAAAAA', '#ff0000', '#ffbf00', '#5AA454', '#ff00bf', '#ff0000', '#3399ff', '#336600']
  };

  colorSchemeState = {
    domain: [ '#ff0000', '#ffbf00', '#5AA454', '#ff00bf', '#ff0000', '#3399ff', '#336600']
  };


}
