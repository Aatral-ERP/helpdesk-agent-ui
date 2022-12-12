import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { SalesService } from 'src/app/_services/sales.service';

@Component({
  selector: 'app-deals-delivery-challan-report',
  templateUrl: './deals-delivery-challan-report.component.html',
  styleUrls: ['./deals-delivery-challan-report.component.css']
})
export class DealsDeliveryChallanReportComponent implements OnInit {


  constructor(private currencyPipe: CurrencyPipe, private datePipe: DatePipe,
    private su: SalesUtilService, private ss: SalesService) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.dcDateFrom = new Date(date);
    this._search_filters.dcDateTo = new Date();
    this._search_filters.dcDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    if (!this.role.salesAdmin)
      this._search_filters.agents = [this.ss.auth.getAgentDetails()];

    console.log(this._search_filters);
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
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

  private gridApi;
  role: RoleMaster = this.ss.auth.getLoggedInRole();

  _institutes = [];
  _products = [];
  _agents = [];

  ngOnInit() {
    this.loadNeededDetails();
    this.loadDealDCs();
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'agents']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
      this._products = res['Products'];
      this._agents = res['Agents']
    })
  }

  showFilterScreen = true
  showQuoteFilterScreen = true;
  loading = false;
  rowData = [];
  _respsResp = [];
  columnDefs = [
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/sales/deals/overview/${data.data.deal.id}/delivery-challan" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
      }
    },
    { headerName: 'Id', field: 'deliveryChallan.id', width: 60, sortable: true, filter: true, resizable: true },
    {
      headerName: 'Institute', field: 'institutename', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        return `<a href="/institute/institute-detail?iid=${data.data.deal.institute.instituteId}" target="_blank"> ${data.value} </a>`;
      }
    }, { headerName: 'Id', field: 'deal.id', hide: true },
    {
      headerName: 'Invoice', field: 'invoiceno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = '--no-invoice--';
        if (data.data.deliveryChallan.invoiceNo && data.data.deliveryChallan.invoiceNo != null && data.data.deliveryChallan.invoiceNo != '')
          str = data.data.deliveryChallan.invoiceNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/invoice" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Quote No', field: 'quoteNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Quotation';
        if (data.data.deal.quoteNo && data.data.deliveryChallan.quoteNo != null && data.data.deliveryChallan.quoteNo != '')
          str = data.data.deal.quoteNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/quotation" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'PO No', field: 'purchaseOrderNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate PO';
        if (data.data.deal.purchaseOrderNo && data.data.deal.purchaseOrderNo != null && data.data.deal.purchaseOrderNo != '')
          str = data.data.deal.purchaseOrderNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/purchaseorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    },
    {
      headerName: 'Last Modified Date', field: 'lastupdatedatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium');
      }
    }
  ];

  _search_filters = {
    dealProducts: [],
    institutes: [],
    agents: [],
    dealType: '',

    dcDateObject: null,
    dcDateFrom: null,
    dcDateTo: null
  }

  loadDealDCs() {
    this.loading = true;
    this.rowData = [];
    this.ss.loadDealDeliveryChallansReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this._respsResp = new Array();
      this._respsResp = res['DealDeliveryChallans'];

      this._respsResp.filter(resp => resp.deal != null).forEach(resp => {

        let _rowdata: any = {};

        _rowdata.institutename = resp.deal.institute.instituteName;
        _rowdata.instituteid = resp.deal.institute.instituteId;
        _rowdata.invoiceno = resp.deliveryChallan.invoiceNo;
        _rowdata.filename = resp.deliveryChallan.filename;
        _rowdata.purchaseOrderNo = resp.deal.purchaseOrderNo;
        _rowdata.quoteno = resp.deal.quoteNo;
        _rowdata.purchaseorderno = resp.deal.purchaseOrderNo;
        _rowdata.salesorderno = resp.deal.salesOrderNo;
        _rowdata.proformainvoiceno = resp.deal.proformaInvoiceNo;
        _rowdata.createddatetime = resp.deliveryChallan.createddatetime;
        _rowdata.lastupdatedatetime = resp.deliveryChallan.lastupdatedatetime;

        _rowdata.deal = resp.deal;
        _rowdata.deliveryChallan = resp.deliveryChallan;
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

      dcDateObject: null,
      dcDateFrom: null,
      dcDateTo: null
    }

    if (!this.role.salesAdmin)
      this._search_filters.agents = [this.ss.auth.getAgentDetails()];
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onBtnExport() {
    var params = { fileName: 'Delivery Challan Export' };
    this.gridApi.exportDataAsCsv(params);
  }

}
