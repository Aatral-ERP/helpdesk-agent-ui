import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { InstituteService } from 'src/app/_services/institute.service';
import { SalesService } from 'src/app/_services/sales.service';

@Component({
  selector: 'app-amc-entry-edit',
  templateUrl: './amc-entry-edit.component.html',
  styleUrls: ['./amc-entry-edit.component.css']
})
export class AmcEntryEditComponent implements OnInit {

  constructor(private is: InstituteService, private ss: SalesService, private currencyPipe: CurrencyPipe, private actRoute: ActivatedRoute, private datePipe: DatePipe) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_amcfilters.amcPaidDateFrom = new Date(date);
    this._search_amcfilters.amcPaidDateTo = new Date();
    this._search_amcfilters.amcPaidDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    console.log(this._search_amcfilters);
  }


  loading = false;
  rowData = [];
  AmcDetails: any[];
  _institutes = [];
  _products = [];
  columnDefs = [
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a target="_blank" href="/institute/amc-entry?edit=1&aid=${data.data.id}"> <i class='fas fa-edit'></i> </a>`;
      }
    },
    { headerName: 'Inst.Name', field: 'institute', sortable: true, filter: true, minWidth: 240, width: 300 },
    { headerName: 'Product Name', field: 'product', sortable: true, filter: true, minWidth: 240, width: 300 },
    { headerName: 'Inv No', field: 'amcId', sortable: true, filter: true, minWidth: 140, width: 200 },
    {
      headerName: 'Invoice Date', field: 'invDate', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'AMC Amount', field: 'amcAmount', filter: true, sortable: true, minWidth: 90, width: 110, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'GST Amount', field: 'gst', filter: true, sortable: true, minWidth: 90, width: 110, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Tot.Amount', field: 'totalAmount', filter: true, sortable: true, minWidth: 90, width: 110, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Valid From Date', field: 'fromDate', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'Valid To Date', field: 'toDate', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'Paid Date', field: 'paidDate', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    // { headerName: 'ServiceType', field: 'serviceType', sortable: true, width: 120, filter: true, minWidth: 120 },
    { headerName: 'PayMode', field: 'payMode', sortable: true, filter: true, minWidth: 120, width: 160 },
    { headerName: 'Transaction', field: 'transactionDetails', sortable: true, filter: true, minWidth: 150, width: 160 },
    { headerName: 'Description', field: 'description', sortable: true, filter: true, minWidth: 130, width: 160 },
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

  _search_amcfilters = {
    amcProducts: [],
    institutes: [],
    payMode: '',
    serviceType: '',
    amcId: '',
    transDetails: '',
    amcPaidDateObject: null,
    amcPaidDateFrom: null,
    amcPaidDateTo: null,
    amcInvDateObject: null,
    amcInvDateFrom: null,
    amcInvDateTo: null,
    amcValidDateObject: null,
    amcValidDateFrom: null,
    amcValidDateTo: null,
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

  dateChanged(event) {
    console.log(event);
  }

  ngOnInit() {
    this.loadAmcDetials();
    this.loadNeededDetails();
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'agents']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
      this._products = res['Products'];
    })
  }

  loadAmcDetials() {
    this.loading = true;
    this.rowData = [];
    this.is.loadAmcDetails(this._search_amcfilters).subscribe(res => {
      this.loading = false;
      console.log(res);
      this.AmcDetails = new Array();
      this.AmcDetails = res['amcDetails'];

      this.AmcDetails.forEach(amcdetails => {
        let _rowData: any = {};
        _rowData.institute = amcdetails.amcdetails.institute.instituteName;
        _rowData.product = amcdetails.product.name;
        _rowData.amcId = amcdetails.amcdetails.amcId;
        _rowData.id = amcdetails.amcdetails.id;
        _rowData.invDate = amcdetails.amcdetails.invDate;
        _rowData.title = amcdetails.amcdetails.title;
        _rowData.amcAmount = amcdetails.amcdetails.amcAmount;
        _rowData.gst = amcdetails.amcdetails.gst;
        _rowData.totalAmount = amcdetails.amcdetails.totalAmount;
        _rowData.fromDate = amcdetails.amcdetails.fromDate;
        _rowData.toDate = amcdetails.amcdetails.toDate;
        _rowData.paidDate = amcdetails.amcdetails.paidDate;
        _rowData.serviceType = amcdetails.amcdetails.serviceType;
        _rowData.payMode = amcdetails.amcdetails.payMode;
        _rowData.transactionDetails = amcdetails.amcdetails.transactionDetails;
        _rowData.description = amcdetails.amcdetails.description;

        this.rowData.push(_rowData);
      })

    }, error => { this.loading = false; })
  }

  clearFilters() {
    this._search_amcfilters = {
      amcProducts: [],
      institutes: [],
      payMode: '',
      serviceType: '',
      amcId: '',
      transDetails: '',
      amcPaidDateFrom: '',
      amcPaidDateObject: '',
      amcPaidDateTo: '',
      amcInvDateFrom: '',
      amcInvDateObject: '',
      amcInvDateTo: '',
      amcValidDateFrom: '',
      amcValidDateObject: '',
      amcValidDateTo: ''
    }
  }

}
