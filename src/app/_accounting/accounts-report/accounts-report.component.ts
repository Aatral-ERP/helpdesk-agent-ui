import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AccountingService } from 'src/app/_services/accounting.service';
import { SalesService } from 'src/app/_services/sales.service';

@Component({
  selector: 'app-accounts-report',
  templateUrl: './accounts-report.component.html',
  styleUrls: ['./accounts-report.component.css']
})
export class AccountsReportComponent implements OnInit {

  constructor(private snackbar: MatSnackBar,private ss: SalesService,private acs: AccountingService, 
    private currencyPipe: CurrencyPipe, private datePipe: DatePipe) { 
    
      let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.paymentDateFrom = new Date(date);
    this._search_filters.paymentDateTo = new Date();
    this._search_filters.paymentDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    console.log(this._search_filters)
  }
  

  _AgentsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'emailId',
    textField: 'firstName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _CategoryDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'category',
    textField: 'category',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
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
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };
  
  private gridApi;
  private gridColumnApi;

  loading = false;
  showFilterScreen = true;
  _agents=[];
  _institutes=[];
  _vendors=[];
  _createAgents:[];
  _accountData = [];
  category = [];
  uniqueArray:[];
  
  
  
  _search_filters = {
    institutes: [],
    vendors: [],
    agents: [],
    createAgents:[],
    category:[], 
    subject: '',
    name:'',
    type: '',
    mode: '',
    paymentDateFrom: null,
    paymentDateTo: null,
    paymentDateObject: null,
  }

    
  rowData = []; 
  columnDefs = [
 // { headerName: 'ID', field: 'id',  width: 80, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
 { headerName: 'Inst/Agent.Name', field: 'name', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
 { headerName: 'Subject', field: 'subject', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
 { headerName: 'Bill/Invoice No', field: 'billNo', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } }, 
 { headerName: 'Category', field: 'category', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } }, 
 { headerName: 'Type', field: 'type', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
 { headerName: 'Mode', field: 'mode', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
 { headerName: 'Payment Date', field: 'paymentDate', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => { return this.datePipe.transform(data.value,'mediumDate') } },  
 { headerName: 'Created By', field: 'createdBy', width: 180, sortable: true, filter: true, resizable: true },
  {
    headerName: 'Amount', field: 'amount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      return this.currencyPipe.transform(data.value, 'INR');
    }
  },  {
    headerName: 'Total Amount', field: 'totAmount', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      return this.currencyPipe.transform(data.value, 'INR');
    }
  },
];

  ngOnInit() {
    this.loadNeeded();
    this.loadCategoryNeeded();
   this.loadAccountReport(); 
   this.loadInstituteDetails();
   
  }

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
    })
  }

  loadCategoryNeeded() {
    console.log("Befor cond Category::::::");
    this.acs.loadCategoryNeeded().subscribe(resp => {
      console.log("Inside Category::::::");
      console.log(resp);
      if (resp['StatusCode'] == '00') {
       this.category=resp['categoryList'];
      console.log(this.category);
      
      let uniqueArray = this.category.filter((thing, index) => {
        const _thing = JSON.stringify(thing);
        return index === this.category.findIndex(obj => {
          return JSON.stringify(obj) === _thing;
          
        });
      });
      this.category=uniqueArray;
      console.log("afterUnique::::",this.category);
      }
    })
  }

  loadNeeded() {
  this.ss.getSalesNeededData(['vendors', 'agents']).subscribe(res => {
    if (res['StatusCode'] == '00') {
      this._agents = res['Agents'];
      this._createAgents = res['Agents'];
      this._vendors = res['Vendors'];
    }
  })
}

  loadAccountReport(){
    this.loading = true;
    this.rowData = [];
    this.acs.getAccountingReport(this._search_filters).subscribe(res => {
      this.loading = false;
    console.log(res);
    if (res['StatusCode'] == '00') {
      this.loading = false;
      this._accountData = new Array();
      this._accountData = res['AccountData'];
      console.log(this._accountData);
      this._accountData.forEach(acc => {
        let _rowData: any = {};
       
        _rowData.id = acc.deal_id;
        _rowData.subject = acc.subject;
        _rowData.paymentDate = acc.payment_date;
        _rowData.createdBy  = acc.created_by;
        _rowData.mode = acc.MODE;
        _rowData.type = acc.TYPE;
        _rowData.name = acc.NAME;
        _rowData.category = acc.category;
        _rowData.amount = acc.amount;
        _rowData.totAmount = acc.total_amount;
        _rowData.billNo = acc.billno;
        
        this.rowData.push(_rowData);
     });
      //console.log(this.rowData);

      if (this.rowData.length == 0) {
        this.snackbar.open('No Bills Found');
      }
    } else {
    }
    },error => { this.loading = false; })
  }

  clearFilters(){
    this._search_filters = {
      institutes: [],
      vendors: [],
      agents: [], 
      createAgents:[],
      category:[],
      subject: '',
      name:'',
      type: '',
      mode: '',
      paymentDateFrom:'',
      paymentDateObject:'',
      paymentDateTo:''
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onBtnExport() {
    var params = { fileName: 'Accounting Report Export' };
    this.gridApi.exportDataAsCsv(params);
  }
}
