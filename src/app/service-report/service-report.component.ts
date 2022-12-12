import { Component, OnInit } from '@angular/core';
import { AgentService } from '../_services/agent.service';
import { InstituteService } from '../_services/institute.service';
import { TicketService } from '../_services/ticket.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

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
  selector: 'app-service-report',
  templateUrl: './service-report.component.html',
  styleUrls: ['./service-report.component.css']
})
export class ServiceReportComponent implements OnInit {

  
  constructor(private as: AgentService, private is: InstituteService, private ts: TicketService,private snackbar: MatSnackBar, private datePipe: DatePipe) { }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  institutionList = [];
  instituteTypeList = [];
  serviceTypeList = [];
  instituteAllList = [];

  _institutes = [];
  _selectedInstitute = [];
  dropdownList = [];
  rowData = [];
  instReport: any[];
  showGrid = false;
  instituteDetails: any[];

  private gridApi;
  private gridColumnApi;
  fromDate;
  toDate;
  isServiceReport = false;
  instituteId = '';
  instituteName = '';
  fileName ='';

  ngOnInit() {
    this.loadInstituteDetails();
    this.loadInstituteName();
  }

  

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


  loadInstituteDetails() {
    this.as.loadInstituteDetails().subscribe(res => {
      console.log(res);
      this.instituteTypeList = res['instituteTypeList'];
      this.instituteAllList = res['instituteAllList'];

    })
  }


  _search_instfilters = {
    institutes: [],
    instituteId: '',
    fromDate: this.getFromDate(this.fromDate),
    toDate: this.getToDate(this.toDate), 
  
  }
  loadInstituteName() {
    this.ts.getTicketsReportData().subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
    })
  }

  clear() {
    window.location.reload();
  }

  
  getReport()
  {
 this.ts.serviceReport(this._search_instfilters).subscribe(res=>{
  console.log(res);
  this.instituteId = res['InstituteId'];
  this.instituteName = res['InstituteName'];
  this.fileName = this.instituteName +'.pdf';


  if(res['StatusCode'] == '00')
  {
    this.snackbar.open('Generated Successfully');
    this.isServiceReport = true;
  }
  else{
    this.snackbar.open(res['No Records Found..!!']);
  }
}, error => { console.log(error); this.isServiceReport = false; })
  }

  viewPDF(instituteId,fileName) {
    let url = environment.apiUrl + 'download/download-service-report-pdf/view/' + instituteId+ '/' + fileName;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }
  
  downloadPDF(instituteId,fileName) {
    let url = environment.apiUrl + 'download/download-service-report-pdf/download/' + instituteId + '/' + fileName;
    window.open(url, '_blank');
  }
}
