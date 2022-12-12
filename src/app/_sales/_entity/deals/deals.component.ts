import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Deal } from '../deals-create/Deal';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {

  constructor(public ss: SalesService, private currencyPipe: CurrencyPipe, private datePipe: DatePipe) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.dealModifiedDateFrom = new Date(date);
    this._search_filters.dealModifiedDateTo = new Date();
    this._search_filters.dealModifiedDateObject = {
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

  showFilterScreen = true;
  showQuoteFilterScreen = false;
  showPOFilterScreen = false;
  showSOFilterScreen = false;
  showInvFilterScreen = false;
  showProInvFilterScreen = false;
  rowData = [];

  columnDefs = [
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/sales/deals/create?edit=1&did=${data.data.id}" target="_blank"> <i class='fas fa-edit'></i> </a>`;
      }
    },
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/sales/deals/overview/${data.data.id}/deal" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
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

        return `<a href="/sales/deals/overview/${data.data.id}/quotation" target="_blank"> ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Purchase Order', field: 'purchaseOrderNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Purchase Order';
        if (data.data.purchaseOrderNo && data.data.purchaseOrderNo != null && data.data.purchaseOrderNo != '')
          str = data.data.purchaseOrderNo;

        return `<a href="/sales/deals/overview/${data.data.id}/purchaseorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Sales Order', field: 'salesOrderNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Sales Order';
        if (data.data.salesOrderNo && data.data.salesOrderNo != null && data.data.salesOrderNo != '')
          str = data.data.salesOrderNo;

        return `<a href="/sales/deals/overview/${data.data.id}/salesorder" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Proforma Invoice', field: 'proformaInvoiceNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Invoice';
        if (data.data.proformaInvoiceNo && data.data.proformaInvoiceNo != null && data.data.proformaInvoiceNo != '')
          str = data.data.proformaInvoiceNo;

        return `<a href="/sales/deals/overview/${data.data.id}/proformainvoice" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Invoice', field: 'invoiceNo', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        let str = 'Generate Invoice';
        if (data.data.invoiceNo && data.data.invoiceNo != null && data.data.invoiceNo != '')
          str = data.data.invoiceNo;

        return `<a href="/sales/deals/overview/${data.data.id}/invoice" target="_blank">  ${str} <i class='fas fa-link'></i> </a>`;
      }
    },
    { headerName: 'No Of Products', field: 'noOfProducts', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    }

  ];

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

  dateChanged(event) {
    console.log(event);
  }

  _search_filters = {
    dealProducts: [],
    institutes: [],
    agents: [],
    dealCreatedDateObject: null,
    dealCreatedDateFrom: null,
    dealCreatedDateTo: null,
    dealModifiedDateObject: null,
    dealModifiedDateFrom: null,
    dealModifiedDateTo: null,
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

    poNo: '',
    poTrackingNo: '',
    poRequisitionNo: '',
    poSubject: '',
    poDateObject: null,
    poDateFrom: null,
    poDateTo: null,
    poDueDateObject: null,
    poDueDateFrom: null,
    poDueDateTo: null,
    poStatus: '',

    soNo: '',
    soSubject: '',
    soDueDateObject: null,
    soDueDateFrom: null,
    soDueDateTo: null,
    soStatus: '',

    proInvoiceNo: '',
    proInvoiceSubject: '',
    proInvoiceDueDateObject: null,
    proInvoiceDueDateFrom: null,
    proInvoiceDueDateTo: null,
    proInvoiceDateObject: null,
    proInvoiceDateFrom: null,
    proInvoiceDateTo: null,

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

  _institutes = [];
  _products = [];
  _agents = [];

  loading = false;

  _deals: Array<Deal> = [];

  ngOnInit() {
    this.loadDeals();
    this.loadNeededDetails();
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'agents']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
      this._products = res['Products'];
      this._agents = res['Agents'];
    })
  }

  loadDeals() {
    this.loading = true;
    this.rowData = [];
    this.ss.loadDeals(this._search_filters).subscribe(res => {
      this.loading = false;
      this._deals = new Array();
      this._deals = res['Deals'];
      this._deals.sort((a, b) => b.id - a.id);

      this._deals.forEach(deal => {
        let _rowData: any = {};
        _rowData.institute = deal.institute;
        _rowData.dealType = deal.dealType;
        _rowData.instituteName = deal.institute.instituteName;
        _rowData.noOfProducts = deal.noOfProducts;
        _rowData.id = deal.id;
        _rowData.grandTotal = deal.grandTotal;
        _rowData.quoteNo = deal.quoteNo;
        _rowData.purchaseOrderNo = deal.purchaseOrderNo;
        _rowData.salesOrderNo = deal.salesOrderNo;
        _rowData.proformaInvoiceNo = deal.proformaInvoiceNo;
        _rowData.invoiceNo = deal.invoiceNo;
        _rowData.createddatetime = deal.createddatetime;

        this.rowData.push(_rowData);
      })
    }, error => { this.loading = false; });
  }

  clearFilters() {
    this._search_filters = {
      dealProducts: [],
      institutes: [],
      agents: [],
      dealCreatedDateObject: null,
      dealCreatedDateFrom: null,
      dealCreatedDateTo: null,
      dealModifiedDateObject: null,
      dealModifiedDateFrom: null,
      dealModifiedDateTo: null,
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

      poNo: '',
      poTrackingNo: '',
      poRequisitionNo: '',
      poSubject: '',
      poDateObject: null,
      poDateFrom: null,
      poDateTo: null,
      poDueDateObject: null,
      poDueDateFrom: null,
      poDueDateTo: null,
      poStatus: '',

      soNo: '',
      soSubject: '',
      soDueDateObject: null,
      soDueDateFrom: null,
      soDueDateTo: null,
      soStatus: '',

      proInvoiceNo: '',
      proInvoiceSubject: '',
      proInvoiceDueDateObject: null,
      proInvoiceDueDateFrom: null,
      proInvoiceDueDateTo: null,
      proInvoiceDateObject: null,
      proInvoiceDateFrom: null,
      proInvoiceDateTo: null,

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

    if (!this.role.salesAdmin)
      this._search_filters.agents = [this.ss.auth.getAgentDetails()];
  }

}
