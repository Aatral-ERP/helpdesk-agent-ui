import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';

@Component({
  selector: 'app-project-implementations-reports',
  templateUrl: './project-implementations-reports.component.html',
  styleUrls: ['./project-implementations-reports.component.css']
})
export class ProjectImplementationsReportsComponent implements OnInit {

  constructor(private currencyPipe: CurrencyPipe, private datePipe: DatePipe,
    private su: SalesUtilService, private ss: SalesService) { }

  private gridApi;

  _institutes = [];
  _products = [];
  _agents = [];

  fromDate;
  toDate;

  customDate = false;

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

  showFilterScreen = true;
  showPIMFilterScreen = false;
  loading = false;
  rowData = [];
  _respsResp = [];
  columnDefs = [
    {
      headerName: '', field: 'projectImplementation.id', width: 40, cellRenderer: (data) => {
        return `<a href="/sales/deals/overview/${data.data.deal.id}/projectimplementation" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
      }
    },
    {
      headerName: 'Purchase Order', field: 'deal.purchaseOrderNo', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = '';
        console.log(data);
        if (data.data.deal.purchaseOrderNo && data.data.deal.purchaseOrderNo != null && data.data.deal.purchaseOrderNo != '')
          str = data.data.deal.purchaseOrderNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/purchaseorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Institute', field: 'deal.institute.instituteName', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        return `<a href="/institute/institute-detail?iid=${data.data.deal.institute.instituteId}" target="_blank"> ${data.value} </a>`;
      }
    },
    { headerName: 'Deal Type', field: 'deal.dealType', width: 100, sortable: true, filter: true, resizable: true },
    { headerName: 'Id', field: 'deal.id', hide: true },
    {
      headerName: 'Status', field: 'projectImplementation.status', width: 100, sortable: true, filter: true, resizable: true
    },
    {
      headerName: 'Started', field: 'projectImplementation.createddatetime', width: 100, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value != null)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    {
      headerName: 'Manufacturing', field: 'projectImplementation.manufacturingApprovedBy', width: 100, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value != null)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    {
      headerName: 'Delivery', field: 'projectImplementation.deliveryApprovedBy', width: 100, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value != null)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    {
      headerName: 'Installation', field: 'projectImplementation.installedApprovedBy', width: 100, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value != null)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    {
      headerName: 'Completed', field: 'projectImplementation.workCompletionBy', width: 100, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value != null)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    { headerName: 'Manufacturing Agent', field: 'projectImplementation.manufacturingAgent', width: 100, sortable: true, filter: true, resizable: true },
    { headerName: 'Delivery Agent', field: 'projectImplementation.deliveryAgent', width: 100, sortable: true, filter: true, resizable: true },
    { headerName: 'Installation Agent', field: 'projectImplementation.installedAgent', width: 100, sortable: true, filter: true, resizable: true },
    { headerName: 'No Of Products', field: 'deal.noOfProducts', width: 100, sortable: true, filter: true, resizable: true },
    {
      headerName: 'Created Date', field: 'projectImplementation.createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    },
    {
      headerName: 'Last Modified Date', field: 'projectImplementation.lastupdatedatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    }
  ];

  _search_filters = {
    dealProducts: [],
    institutes: [],
    agents: [],
    dealType: '',
    projectImplementationStatus: '',
    manufacturingAgents: [],
    deliveryAgents: [],
    installationAgents: [],
    date: '0',
    fromDate: null,
    toDate: null,
  }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _ProductsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    itemsShowLimit: 10,
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
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };

  public defMonth: IMyDefaultMonth = {
    defMonth: ''
  };

  ngOnInit(): void {
    this.loadNeededDetails();
    this.loadProjectImplementations();
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'agents']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
      this._products = res['Products'];
      this._agents = res['Agents']
    })
  }

  loadProjectImplementations() {

    this.loading = true;
    this.rowData = [];
    this.ss.loadDealProjectImplementationsReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this._respsResp = new Array();
      this._respsResp = res['DealProjectImplementations'];

      this._respsResp
        .filter(resp => resp.deal != null)
        .forEach(resp => {

          let _rowdata: any = {};

          _rowdata.projectImplementation = resp.projectImplementation;
          _rowdata.deal = resp.deal;

          this.rowData.push(_rowdata);
        })
    }, error => { this.loading = false; });

  }

  clearFilters() {
    this._search_filters = {
      dealProducts: [],
      institutes: [],
      agents: [],
      dealType: '',
      projectImplementationStatus: '',
      manufacturingAgents: [],
      deliveryAgents: [],
      installationAgents: [],
      date: '',
      fromDate: this.getFromDate(this.fromDate),
      toDate: this.getToDate(this.toDate),

    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onBtnExport() {
    var params = { fileName: 'Sales Order Export' };
    this.gridApi.exportDataAsCsv(params);
  }

}
