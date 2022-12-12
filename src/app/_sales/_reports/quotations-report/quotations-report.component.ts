import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SalesService } from 'src/app/_services/sales.service';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';

@Component({
  selector: 'app-quotations-report',
  templateUrl: './quotations-report.component.html',
  styleUrls: ['./quotations-report.component.css']
})
export class QuotationsReportComponent implements OnInit {

  constructor(private currencyPipe: CurrencyPipe, private datePipe: DatePipe,
    private su: SalesUtilService, private ss: SalesService) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.quoteDateFrom = new Date(date);
    this._search_filters.quoteDateTo = new Date();
    this._search_filters.quoteDateObject = {
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
    this.loadDealQuotes();
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
      headerName: 'Quotation', field: 'quoteno', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Quotation';
        if (data.data.dealQuotation.quoteNo && data.data.dealQuotation.quoteNo != null && data.data.dealQuotation.quoteNo != '')
          str = data.data.dealQuotation.quoteNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/quotation" target="_blank"> ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Quote Date', width: 120, field: 'quotedate', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'mediumDate');
      }
    },
    {
      headerName: 'Institute', field: 'institutename', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        return `<a href="/institute/institute-detail?iid=${data.data.deal.institute.instituteId}" target="_blank"> ${data.value} </a>`;
      }
    },
    { headerName: 'Deal Type', field: 'dealtype', width: 100, sortable: true, filter: true, resizable: true },
    {
      headerName: 'Taxable Amount', field: 'taxableamount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'CGST', field: 'cgst', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'SGST', field: 'sgst', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'IGST', field: 'igst', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Total Tax', field: 'totaltax', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Total Amount', field: 'totalamount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Valid Until', width: 120, field: 'validuntil', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'mediumDate');
      }
    },
    { headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true },
    { headerName: 'Id', field: 'deal.id', hide: true },
    { headerName: 'File', field: 'filename', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Purchase Order', field: 'purchaseorderno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Purchase Order';
        if (data.data.deal.purchaseOrderNo && data.data.deal.purchaseOrderNo != null && data.data.deal.purchaseOrderNo != '')
          str = data.data.deal.purchaseOrderNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/purchaseorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Sales Order', field: 'salesorderno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Sales Order';
        if (data.data.deal.salesOrderNo && data.data.deal.salesOrderNo != null && data.data.deal.salesOrderNo != '')
          str = data.data.deal.salesOrderNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/salesorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Proforma Invoice', field: 'proformainvoiceno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Invoice';
        if (data.data.deal.proformaInvoiceNo && data.data.deal.proformaInvoiceNo != null && data.data.deal.proformaInvoiceNo != '')
          str = data.data.deal.proformaInvoiceNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/proformainvoice" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Invoice', field: 'invoiceno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Invoice';
        if (data.data.deal.invoiceNo && data.data.deal.invoiceNo != null && data.data.deal.invoiceNo != '')
          str = data.data.deal.invoiceNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/invoice" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    { headerName: 'No Of Products', field: 'noofproducts', sortable: true, filter: true, resizable: true },
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

    quoteNo: '',
    quoteSubject: '',
    quoteDateObject: null,
    quoteDateFrom: null,
    quoteDateTo: null,
    quoteValidDateObject: null,
    quoteValidDateFrom: null,
    quoteValidDateTo: null,
    quoteStage: '',
  }

  loadDealQuotes() {
    this.loading = true;
    this.rowData = [];
    this.ss.loadDealQuotationsReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this._respsResp = new Array();
      this._respsResp = res['DealQuotations'];

      this._respsResp.filter(resp => resp.deal != null).forEach(resp => {

        let _rowdata: any = {};

        _rowdata.institutename = resp.deal.institute.instituteName;
        _rowdata.instituteid = resp.deal.institute.instituteId;
        _rowdata.dealtype = resp.deal.dealType;
        _rowdata.taxableamount = this.su.getGridTaxableAmount(resp.deal);
        _rowdata.cgst = this.su.getGridCGSTAmount(resp.deal);
        _rowdata.sgst = this.su.getGridSGSTAmount(resp.deal);
        _rowdata.igst = this.su.getGridIGSTAmount(resp.deal);
        _rowdata.totaltax = resp.deal.tax;
        _rowdata.totalamount = resp.deal.grandTotal;
        _rowdata.subject = resp.dealQuotation.subject;
        _rowdata.quoteno = resp.deal.quoteNo;
        _rowdata.quotedate = resp.dealQuotation.quoteDate;
        _rowdata.validuntil = resp.dealQuotation.validUntil;
        _rowdata.filename = resp.dealQuotation.filename;
        _rowdata.purchaseorderno = resp.deal.purchaseOrderNo;
        _rowdata.salesorderno = resp.deal.salesOrderNo;
        _rowdata.proformainvoiceno = resp.deal.proformaInvoiceNo;
        _rowdata.invoiceno = resp.deal.invoiceNo;
        _rowdata.noofproducts = resp.deal.noOfProducts;
        _rowdata.createddatetime = resp.dealQuotation.createddatetime;
        _rowdata.lastupdatedatetime = resp.dealQuotation.lastupdatedatetime;

        _rowdata.deal = resp.deal;
        _rowdata.dealQuotation = resp.dealQuotation;
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

      quoteNo: '',
      quoteSubject: '',
      quoteDateObject: null,
      quoteDateFrom: null,
      quoteDateTo: null,
      quoteValidDateObject: null,
      quoteValidDateFrom: null,
      quoteValidDateTo: null,
      quoteStage: '',
    }

    if (!this.role.salesAdmin)
      this._search_filters.agents = [this.ss.auth.getAgentDetails()];
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onBtnExport() {
    var params = { fileName: 'Sales Order Export' };
    this.gridApi.exportDataAsCsv(params);
  }
}
