import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from 'src/app/_services/sales.service';
import { PurchaseInputService } from 'src/app/_services/purchase-input.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-purchase-input-orders',
  templateUrl: './purchase-input-orders.component.html',
  styleUrls: ['./purchase-input-orders.component.css']
})
export class PurchaseInputOrdersComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ss: SalesService, private pis: PurchaseInputService, private currencyPipe: CurrencyPipe, private datePipe: DatePipe) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.orderModifiedDateFrom = new Date(date);
    this._search_filters.orderModifiedDateTo = new Date();
    this._search_filters.orderModifiedDateObject = {
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

  _orders = [];

  loading = false;

  showFilterScreen = true;

  _search_filters = {

    purchaseInputOrderProducts: [],
    vendors: [],
    agents: [],
    orderModifiedDateObject: null,
    orderModifiedDateFrom: null,
    orderModifiedDateTo: null,

    orderNo: '',
    referenceNo: '',
    orderDateFromObject: null,
    orderDateFrom: null,
    orderDateTo: null,
    expectedDeliveryDateFromObject: null,
    expectedDeliveryDateFrom: null,
    expectedDeliveryDateTo: null
  }

  rowData = [];
  columnDefs = [
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/purchase-inputs/orders/create?edit=1&pioid=${data.data.id}" target="_blank"> <i class='fas fa-edit'></i> </a>`;
      }
    },
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href="/purchase-inputs/orders/overview/${data.data.id}" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
      }
    },
    { headerName: 'Vendor', field: 'vendor.vendorName', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Order No', field: 'orderNo', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Order Date', field: 'orderDate', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    { headerName: 'Reference No', field: 'referenceNo', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Expected Delivery Date', field: 'expectedDeliveryDate', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
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
    { headerName: 'Gst Type', field: 'gstType', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
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
    this.getOrders();
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

  getOrders() {
    console.log(this._search_filters);
    this.loading = true;
    this.rowData = [];
    this.pis.getPurchaseInputOrders(this._search_filters).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        this.loading = false;
        this._orders = new Array();
        this._orders = res['PurchaseInputOrders'];

        this._orders.forEach(order => {
          let _rowData: any = {};
          _rowData.vendor = order.vendor;
          _rowData.noOfProducts = order.noOfProducts;
          _rowData.id = order.id;
          _rowData.grandTotal = order.grandTotal;
          _rowData.tax = order.tax;
          _rowData.gstType = order.gstType;
          _rowData.referenceNo = order.referenceNo;
          _rowData.orderNo = order.orderNo;
          _rowData.orderDate = order.orderDate;
          _rowData.expectedDeliveryDate = order.expectedDeliveryDate;
          _rowData.createddatetime = order.createddatetime;
          _rowData.lastupdatedatetime = order.lastupdatedatetime;

          this.rowData.push(_rowData);
        });
        console.log(this.rowData);

        if (this.rowData.length == 0) {
          this.snackbar.open('No Orders Found');
        }
      } else {

      }
    }, error => { this.loading = false; })
  }

  clearFilters() {
    this._search_filters = {

      purchaseInputOrderProducts: [],
      vendors: [],
      agents: [],
      orderModifiedDateObject: null,
      orderModifiedDateFrom: null,
      orderModifiedDateTo: null,

      orderNo: '',
      referenceNo: '',
      orderDateFromObject: null,
      orderDateFrom: null,
      orderDateTo: null,
      expectedDeliveryDateFromObject: null,
      expectedDeliveryDateFrom: null,
      expectedDeliveryDateTo: null
    }
  }


}
