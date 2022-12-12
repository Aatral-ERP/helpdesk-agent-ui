import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { PurchaseInputService } from 'src/app/_services/purchase-input.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {


  constructor(private snackbar: MatSnackBar, private ss: SalesService, private pis: PurchaseInputService, private currencyPipe: CurrencyPipe, private datePipe: DatePipe) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.billModifiedDateFrom = new Date(date);
    this._search_filters.billModifiedDateTo = new Date();
    this._search_filters.billModifiedDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    console.log(this._search_filters);
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

  _vendorDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'vendorName',
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

  _agents = [];
  _products = [];
  _vendors = [];

  _bills = [];

  loading = false;

  showFilterScreen = true;

  _search_filters = {

    billProducts: [],
    vendors: [],
    agents: [],
    billModifiedDateObject: null,
    billModifiedDateFrom: null,
    billModifiedDateTo: null,

    billNo: '',
    orderNo: '',
    billDateFromObject: null,
    billDateFrom: null,
    billDateTo: null,
    dueDateFromObject: null,
    dueDateFrom: null,
    dueDateTo: null
  }

  rowData = [];
  columnDefs = [
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/purchase-inputs/bills/create?edit=1&bid=${data.data.id}" target="_blank"> <i class='fas fa-edit'></i> </a>`;
      }
    },
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/purchase-inputs/bills/overview/${data.data.id}" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
      }
    },
    { headerName: 'Vendor', field: 'vendor.vendorName', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Bill No', field: 'billNo', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Bill Date', field: 'billDate', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'Taxable Amount', field: 'grandTotal', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.data.grandTotal - data.data.tax, 'INR');
      }
    },
    {
      headerName: 'CGST', field: 'tax', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.data.gstType == "CGST/SGST") {
          return this.currencyPipe.transform(data.data.tax / 2, 'INR');
        } else {
          return this.currencyPipe.transform(0, 'INR');
        }
      }
    },
    {
      headerName: 'SGST', field: 'tax', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.data.gstType == "CGST/SGST") {
          return this.currencyPipe.transform(data.data.tax / 2, 'INR');
        } else {
          return this.currencyPipe.transform(0, 'INR');
        }
      }
    },
    {
      headerName: 'IGST', field: 'tax', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.data.gstType == "IGST") {
          return this.currencyPipe.transform(data.data.tax, 'INR');
        } else {
          return this.currencyPipe.transform(0, 'INR');
        }
      }
    },
    {
      headerName: 'Total Tax', field: 'tax', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Total Amount', field: 'grandTotal', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    }, { headerName: 'Vendor GSTIN', field: 'vendor.gstNo', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Order No', field: 'orderNo', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },

    { headerName: 'Gst Type', field: 'gstType', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Due Date', field: 'dueDate', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    { headerName: 'Id', field: 'id', hide: true },
    { headerName: 'No Of Products', field: 'noOfProducts', width: 120, sortable: true, filter: true, resizable: true },
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


  ngOnInit() {
    this.loadNeeded();
    this.getBills();
  }

  loadNeeded() {
    this.ss.getSalesNeededData(['vendors', 'products', 'agents']).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this._products = res['Products'];
        this._agents = res['Agents'];
        this._vendors = res['Vendors'];
      }
    })
  }

  getBills() {
    console.log(this._search_filters);
    this.loading = true;
    this.rowData = [];
    this.pis.getBills(this._search_filters).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        this.loading = false;
        this._bills = new Array();
        this._bills = res['Bills'];

        this._bills.forEach(bill => {
          let _rowData: any = {};
          _rowData.vendor = bill.vendor;
          _rowData.noOfProducts = bill.noOfProducts;
          _rowData.id = bill.id;
          _rowData.grandTotal = bill.grandTotal;
          _rowData.tax = bill.tax;
          _rowData.gstType = bill.gstType;
          _rowData.billNo = bill.billNo;
          _rowData.orderNo = bill.orderNo;
          _rowData.billDate = bill.billDate;
          _rowData.dueDate = bill.dueDate;
          _rowData.createddatetime = bill.createddatetime;
          _rowData.lastupdatedatetime = bill.lastupdatedatetime;

          this.rowData.push(_rowData);
        });
        console.log(this.rowData);

        if (this.rowData.length == 0) {
          this.snackbar.open('No Bills Found');
        }
      } else {

      }
    }, error => { this.loading = false; })
  }

  clearFilters() {
    this._search_filters = {

      billProducts: [],
      vendors: [],
      agents: [],
      billModifiedDateObject: null,
      billModifiedDateFrom: null,
      billModifiedDateTo: null,

      billNo: '',
      orderNo: '',
      billDateFromObject: null,
      billDateFrom: null,
      billDateTo: null,
      dueDateFromObject: null,
      dueDateFrom: null,
      dueDateTo: null
    }
  }

}
