import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { NeededService } from 'src/app/_services/needed.service';
import { UtilService } from 'src/app/_services/util.service';
import { Lead } from '../lead-create/Lead';

@Component({
  selector: 'app-lead-reports',
  templateUrl: './lead-reports.component.html',
  styleUrls: ['./lead-reports.component.css']
})
export class LeadReportsComponent implements OnInit {

  constructor(private lms: LeadManagementService, private needed: NeededService,
    private datePipe: DatePipe, private util: UtilService, private router: Router, private actRoute: ActivatedRoute) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._filters.leadDateFrom = new Date(date);
    this._filters.leadDateTo = new Date();
    this._filters.leadDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    this.actRoute.queryParams.subscribe(params => {
      if (!(JSON.stringify(params) === JSON.stringify({}))) {
        this._filters.leadDateFrom = new Date(params['leadDateFrom']);
        this._filters.leadDateTo = new Date(params['leadDateTo']);

        this._filters.leadDateObject = {
          isRange: true, singleDate: null, dateRange: {
            beginJsDate: new Date(params['leadDateFrom']),
            endJsDate: new Date(params['leadDateTo'])
          }
        };

        if (params['owner'] !== undefined) {
          this._filters.owners = [
            {
              "emailId": params['owner'],
              "firstName": params['owner']
            }
          ];
        }

        if (params['state'] !== undefined) {
          this._filters.state = params['state'];
        }

        if (params['leadSources'] !== undefined) {
          this._filters.leadSources = [params['leadSources']];
        }

        if (params['categories'] !== undefined) {
          this._filters.categories = [params['categories']];
        }

        if (params['products'] !== undefined) {
          this._filters.products = [params['products']];
        }

      }

    });
  }

  role: RoleMaster = this.lms.auth.getLoggedInRole();

  showFilterScreen = true;
  loading = false;

  _companies: Array<string> = [];
  _products: Array<string> = [];
  _agents: Array<Agent> = [];
  _lead_sources: Array<string> = [];
  _lead_status: Array<string> = [];
  _lead_categories: Array<string> = [];
  _industry_types: Array<string> = [];

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

  private gridApi;
  leads: Array<Lead> = [];

  _filters = {
    companies: [],
    owners: [],
    products: [],
    industryTypes: [],
    categories: [],
    leadSources: [],
    status: [],
    title: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    activeStatus: '',
    leadDateFrom: null,
    leadDateTo: null,
    leadDateObject: null,
    lastUpdatedDateFrom: null,
    lastUpdatedDateTo: null,
    lastUpdatedDateObject: null
  }

  columnDefs = [
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/lead-management/create?edit=1&lid=${data.value}" target="_blank"> <i class='fas fa-edit'></i> </a>`;
      }
    },
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/lead-management/overview/${data.value}" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
      }
    },
    { headerName: 'Company', field: 'company', sortable: true, filter: true, resizable: true },
    { headerName: 'Lead Owner', field: 'ownerName', sortable: true, filter: true, resizable: true },
    { headerName: 'Lead Owner Email Id', field: 'ownerEmailId', sortable: true, filter: true, resizable: true },
    { headerName: 'Title', field: 'title', sortable: true, filter: true, resizable: true },
    { headerName: 'products', field: 'products', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Lead Date', field: 'leadDate', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    { headerName: 'Lead Source', field: 'leadSource', sortable: true, filter: true, resizable: true },
    { headerName: 'Contact Person', field: 'fullName', sortable: true, filter: true, resizable: true },
    { headerName: 'Stage', field: 'status', sortable: true, filter: true, resizable: true },
    { headerName: 'Categories', field: 'category', sortable: true, filter: true, resizable: true },
    { headerName: 'Industry Type', field: 'industryType', sortable: true, filter: true, resizable: true },
    // { headerName: 'Email', field: 'email', sortable: true, filter: true, resizable: true },
    // { headerName: 'Alternate Email', field: 'alternateEmail', sortable: true, filter: true, resizable: true },
    // { headerName: 'Alternate Email', field: 'alternateEmail', sortable: true, filter: true, resizable: true },
    // { headerName: 'phone', field: 'phone', sortable: true, filter: true, resizable: true },
    // { headerName: 'Alternate phone', field: 'alternatePhone', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Website', field: 'website', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value != null && !(new String(data.value).startsWith('http:')))
          return `<a href="${data.value}" target="_blank"> ${data.value}</a>`;
        else if (data.value != null && this.util.validateWebsiteURL(data.value))
          return `<a href="http://${data.value}" target="_blank"> ${data.value}</a>`;
        else
          return "";
      }
    },
    { headerName: 'street', field: 'street', sortable: true, filter: true, resizable: true },
    { headerName: 'city', field: 'city', sortable: true, filter: true, resizable: true },
    { headerName: 'state', field: 'state', sortable: true, filter: true, resizable: true },
    { headerName: 'country', field: 'country', sortable: true, filter: true, resizable: true },
    { headerName: 'pincode', field: 'pincode', sortable: true, filter: true, resizable: true },
    { headerName: 'files', field: 'files', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    },
    {
      headerName: 'Last Updated Date', field: 'lastupdatedatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    }
  ];


  ngOnInit() {
    this.loadNeeded();
    this.loadLeads();
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

          if (!this.role.leadManagementAdmin) {
            this._filters.owners = [this.lms.auth.getAgentDetails()]
          }
        }
      })
  }

  loadLeads() {
    this.loading = true;
    this.lms.searchLeads(this._filters).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.leads = resp['Leads'];
      }
    }, error => this.loading = false)
  }

  clearFilters() {
    this.router.navigate(['/lead-management/reports/leads']);
    this._filters = {
      companies: [],
      owners: [],
      products: [],
      industryTypes: [],
      categories: [],
      leadSources: [],
      status: [],
      title: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      activeStatus: '',
      leadDateFrom: null,
      leadDateTo: null,
      leadDateObject: null,
      lastUpdatedDateFrom: null,
      lastUpdatedDateTo: null,
      lastUpdatedDateObject: null
    }

    if (!this.role.leadManagementAdmin) {
      this._filters.owners = [this.lms.auth.getAgentDetails()]
    }
  }

  onBtnExport() {
    var params = { fileName: 'Leads Export' };
    this.gridApi.exportDataAsCsv(params);
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

}
