import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { SalesService } from 'src/app/_services/sales.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { InvoiceService } from 'src/app/_services/invoice.service';

@Component({
  selector: 'app-invoices-report',
  templateUrl: './invoices-report.component.html',
  styleUrls: ['./invoices-report.component.css']
})
export class InvoicesReportComponent implements OnInit {

  constructor(private ss: SalesService, private invServ: InvoiceService, private currencyPipe: CurrencyPipe,
    private su: SalesUtilService, private datePipe: DatePipe) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

    this._search_filters.invoiceDateFrom = new Date(firstDay);
    this._search_filters.invoiceDateTo = new Date(lastDay);
    this._search_filters.invoiceDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(firstDay),
        endJsDate: new Date(lastDay)
      }
    };
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
  private gridColumnApi;

  _institutes = [];
  _products = [];
  _agents = [];
  _registered_status = 'All'

  _search_filters = {
    dealProducts: [],
    institutes: [],
    agents: [],
    dealType: '',

    invoiceNo: '',
    invoiceSubject: '',
    invoiceDueDateObject: null,
    invoiceDueDateFrom: null,
    invoiceDueDateTo: null,
    invoiceDateObject: null,
    invoiceDateFrom: null,
    invoiceDateTo: null,
    invoiceStatus: '',
    gstMonth: '',
    gstYear: ''
  }

  invoices: Array<any> = [];

  ngOnInit() {
    this.loadNeededDetails();
    this.loadInvoices();
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'agents']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
      this._products = res['Products'];
      this._agents = res['Agents']
    })
  }

  loading = false;
  totalAmount = 0.00;
  totalRegisteredAmount = 0.00;

  showFilterScreen = true
  showInvFilterScreen = true;

  rowData = [];

  columnDefs = [
    {
      headerName: 'Invoice', field: 'invoiceno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'InvoiceNo not found.';
        if (data.data.deal.invoiceNo && data.data.deal.invoiceNo != null && data.data.deal.invoiceNo != '')
          str = data.data.deal.invoiceNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/invoice" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Invoice Date', field: 'invoicedate', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'Institute', field: 'institutename', width: 250, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        return `<a href="/institute/institute-detail?iid=${data.data.institute.instituteId}" target="_blank"> ${data.value} </a>`;
      }
    },
    {
      headerName: 'GSTIN', field: 'gstno', width: 150, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value != null && data.value != '')
          return `<span class='text-primary'> ${data.value} </span>`;
        else
          return 'Unregistered';
      }
    },
    { headerName: 'Deal Type', field: 'dealtype', width: 120, sortable: true, filter: true, resizable: true },
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
    { headerName: 'GST Month', field: 'gstMonth', sortable: true, width: 150, filter: true, resizable: true },
    { headerName: 'GST Year', field: 'gstYear', sortable: true, width: 120, filter: true, resizable: true },
    { headerName: 'File', field: 'filename', sortable: true, filter: true, resizable: true },
    { headerName: 'No Of Products', field: 'noofproducts', width: 150, sortable: true, filter: true, resizable: true },
    { headerName: 'Id', field: 'deal.id', hide: true },
    {
      headerName: 'Quotation', field: 'quoteno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Quotation not found';
        if (data.data.deal.quoteNo && data.data.deal.quoteNo != null && data.data.deal.quoteNo != '')
          str = data.data.deal.quoteNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/quotation" target="_blank"> ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Purchase Order', field: 'purchaseorderno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Purchase Order not found';
        if (data.data.deal.purchaseOrderNo && data.data.deal.purchaseOrderNo != null && data.data.deal.purchaseOrderNo != '')
          str = data.data.deal.purchaseOrderNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/purchaseorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Sales Order', field: 'salesorderno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Sales Order not found';
        if (data.data.deal.salesOrderNo && data.data.deal.salesOrderNo != null && data.data.deal.salesOrderNo != '')
          str = data.data.deal.salesOrderNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/salesorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Proforma Invoice', field: 'proformainvoiceno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Proforma Invoice not found';
        if (data.data.deal.proformaInvoiceNo && data.data.deal.proformaInvoiceNo != null && data.data.deal.proformaInvoiceNo != '')
          str = data.data.deal.proformaInvoiceNo;

        return `<a href="/sales/deals/overview/${data.data.deal.id}/proformainvoice" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
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

  loadInvoices() {
    this.loading = true;
    this.invServ.loadInvoicesReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this.invoices = res['DealInvoices'];

      this.prepareGridData();

    }, error => { this.loading = false; })
  }

  prepareGridData() {
    this.rowData = [];
    this.invoices
      .filter(invs => invs.deal != null && invs.dealInvoice != null)
      .filter(invs => {
        console.log(invs.deal.institute.gstno);
        if (this._registered_status == 'All')
          return true;
        else if (this._registered_status == 'Registered Only') {
          if (invs.deal.institute.gstno != null && invs.deal.institute.gstno != '') {
            return true;
          } else {
            return false;
          }
        } else if (this._registered_status == 'Unregistered Only') {
          if (invs.deal.institute.gstno == null || invs.deal.institute.gstno == '') {
            return true;
          } else {
            return false;
          }
        }
      })
      .forEach(invs => {
        console.log(invs.deal.institute.gstno);
        let _rowdata: any = {};

        _rowdata.institutename = invs.deal.institute.instituteName;
        _rowdata.instituteid = invs.deal.institute.instituteId;
        _rowdata.institute = invs.deal.institute;
        _rowdata.gstno = invs.deal.institute.gstno;
        _rowdata.dealtype = invs.deal.dealType;
        _rowdata.taxableamount = this.su.getGridTaxableAmount(invs.deal);
        _rowdata.cgst = this.su.getGridCGSTAmount(invs.deal);
        _rowdata.sgst = this.su.getGridSGSTAmount(invs.deal);
        _rowdata.igst = this.su.getGridIGSTAmount(invs.deal);
        _rowdata.totaltax = invs.deal.tax;
        _rowdata.totalamount = invs.deal.grandTotal;
        _rowdata.invoiceno = invs.deal.invoiceNo;
        _rowdata.invoicedate = invs.dealInvoice.invoiceDate;
        _rowdata.filename = invs.dealInvoice.filename;
        _rowdata.gstMonth = invs.dealInvoice.gstMonth;
        _rowdata.gstYear = invs.dealInvoice.gstYear;
        _rowdata.noofproducts = invs.deal.noOfProducts;
        _rowdata.quotationno = invs.deal.quoteNo;
        _rowdata.purchaseorderno = invs.deal.purchaseOrderNo;
        _rowdata.salesorderno = invs.deal.salesOrderNo;
        _rowdata.proformainvoiceno = invs.deal.proformaInvoiceNo;
        _rowdata.createddatetime = invs.dealInvoice.createddatetime;
        _rowdata.lastupdatedatetime = invs.dealInvoice.lastupdatedatetime;

        _rowdata.deal = invs.deal;
        _rowdata.dealInvoice = invs.dealInvoice;

        this.rowData.push(_rowdata);
      });

    this.totalAmount = 0.00;
    this.totalRegisteredAmount = 0.00;
    this.invoices.filter(invs => invs.deal != null).forEach(invs => {
      this.totalAmount = this.totalAmount + invs.deal.tax;

      if (invs.deal.institute.gstno != null && invs.deal.institute.gstno != '')
        this.totalRegisteredAmount = this.totalRegisteredAmount + invs.deal.tax;
    })
  }

  registeredStatusChanged(event) {
    console.log(event);
    this.prepareGridData();
  }

  invoiceDateObjectChanged(event) {
    console.log(event);
  }

  clearFilters() {

    this._search_filters = {
      dealProducts: [],
      institutes: [],
      agents: [],
      dealType: '',

      invoiceNo: '',
      invoiceSubject: '',
      invoiceDueDateObject: null,
      invoiceDueDateFrom: null,
      invoiceDueDateTo: null,
      invoiceDateObject: null,
      invoiceDateFrom: null,
      invoiceDateTo: null,
      invoiceStatus: '',
      gstMonth: '',
      gstYear: ''
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onBtnExport() {
    var params = { fileName: 'Sales Order Export' };
    this.gridApi.exportDataAsCsv(params);
  }
}
