import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SalesService } from 'src/app/_services/sales.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';

@Component({
  selector: 'app-sales-orders-report',
  templateUrl: './sales-orders-report.component.html',
  styleUrls: ['./sales-orders-report.component.css']
})
export class SalesOrdersReportComponent implements OnInit {

  constructor(private currencyPipe: CurrencyPipe, private datePipe: DatePipe,
    private su: SalesUtilService, private ss: SalesService) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.soDueDateFrom = new Date(date);
    this._search_filters.soDueDateTo = new Date();
    this._search_filters.soDueDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    if (!this.role.salesAdmin)
      this._search_filters.agents = [this.ss.auth.getAgentDetails()];

    console.log(this._search_filters);

  }

  role: RoleMaster = this.ss.auth.getLoggedInRole();

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

  _institutes = [];
  _products = [];
  _agents = [];

  ngOnInit() {
    this.loadNeededDetails();
    this.loadDealSalesOrders();
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'agents']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
      this._products = res['Products'];
      this._agents = res['Agents']
    })
  }

  private gridApi;
  showFilterScreen = true
  showSOFilterScreen = true;
  loading = false;
  rowData = [];
  _respsResp = [];
  columnDefs = [{
    headerName: 'Sales Order', field: 'salesorderno', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      let str = 'Generate Sales Order';
      if (data.data.deal.salesOrderNo && data.data.deal.salesOrderNo != null && data.data.deal.salesOrderNo != '')
        str = data.data.deal.salesOrderNo;

      return `<a href="/sales/deals/overview/${data.data.deal.id}/salesorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
    }
  },
  {
    headerName: 'Institute', field: 'institutename', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
      return `<a href="/institute/institute-detail?iid=${data.data.institute.instituteId}" target="_blank"> ${data.value} </a>`;
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
  { headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true },
  { headerName: 'Id', field: 'deal.id', hide: true },
  {
    headerName: 'Due Date', width: 120, field: 'duedate', sortable: true, resizable: true, cellRenderer: (data) => {
      return this.datePipe.transform(data.value, 'mediumDate');
    }
  },
  { headerName: 'File', field: 'salesOrder.filename', sortable: true, filter: true, resizable: true },
  {
    headerName: 'Quotation', field: 'quoteno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      let str = 'Generate Quotation';
      if (data.data.deal.quoteNo && data.data.deal.quoteNo != null && data.data.deal.quoteNo != '')
        str = data.data.deal.quoteNo;

      return `<a href="/sales/deals/overview/${data.data.deal.id}/quotation" target="_blank"> ${str} <i class='fas fa-link'></i> </a>`;
    }
  }, {
    headerName: 'Purchase Order', field: 'purchaseorderno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      let str = 'Purchase Order';
      if (data.data.deal.purchaseOrderNo && data.data.deal.purchaseOrderNo != null && data.data.deal.purchaseOrderNo != '')
        str = data.data.deal.purchaseOrderNo;

      return `<a href="/sales/deals/overview/${data.data.deal.id}/purchaseorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
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

    soNo: '',
    soSubject: '',
    soDueDateObject: null,
    soDueDateFrom: null,
    soDueDateTo: null,
    soStatus: '',

  }

  loadDealSalesOrders() {
    this.loading = true;
    this.rowData = [];
    this.ss.loadDealSalesOrdersReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this._respsResp = new Array();
      this._respsResp = res['DealSalesOrders'];

      this._respsResp.filter(resp => resp.deal != null).forEach(resp => {


        let _rowdata: any = {};

        _rowdata.institutename = resp.deal.institute.instituteName;
        _rowdata.instituteid = resp.deal.institute.instituteId;
        _rowdata.institute = resp.deal.institute;
        _rowdata.dealtype = resp.deal.dealType;
        _rowdata.taxableamount = this.su.getGridTaxableAmount(resp.deal);
        _rowdata.cgst = this.su.getGridCGSTAmount(resp.deal);
        _rowdata.sgst = this.su.getGridSGSTAmount(resp.deal);
        _rowdata.igst = this.su.getGridIGSTAmount(resp.deal);
        _rowdata.totaltax = resp.deal.tax;
        _rowdata.totalamount = resp.deal.grandTotal;
        _rowdata.subject = resp.salesOrder.subject;
        _rowdata.duedate = resp.salesOrder.dueDate;
        _rowdata.filename = resp.salesOrder.filename;
        _rowdata.quoteno = resp.deal.quoteNo;
        _rowdata.purchaseorderno = resp.deal.purchaseOrderNo;
        _rowdata.salesorderno = resp.deal.salesOrderNo;
        _rowdata.proformainvoiceno = resp.deal.proformaInvoiceNo;
        _rowdata.invoiceno = resp.deal.invoiceNo;
        _rowdata.noofproducts = resp.deal.noOfProducts;
        _rowdata.createddatetime = resp.salesOrder.createddatetime;
        _rowdata.lastupdatedatetime = resp.salesOrder.lastupdatedatetime;

        _rowdata.deal = resp.deal;
        _rowdata.salesOrder = resp.salesOrder;
        this.rowData.push(_rowdata);


        // let _rowData: any = {};
        // _rowData.deal = resp.deal;
        // _rowData.salesOrder = resp.salesOrder;
        // this.rowData.push(_rowData);
      })
    }, error => { this.loading = false; });
  }

  clearFilters() {
    this._search_filters = {
      dealProducts: [],
      institutes: [],
      agents: [],
      dealType: '',

      soNo: '',
      soSubject: '',
      soDueDateObject: null,
      soDueDateFrom: null,
      soDueDateTo: null,
      soStatus: '',

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
