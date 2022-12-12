import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PurchaseInputService } from 'src/app/_services/purchase-input.service';
import { SalesService } from 'src/app/_services/sales.service';

@Component({
  selector: 'app-bill-payment-report',
  templateUrl: './bill-payment-report.component.html',
  styleUrls: ['./bill-payment-report.component.css']
})
export class BillPaymentReportComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ss: SalesService, private pis: PurchaseInputService,private currencyPipe: CurrencyPipe, private datePipe: DatePipe) { 

  let date = new Date().setMonth(new Date().getMonth() - 1);

  this._search_filters.paymentModifiedDateFrom = new Date(date);
  this._search_filters.paymentModifiedDateTo = new Date();
  this._search_filters.paymentModifiedDateObject = {
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

_AgentsDropdownSettings: IDropdownSettings = {
  singleSelection: false,
  idField: 'emailId',
  textField: 'firstName',
  itemsShowLimit: 10,
  allowSearchFilter: true,
  closeDropDownOnSelection: true
};

_vendorDropdownSettings: IDropdownSettings = {
  singleSelection: false,
  idField: 'id',
  textField: 'vendorName',
  itemsShowLimit: 10,
  allowSearchFilter: true,
  closeDropDownOnSelection: true
};

_agents = [];
_vendors = [];
_billsPayment = [];

loading = false;

showFilterScreen = true;

_search_filters = {

  billProducts: [],
  vendors: [],
  agents: [],
  paymentModifiedDateObject: null,
  paymentModifiedDateFrom: null,
  paymentModifiedDateTo: null,

  billId: '',
  referenceno: '',
  mode: '',
  paymentDateFromObject: null,
  paymentDateFrom: null,
  paymentDateTo: null,
  dueDateFromObject: null,
  dueDateFrom: null,
  dueDateTo: null
}

rowData = [];
columnDefs = [
  {
    headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
      return `<a href="/purchase-inputs/bills/create?edit=1&bid=${data.data.billId}" target="_blank"> <i class='fas fa-edit'></i> </a>`;
    }
  },
  {
    headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
      return `<a href="/purchase-inputs/bills/overview/${data.data.billId}" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
    }
  },
  { headerName: 'Vendor', field: 'vendorName', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
  { headerName: 'ID', field: 'billId',  width: 80, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
  { headerName: 'Bill No', field: 'billNo',  width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
  {
    headerName: 'Bill Date', field: 'billDate', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
      return this.datePipe.transform(data.value, 'dd/MM/yyyy');
    }
  },
  { headerName: 'Order No', field: 'orderNo',  width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
  {
    headerName: 'Due Date', field: 'dueDate', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
      return this.datePipe.transform(data.value, 'dd/MM/yyyy');
    }
  },
  {
    headerName: 'Payment Date', field: 'paymentDate', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
      return this.datePipe.transform(data.value, 'dd/MM/yyyy');
    }
  },
  {
    headerName: 'Total Amount', field: 'TotOrderAmount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      return this.currencyPipe.transform(data.value, 'INR');
    }
  },
  {
    headerName: 'Paid Amount', field: 'paidAmount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      return this.currencyPipe.transform(data.value, 'INR');
    }
  },
  { headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
  { headerName: 'Drawn On', field: 'drawnon', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
  { headerName: 'Mode', field: 'mode', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
  
  { headerName: 'Created By', field: 'createdBy', width: 120, sortable: true, filter: true, resizable: true },
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
      this._agents = res['Agents'];
      this._vendors = res['Vendors'];
    }
  })
}

getBills() {
  console.log(this._search_filters);
  this.loading = true;
  this.rowData = [];
  this.pis.getBillPaymentDetails(this._search_filters).subscribe(res => {
    this.loading = false;
    console.log(res);
    if (res['StatusCode'] == '00') {
      this.loading = false;
      this._billsPayment = new Array();
      this._billsPayment = res['Bills'];
      console.log(this._billsPayment);
      this._billsPayment.forEach(bill => {
        let _rowData: any = {};
       
        _rowData.vendorName=bill.bill.vendor.vendorName;
        _rowData.billId = bill.billPayments.billId;
        _rowData.billNo = bill.bill.billNo;
        _rowData.billDate= bill.bill.billDate;
        _rowData.orderNo = bill.bill.orderNo;
        _rowData.dueDate= bill.bill.dueDate;
        _rowData.TotOrderAmount = bill.bill.grandTotal;
        _rowData.paidAmount = bill.billPayments.totalAmount;
        _rowData.paymentDate = bill.billPayments.paymentDate;
        _rowData.subject = bill.billPayments.subject;
        _rowData.drawnon = bill.billPayments.drawnon;
        _rowData.mode = bill.billPayments.mode;
        _rowData.createdBy  = bill.billPayments.createdBy;
        _rowData.createddatetime =bill.billPayments.createddatetime;
        _rowData.lastupdatedatetime = bill.billPayments.lastupdatedatetime;

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
    paymentModifiedDateObject: null,
    paymentModifiedDateFrom: null,
    paymentModifiedDateTo: null,

    billId: '',
    referenceno:'',
    mode: '',
    paymentDateFromObject: null,
    paymentDateFrom: null,
    paymentDateTo: null,
    dueDateFromObject: null,
    dueDateFrom: null,
    dueDateTo: null
  }
}

}
