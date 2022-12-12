import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';

@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./payments-report.component.css']
})
export class PaymentsReportComponent implements OnInit {

  constructor(private currencyPipe: CurrencyPipe, private datePipe: DatePipe,
    private su: SalesUtilService, private ss: SalesService, private invServ: InvoiceService) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.paymentDateFrom = new Date(date);
    this._search_filters.paymentDateTo = new Date();
    this._search_filters.paymentDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    console.log(this._search_filters);

    if (!this.role.salesAdmin)
      this._search_filters.agents = [this.ss.auth.getAgentDetails()];

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

  private gridApi;
  _institutes = [];
  _products = [];
  _agents = [];

  ngOnInit() {
    this.loadNeededDetails();
    this.loadPayments();
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
  showPayFilterScreen = true;
  loading = false;
  rowData = [];
  _respsResp = [];
  columnDefs = [
    {
      headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return `<a href="/sales/invoices/overview/${data.data.dealInvoice.id}/payments?expand=${data.data.dealPayments.id}" target="_blank"> ${data.value}`;
      }
    },
    {
      headerName: 'Invoice', field: 'invoiceno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'InvoiceNo not found.';
        if (data.data.dealInvoice.invoiceNo && data.data.dealInvoice.invoiceNo != null && data.data.dealInvoice.invoiceNo != '')
          str = data.data.dealInvoice.invoiceNo;

        return `<a href="/sales/invoices/overview/${data.data.dealInvoice.id}" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
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
    {
      headerName: 'Paid Amount', field: 'paidamount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    }, {
      headerName: 'Paid Tax', field: 'paidtax', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    }, {
      headerName: 'Paid Total', field: 'paidtotal', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Payment Date', width: 120, field: 'paymentdate', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'mediumDate');
      }
    },
    { headerName: 'Pay Mode', field: 'paymode', width: 120, sortable: true, filter: true, resizable: true },
    { headerName: 'Drawn on', field: 'drawnon', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Reference no', field: 'referenceno', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'File', field: 'receiptfilename', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Purchase Order', field: 'purchaseorderno', sortable: true, filter: true, resizable: true },
    { headerName: 'Sales Order', field: 'salesorderno', sortable: true, filter: true, resizable: true },
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

    paymentReferenceNo: '',
    paymentReceiptNo: '',
    paymentSubject: '',
    paymentMode: '',
    paymentDateFrom: null,
    paymentDateTo: null,
    paymentDateObject: null,
    paymentDrawnOn: '',
    paymentAmount: ''
  }

  loadPayments() {
    this.loading = true;
    this.rowData = [];
    this.invServ.loadPaymentsReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this._respsResp = new Array();
      this._respsResp = res['DealPayments'];

      this._respsResp.filter(resp => resp.dealInvoice != null).forEach(resp => {

        let _rowdata: any = {};

        _rowdata.paymentid = resp.dealPayments.id;
        _rowdata.dealInvoiceId = resp.dealInvoice.id;
        _rowdata.subject = resp.dealPayments.subject;
        _rowdata.institute = resp.dealInvoice.institute;
        _rowdata.institutename = resp.dealInvoice.institute.instituteName;
        _rowdata.dealtype = resp.dealInvoice.dealType;
        _rowdata.taxableamount = this.su.getGridTaxableAmount(resp.dealInvoice);
        _rowdata.cgst = this.su.getGridCGSTAmount(resp.dealInvoice);
        _rowdata.sgst = this.su.getGridSGSTAmount(resp.dealInvoice);
        _rowdata.igst = this.su.getGridIGSTAmount(resp.dealInvoice);
        _rowdata.totaltax = resp.dealInvoice.tax;
        _rowdata.totalamount = resp.dealInvoice.grandTotal;

        _rowdata.paidamount = resp.dealPayments.amount;
        _rowdata.paidtax = resp.dealPayments.gstAmount;
        _rowdata.paidtotal = resp.dealPayments.totalAmount;
        _rowdata.paymentdate = resp.dealPayments.paymentDate;
        _rowdata.paymode = resp.dealPayments.mode;
        _rowdata.drawnon = resp.dealPayments.drawnon;
        _rowdata.referenceno = resp.dealPayments.referenceno;
        _rowdata.receiptfilename = resp.dealPayments.receiptfilename;

        _rowdata.purchaseorderno = resp.dealInvoice.purchaseOrderNo;
        _rowdata.salesorderno = resp.dealInvoice.salesOrderNo;
        _rowdata.invoiceno = resp.dealInvoice.invoiceNo;
        _rowdata.noofproducts = resp.dealInvoice.noOfProducts;
        _rowdata.createddatetime = resp.dealPayments.createddatetime;
        _rowdata.lastupdatedatetime = resp.dealPayments.lastupdatedatetime;

        _rowdata.dealInvoice = resp.dealInvoice;
        _rowdata.dealPayments = resp.dealPayments;

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

      paymentReferenceNo: '',
      paymentReceiptNo: '',
      paymentSubject: '',
      paymentMode: '',
      paymentDateFrom: null,
      paymentDateTo: null,
      paymentDateObject: null,
      paymentDrawnOn: '',
      paymentAmount: ''
    }

    if (!this.role.salesAdmin)
      this._search_filters.agents = [this.ss.auth.getAgentDetails()];
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onBtnExport() {
    var params = { fileName: 'Payments Export' };
    this.gridApi.exportDataAsCsv(params);
  }

}
