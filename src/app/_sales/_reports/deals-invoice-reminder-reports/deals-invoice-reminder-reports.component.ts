import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';
import { SalesService } from 'src/app/_services/sales.service';

@Component({
  selector: 'app-deals-invoice-reminder-reports',
  templateUrl: './deals-invoice-reminder-reports.component.html',
  styleUrls: ['./deals-invoice-reminder-reports.component.css']
})
export class DealsInvoiceReminderReportsComponent implements OnInit {

  constructor(private datePipe: DatePipe, private ss: SalesService, private currencyPipe: CurrencyPipe) {
    let fromdate = new Date().setMonth(new Date().getMonth() - 1);
    let todate = new Date().setMonth(new Date().getMonth() + 1);

    this._filters.fromDate = new Date(fromdate);
    this._filters.toDate = new Date(todate);
    this._filters.dateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(fromdate),
        endJsDate: new Date(todate)
      }
    };
  }

  showFilterScreen = true;
  loading = false;

  role: RoleMaster = this.ss.auth.getLoggedInRole();

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _filters = {
    institutes: [],
    fromDate: null,
    toDate: null,
    createdFromDate: null,
    createdToDate: null,
    dealType: '',
    dateObject: null,
    createdDateObject: null
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  private gridApi;
  _reminders = [];
  _institutes = [];
  rowData = [];

  columnDefs = [
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/sales/deals/overview/${data.data.dealId}/invoice" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
      }
    },
    {
      headerName: 'Reminder Date', field: 'reminderDate', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    }, {
      headerName: 'Invoice No', field: 'remInvoiceNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.data.remInvoiceId && data.data.remInvoiceId != null && data.data.remInvoiceId != '') {
          return `<a href="/sales/invoices/overview/${data.data.remInvoiceId}" target="_blank"> ${data.value} <i class='fas fa-link'></i> </a>`;
        } else {
          return `<a href="/sales/deals/overview/${data.data.dealId}" target="_blank"> Generate Invoice <i class='fas fa-link'></i> </a>`;
        }
      }
    },
    { headerName: 'Institute', field: 'institute.instituteName', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Deal Type', field: 'dealType', width: 120, sortable: true, filter: true, resizable: true },
    {
      headerName: 'Total', field: 'grandTotal', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    { headerName: 'Id', field: 'id', hide: true },
    {
      headerName: 'Quotation', field: 'quoteNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Quotation';
        if (data.data.quoteNo && data.data.quoteNo != null && data.data.quoteNo != '')
          str = data.data.quoteNo;

        return `<a href="/sales/deals/overview/${data.data.dealId}/quotation" target="_blank"> ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Purchase Order', field: 'purchaseOrderNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Purchase Order';
        if (data.data.purchaseOrderNo && data.data.purchaseOrderNo != null && data.data.purchaseOrderNo != '')
          str = data.data.purchaseOrderNo;

        return `<a href="/sales/deals/overview/${data.data.dealId}/purchaseorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Sales Order', field: 'salesOrderNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Sales Order';
        if (data.data.salesOrderNo && data.data.salesOrderNo != null && data.data.salesOrderNo != '')
          str = data.data.salesOrderNo;

        return `<a href="/sales/deals/overview/${data.data.dealId}/salesorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Proforma Invoice', field: 'proformaInvoiceNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Invoice';
        if (data.data.proformaInvoiceNo && data.data.proformaInvoiceNo != null && data.data.proformaInvoiceNo != '')
          str = data.data.proformaInvoiceNo;

        return `<a href="/sales/deals/overview/${data.data.dealId}/proformainvoice" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Invoice', field: 'invoiceNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Invoice';
        if (data.data.invoiceNo && data.data.invoiceNo != null && data.data.invoiceNo != '')
          str = data.data.invoiceNo;

        return `<a href="/sales/deals/overview/${data.data.dealId}/invoice" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    { headerName: 'No Of Products', field: 'noOfProducts', width: 80, sortable: true, filter: true, resizable: true },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy hh:mm a');
      }
    }

  ];

  ngOnInit() {
    this.loadNeededDetails();
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'agents']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
    })
  }

  loadInvoiceReminders() {
    console.log(this._filters);

    this.loading = true;
    this.rowData = [];
    this.ss.searchDealsInvoiceReminders(this._filters).subscribe(res => {
      this.loading = false;
      this._reminders = new Array();
      this._reminders = res['DealInvoiceReminders'];
      this._reminders.sort((a, b) => b.id - a.id);

      this._reminders.forEach(rem => {
        let _rowData: any = {};

        _rowData.reminderDate = rem.reminder.reminderDate;
        _rowData.description = rem.reminder.description;
        _rowData.remInvoiceNo = rem.reminder.invoiceNo;
        _rowData.remInvoiceId = rem.reminder.invoiceId;

        _rowData.institute = rem.deal.institute;
        _rowData.dealType = rem.deal.dealType;
        _rowData.instituteName = rem.deal.institute.instituteName;
        _rowData.noOfProducts = rem.deal.noOfProducts;
        _rowData.dealId = rem.deal.id;
        _rowData.grandTotal = rem.deal.grandTotal;
        _rowData.quoteNo = rem.deal.quoteNo;
        _rowData.purchaseOrderNo = rem.deal.purchaseOrderNo;
        _rowData.salesOrderNo = rem.deal.salesOrderNo;
        _rowData.proformaInvoiceNo = rem.deal.proformaInvoiceNo;
        _rowData.invoiceNo = rem.deal.invoiceNo;
        _rowData.createddatetime = rem.deal.createddatetime;

        this.rowData.push(_rowData);
      })
    }, error => { this.loading = false; });

  }

  clearFilters() {
    this._filters = {
      institutes: [],
      fromDate: null,
      toDate: null,
      dealType: '',
      createdFromDate: null,
      createdToDate: null,
      dateObject: null,
      createdDateObject: null
    }
  }

}
