import { Component, OnInit } from '@angular/core';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { LeadMeeting } from '../lead-meeting/LeadMeeting';
import { LeadActivity } from './LeadActivity';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { NeededService } from 'src/app/_services/needed.service';
import { IAngularMyDpOptions } from 'angular-mydatepicker';

@Component({
  selector: 'app-lead-activies-report',
  templateUrl: './lead-activies-report.component.html',
  styleUrls: ['./lead-activies-report.component.css']
})
export class LeadActiviesReportComponent implements OnInit {


  loading = false;
  _respsResp=[];
  //leadActivity :Array<LeadActivity>=[];

  private gridApi;
  private gridColumnApi;

  leadAct:LeadActivity = new LeadActivity();

  _companies: Array<string> = [];
  _products: Array<string> = [];
  _agents: Array<Agent> = [];
  _lead_sources: Array<string> = [];
  _lead_status: Array<string> = [];
  _lead_categories: Array<string> = [];
  _industry_types: Array<string> = [];
  rowData = [];

  _filters={
    lead : [],
    agent : [],
    products:[],
    companies:[],
    fromDateTime :null,
    toDateTime : null,
    createdFromDate:null,
    createdToDate:null,
    leadDateObject: null,
    leadDateFrom:null,
    leadDateTo:null,
    lastUpdatedDateObject: null,
    lastUpdateFromDate: null,
    lastUpdateToDate:null,


  };


  _commonDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'name',
    textField: 'name',
    itemsShowLimit: 2,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

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
  constructor(private ls:LeadManagementService,private needed: NeededService) { 
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._filters.leadDateFrom = new Date(date);
    this._filters.leadDateTo = new Date();
    this._filters.leadDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };
  }

  ngOnInit() {
    this.getActivityReport(); 
    this.loadNeeded();
    
  
  }


  columnDefs=[

    { headerName: 'id', field: 'id', width: 70, sortable: true, filter: true, resizable: true },
    { headerName: 'Institute', field: 'company', width: 400, sortable: true, filter: true, resizable: true },
    { headerName: 'Title', field: 'title', width: 300, sortable: true, filter: true, resizable: true },
    { headerName: 'Category', field: 'category', width: 200, sortable: true, filter: true, resizable: true },
    { headerName: 'Industry Type', field: 'industryType', width: 200, sortable: true, filter: true, resizable: true },
    { headerName: 'Products', field: 'products', width: 300, sortable: true, filter: true, resizable: true },
    { headerName: 'LeadDate', field: 'leadDate', width: 200, sortable: true, filter: true, resizable: true },
    { headerName: 'Agent', field: 'ownerEmailId', width: 200, sortable: true, filter: true, resizable: true },
    { headerName: 'Subject', field: 'subject', width: 200, sortable: true, filter: true, resizable: true },
    { headerName: 'Location', field: 'location', width: 200, sortable: true, filter: true, resizable: true },
    { headerName: 'From Date', field: 'fromDateTime', width: 200, sortable: true, filter: true, resizable: true,cellRenderer: (data) => {
      return this.datePipe.transform(data.value, 'dd/MM/yyyy'); 
    }
   },
    { headerName: 'To date', field: 'toDateTime', width: 200, sortable: true, filter: true, resizable: true,cellRenderer:(data)=>{
      return this.datePipe.transform(data.value, 'dd/MM/yyyy'); 
    } 
  },
    { headerName: 'LastUpdated Date', field: 'lastupdatedatetime', width: 200, sortable: true, filter: true, resizable: true,cellRenderer:(data)=>{
  return this.datePipe.transform(data.value,'dd/mm/yyyy hh:mm');
    } },
  ];

  getActivityReport(){
    this.loading = true;
    this.ls.loadLeadActivityReport(this._filters).subscribe(res=>{
      console.log(res);
      this.rowData = [];
      this.loading=false;
      this._respsResp = new Array();
      this._respsResp = res['leadActivities'];
      this._respsResp.filter(resp=>resp.leadMeeting!=null).forEach(resp=>{
      
        let _rowdata:any ={};
       _rowdata.id=resp.lead.id;
       _rowdata.company=resp.lead.company;
       _rowdata.title=resp.lead.title;
       _rowdata.category=resp.lead.category;
       _rowdata.industryType=resp.lead.industryType;
       _rowdata.products=resp.lead.products;
       _rowdata.leadDate=resp.lead.leadDate;

       _rowdata.ownerEmailId=resp.lead.ownerEmailId;
       _rowdata.location=resp.leadMeeting.location;
       _rowdata.subject=resp.leadMeeting.subject;
       _rowdata.description=resp.leadMeeting.description;
       _rowdata.participants=resp.leadMeeting.participants;
       _rowdata.fromDateTime=resp.leadMeeting.fromDateTime;
       _rowdata.toDateTime=resp.leadMeeting.toDateTime;
       _rowdata.lastupdatedatetime=resp.leadMeeting.lastupdatedatetime;


        this.rowData.push(_rowdata);
        
      })
      console.log(this.rowData);

    }, error => { this.loading = false; })

  }

  onBtnExport() {
    this.gridApi.exportDataAsCsv({ fileName: 'Lead-Activity-Report' });
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

 
  clearFilters() {
    this._filters={
      lead : [],
      agent : [],
      products:[],
      companies:[],
      fromDateTime :null,
      toDateTime : null,
      createdFromDate:null,
      createdToDate:null,
      leadDateObject: null,
      leadDateFrom:null,
      leadDateTo:null,
      lastUpdatedDateObject: null,
      lastUpdateFromDate: null,
      lastUpdateToDate:null,
  
  
    };
  }

  loadNeeded() {
    this.needed.loadNeeded(['agents_min', 'lead_companies', 'lead_products', 'lead_industry_type', 'lead_sources', 'lead_status', 'lead_categorys'])
      .subscribe(resp => {
        if (resp['StatusCode'] = '00') {

          if (resp['agents_min'])
            this._agents = resp['agents_min'];

          if (resp['lead_companies'])
            this._companies = resp['lead_companies'];

          if (resp['lead_products'])
            this._products = resp['lead_products'];

          if (resp['lead_industry_type'])
            this._industry_types = resp['lead_industry_type'];

          if (resp['lead_sources'])
            this._lead_sources = resp['lead_sources'];

          if (resp['lead_status'])
            this._lead_status = resp['lead_status'];

          if (resp['lead_categorys'])
            this._lead_categories = resp['lead_categorys'];

          // if (!this.role.leadManagementAdmin) {
          //   this._filters.owners = [this.lms.auth.getAgentDetails()]
          // }
        }
      })
  }
  
}
