import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AgentService } from 'src/app/_services/agent.service';
import { NeededService } from 'src/app/_services/needed.service';
import { RawMaterialRequest } from '../request-raw-materials/RawMaterialRequest';

@Component({
  selector: 'app-fabrication-report',
  templateUrl: './fabrication-report.component.html',
  styleUrls: ['./fabrication-report.component.css']
})
export class FabricationReportComponent implements OnInit {

  constructor(private ns: NeededService, private as: AgentService, private datePipe: DatePipe) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.requestDateFrom = new Date(date);
    this._search_filters.requestDateTo = new Date();
    this._search_filters.requestDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    console.log(this._search_filters);
  }

  rawMaterialRequests: Array<RawMaterialRequest> = [];

  loading = false;
  showFilterScreen = true;

  _products = [];
  _agents = [];

  _search_filters = {

    subject: '',
    products: [],
    requestBy: [],
    requestTo: [],

    requestDateObject: null,
    requestDateFrom: null,
    requestDateTo: null,

    approvedDateObject: null,
    approvedDateFrom: null,
    approvedDateTo: null,

    status: ''
  }

  columnDefs = [
    { headerName: '', field: 'id', width: 40, sortable: true, filter: true, resizable: true },
    { headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Product', field: 'productName', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Request By', field: 'requestBy', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Request To', field: 'requestTo', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Request Date', field: 'requestDate', width: 100, sortable: true, filter: true, resizable: true,
      tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'Approved Date', field: 'approvedDate', width: 100, sortable: true, filter: true, resizable: true,
      tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    { headerName: 'Status', field: 'status', width: 100, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Remarks', field: 'remarks', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Approve/Reject Remarks', field: 'approveRejectRemarks', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } }, { headerName: 'Product', field: 'productName', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy hh:mm a');
      }
    },
    {
      headerName: 'Last Updated Date', field: 'lastupdatedatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy hh:mm a');
      }
    }
  ];

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

  _ProductsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    itemsShowLimit: 2,
    allowSearchFilter: true,
    closeDropDownOnSelection: false
  };

  _AgentsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'emailId',
    textField: 'firstName',
    itemsShowLimit: 2,
    allowSearchFilter: true,
    closeDropDownOnSelection: false
  };

  ngOnInit() {
    this.loadNeeded();
  }

  loadNeeded() {
    this.ns.loadNeeded(['agents_min', 'products_min']).subscribe(resp => {
      this._products = resp['products_min'];
      this._agents = resp['agents_min'];
    })
  }

  clearFilters() {
    this._search_filters = {
      subject: '',
      products: [],
      requestBy: [],
      requestTo: [],

      requestDateObject: null,
      requestDateFrom: null,
      requestDateTo: null,

      approvedDateObject: null,
      approvedDateFrom: null,
      approvedDateTo: null,

      status: ''
    }
  }

  loadFabricationReport() {
    this.loading = true;
    this.as.loadFabricationReport(this._search_filters).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.loading = false;
        this.rawMaterialRequests = resp['RawMaterialRequests'];
      }
    }, error => this.loading = false);
  }


}
