import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { SalesService } from 'src/app/_services/sales.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { environment } from 'src/environments/environment';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';

@Component({
  selector: 'app-invoices-report',
  templateUrl: './invoices-report.component.html',
  styleUrls: ['./invoices-report.component.css']
})
export class InvoicesReportComponent implements OnInit {

  constructor(private ss: SalesService, private invServ: InvoiceService,
    private currencyPipe: CurrencyPipe,
    private su: SalesUtilService, private datePipe: DatePipe) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.invoiceDateFrom = new Date(date);
    this._search_filters.invoiceDateTo = new Date();
    this._search_filters.invoiceDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

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
    poNo: '',
    soNo: '',
    invoiceSubject: '',
    invoiceDueDateObject: null,
    invoiceDueDateFrom: null,
    invoiceDueDateTo: null,
    invoiceDateObject: null,
    invoiceDateFrom: null,
    invoiceDateTo: null,
    invoiceStatus: '',
    gstMonth: '',
    gstYear: '',
    paidStatus: ''
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
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/sales/invoices/create?edit=1&invid=${data.data.id}" target="_blank"> <i class='fas fa-edit'></i> </a>`;
      }
    },
    {
      headerName: 'Invoice', field: 'invoiceno', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'InvoiceNo not found.';
        if (data.value && data.value != null && data.value != '')
          str = data.value;

        return `<a href="/sales/invoices/overview/${data.data.id}" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
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
      headerName: 'Paid Amount', field: 'paidAmount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        // return this.currencyPipe.transform(data.value, 'INR');
        if (data.value == 0)
          return `<span class='text-danger'>${this.currencyPipe.transform(data.value, 'INR')}</span>`;
        else if (data.value > 0 && data.value < data.data.totalamount)
          return `<span class='text-info'>${this.currencyPipe.transform(data.value, 'INR')}</span>`;
        else if (data.value >= data.data.totalamount)
          return `<span class='text-success'>${this.currencyPipe.transform(data.value, 'INR')}</span>`;
        else
          return `<span class='text-dark'>${this.currencyPipe.transform(data.value, 'INR')}</span>`;
      }
    },
    { headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true },
    { headerName: 'GST Month', field: 'gstMonth', sortable: true, width: 150, filter: true, resizable: true },
    { headerName: 'GST Year', field: 'gstYear', sortable: true, width: 120, filter: true, resizable: true },
    {
      headerName: 'Inv. File', field: 'filename', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Invoice';
        if (data.value && data.value != null && data.value != '') {
          str = data.value;
          if (str.toLowerCase().endsWith(".pdf"))
            return `<a href="${environment.apiUrl}download/download-invoice-pdf/view/${data.data.id}/${data.value}" target="_blank">  ${str} `;
          else
            return `<a href="${environment.apiUrl}download/download-invoice-pdf/download/${data.data.id}/${data.value}" target="_blank">  ${str} `;
        } else {
          return `<a href="/sales/invoices/overview/${data.data.id}" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
        }
      }
    },
    {
      headerName: 'Satisfactory Certificate', field: 'satisfactoryCertificate', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Upload Satisfactory Certificate';
        if (data.value && data.value != null && data.value != '') {
          str = data.value;
          if (str.toLowerCase().endsWith(".pdf"))
            return `<a href="${environment.apiUrl}download/download-invoice-pdf/view/${data.data.id}/${data.value}" target="_blank">  ${str} `;
          else
            return `<a href="${environment.apiUrl}download/download-invoice-pdf/download/${data.data.id}/${data.value}" target="_blank">  ${str} `;
        } else {
          return `<a href="/sales/invoices/overview/${data.data.id}" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
        }
      }
    },
    {
      headerName: 'Work Completion', field: 'workCompletionCertificate', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Upload Work Completion';
        if (data.value && data.value != null && data.value != '') {
          str = data.value;
          if (str.toLowerCase().endsWith(".pdf"))
            return `<a href="${environment.apiUrl}download/download-invoice-pdf/view/${data.data.id}/${data.value}" target="_blank">  ${str} `;
          else
            return `<a href="${environment.apiUrl}download/download-invoice-pdf/download/${data.data.id}/${data.value}" target="_blank">  ${str} `;
        } else {
          return `<a href="/sales/invoices/overview/${data.data.id}" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
        }
      }
    },
    {
      headerName: 'Delivery Challan', field: 'dcfilename', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Delivery Challan';
        if (data.value && data.value != null && data.value != '') {
          str = data.value;
          if (str.toLowerCase().endsWith(".pdf"))
            return `<a href="${environment.apiUrl}download/download-delivery-challan-pdf/view/${data.data.id}/${data.value}" target="_blank">  ${str} `;
          else
            return `<a href="${environment.apiUrl}download/download-delivery-challan-pdf/download/${data.data.id}/${data.value}" target="_blank">  ${str} `;
        } else {
          return `<a href="/sales/invoices/overview/${data.data.id}" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
        }
      }
    },
    { headerName: 'No Of Products', field: 'noofproducts', width: 150, sortable: true, filter: true, resizable: true },
    { headerName: 'Id', field: 'id', hide: true },
    {
      headerName: 'Purchase Order', field: 'purchaseorderno', sortable: true, filter: true, resizable: true
    },
    {
      headerName: 'Sales Order', field: 'salesorderno', sortable: true, filter: true, resizable: true
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
      .filter(invs => {
        console.log(invs.institute.gstno);
        if (this._registered_status == 'All')
          return true;
        else if (this._registered_status == 'Registered Only') {
          if (invs.institute.gstno != null && invs.institute.gstno != '') {
            return true;
          } else {
            return false;
          }
        } else if (this._registered_status == 'Unregistered Only') {
          if (invs.institute.gstno == null || invs.institute.gstno == '') {
            return true;
          } else {
            return false;
          }
        }
      })
      .forEach(invs => {
        console.log(invs.institute.gstno);
        let _rowdata: any = {};

        _rowdata.id = invs.id;
        _rowdata.institutename = invs.institute.instituteName;
        _rowdata.instituteid = invs.institute.instituteId;
        _rowdata.institute = invs.institute;
        _rowdata.gstno = invs.institute.gstno;
        _rowdata.dealtype = invs.dealType;
        _rowdata.taxableamount = this.su.getGridTaxableAmount(invs);
        _rowdata.cgst = this.su.getGridCGSTAmount(invs);
        _rowdata.sgst = this.su.getGridSGSTAmount(invs);
        _rowdata.igst = this.su.getGridIGSTAmount(invs);
        _rowdata.totaltax = invs.tax;
        _rowdata.totalamount = invs.grandTotal;
        _rowdata.paidAmount = invs.paidAmount;
        _rowdata.subject = invs.subject;
        _rowdata.invoiceno = invs.invoiceNo;
        _rowdata.invoicedate = invs.invoiceDate;
        _rowdata.filename = invs.filename;
        _rowdata.satisfactoryCertificate = invs.satisfactoryCertificate;
        _rowdata.workCompletionCertificate = invs.workCompletionCertificate;
        _rowdata.dcfilename = invs.dcfilename;

        _rowdata.gstMonth = invs.gstMonth;
        _rowdata.gstYear = invs.gstYear;
        _rowdata.noofproducts = invs.noOfProducts;
        _rowdata.quotationno = invs.quoteNo;
        _rowdata.purchaseorderno = invs.purchaseOrderNo;
        _rowdata.salesorderno = invs.salesOrderNo;
        _rowdata.proformainvoiceno = invs.proformaInvoiceNo;
        _rowdata.createddatetime = invs.createddatetime;
        _rowdata.lastupdatedatetime = invs.lastupdatedatetime;

        _rowdata.dealInvoice = invs;

        this.rowData.push(_rowdata);
      });

    this.totalAmount = 0.00;
    this.totalRegisteredAmount = 0.00;
    this.invoices.forEach(invs => {
      this.totalAmount = this.totalAmount + invs.tax;

      if (invs.institute.gstno != null && invs.institute.gstno != '')
        this.totalRegisteredAmount = this.totalRegisteredAmount + invs.tax;
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
      poNo: '',
      soNo: '',
      invoiceSubject: '',
      invoiceDueDateObject: null,
      invoiceDueDateFrom: null,
      invoiceDueDateTo: null,
      invoiceDateObject: null,
      invoiceDateFrom: null,
      invoiceDateTo: null,
      invoiceStatus: '',
      gstMonth: '',
      gstYear: '',
      paidStatus: ''
    }

    if (!this.role.salesAdmin)
      this._search_filters.agents = [this.ss.auth.getAgentDetails()];
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
