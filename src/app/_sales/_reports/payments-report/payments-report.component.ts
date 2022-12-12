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
    private su: SalesUtilService, private ss: SalesService) {
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
        return `<a href="/sales/deals/overview/${data.data.deal.id}/payments?expand=${data.data.payment.id}" target="_blank"> ${data.value}`;
      }
    },
    {
      headerName: 'Invoice', field: 'invoiceno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'InvoiceNo not found.';
        if (data.data.deal.invoiceNo && data.data.deal.invoiceNo != null && data.data.deal.invoiceNo != '')
          str = data.data.deal.invoiceNo;

        return `<a href="/sales/invoices/overview/${data.data.deal.id}" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Institute', field: 'institutename', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        return `<a href="/institute/institute-detail?iid=${data.data.institute.instituteId}" target="_blank"> ${data.value} </a>`;
      }
    },
    { headerName: 'Deal Type', field: 'dealtype', width: 100, sortable: true, filter: true, resizable: true },
    // {
    //   headerName: 'Taxable Amount', field: 'taxableamount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
    //     return this.currencyPipe.transform(data.value, 'INR');
    //   }
    // },
    // {
    //   headerName: 'CGST', field: 'cgst', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
    //     return this.currencyPipe.transform(data.value, 'INR');
    //   }
    // },
    // {
    //   headerName: 'SGST', field: 'sgst', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
    //     return this.currencyPipe.transform(data.value, 'INR');
    //   }
    // },
    // {
    //   headerName: 'IGST', field: 'igst', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
    //     return this.currencyPipe.transform(data.value, 'INR');
    //   }
    // },
    // {
    //   headerName: 'Total Tax', field: 'totaltax', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
    //     return this.currencyPipe.transform(data.value, 'INR');
    //   }
    // },
    {
      headerName: 'Grand Total Amount', field: 'grandTotal', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    // {
    //   headerName: 'Paid Amount', field: 'paidamount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
    //     return this.currencyPipe.transform(data.value, 'INR');
    //   }
    // },
    //  {
    //   headerName: 'Paid Tax', field: 'paidtax', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
    //     return this.currencyPipe.transform(data.value, 'INR');
    //   }
    // },
    {
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
    this.ss.loadPaymentsReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this._respsResp = new Array();
      this._respsResp = res['DealPayments'];

      this._respsResp.filter(resp => resp.deal != null).forEach(resp => {

        let _rowdata: any = {};

        _rowdata.paymentid = resp.payment.id;
        _rowdata.dealId = resp.deal.id;
        _rowdata.subject = resp.payment.subject;
        _rowdata.institute = resp.deal.institute;
        _rowdata.institutename = resp.deal.institute.instituteName;
        _rowdata.dealtype = resp.deal.dealType;
        _rowdata.taxableamount = this.su.getGridTaxableAmount(resp.deal);
        _rowdata.cgst = this.su.getGridCGSTAmount(resp.deal);
        _rowdata.sgst = this.su.getGridSGSTAmount(resp.deal);
        _rowdata.igst = this.su.getGridIGSTAmount(resp.deal);
        _rowdata.totaltax = resp.deal.tax;
        _rowdata.grandTotal = resp.deal.grandTotal;

        _rowdata.paidamount = resp.payment.amount;
        _rowdata.paidtax = resp.payment.gstAmount;
        _rowdata.paidtotal = resp.payment.totalAmount;
        _rowdata.paymentdate = resp.payment.paymentDate;
        _rowdata.paymode = resp.payment.mode;
        _rowdata.drawnon = resp.payment.drawnon;
        _rowdata.referenceno = resp.payment.referenceno;
        _rowdata.receiptfilename = resp.payment.receiptfilename;

        _rowdata.purchaseorderno = resp.deal.purchaseOrderNo;
        _rowdata.salesorderno = resp.deal.salesOrderNo;
        _rowdata.invoiceno = resp.deal.invoiceNo;
        _rowdata.noofproducts = resp.deal.noOfProducts;
        _rowdata.createddatetime = resp.payment.createddatetime;
        _rowdata.lastupdatedatetime = resp.payment.lastupdatedatetime;

        _rowdata.deal = resp.deal;
        _rowdata.payment = resp.payment;

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
