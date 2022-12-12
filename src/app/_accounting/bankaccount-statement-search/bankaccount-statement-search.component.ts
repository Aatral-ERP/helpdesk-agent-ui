import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { AccountingService } from 'src/app/_services/accounting.service';

@Component({
  selector: 'app-bankaccount-statement-search',
  templateUrl: './bankaccount-statement-search.component.html',
  styleUrls: ['./bankaccount-statement-search.component.css']
})
export class BankaccountStatementSearchComponent implements OnInit {

  constructor(private acs: AccountingService, private currencyPipe: CurrencyPipe, private datePipe: DatePipe) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_filters.transDateFrom = new Date(date);
    this._search_filters.transDateTo = new Date();
    this._search_filters.transDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    console.log(this._search_filters)
   }

   public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };
  
  loading = false;
  showFilterScreen = true;
  _accountStatementData = [];

  _search_filters = {
    description: '',
    refNo: '',
    transDateFrom: null,
    transDateTo: null,
    transDateObject: null,
  }

  ngOnInit() {
    this.loadBankStatementReport();
  }

  rowData = []; 
   columnDefs = [
 { headerName: 'Description', field: 'description', width: 280,sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
 { headerName: 'Ref.No', field: 'refNo', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },  
 {
  headerName: 'Transaction Date', field: 'transactionDate', width: 140, sortable: true, resizable: true, cellRenderer: (data) => {
    return this.datePipe.transform(data.value, 'dd/MM/yyyy');
  }
},
  {
    headerName: 'Credit Amount', field: 'creditAmount', width: 140, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      return this.currencyPipe.transform(data.value, 'INR');
    }
  },
  {
    headerName: 'Debit Amount', field: 'debitAmount', width: 135, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      return this.currencyPipe.transform(data.value, 'INR');
    }
  },
    {
    headerName: 'Total Balance', field: 'totalAmount', width: 130, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
      return this.currencyPipe.transform(data.value, 'INR');
    }
  },
 ];

  loadBankStatementReport(){
   this.loading=true;
   this.rowData = [];
  this.acs.getBankStatementReport(this._search_filters).subscribe(res=>{
  this.loading = false;
   console.log(res);
   if (res['StatusCode'] == '00') {
    this.loading = false;
    this._accountStatementData = new Array();
    this._accountStatementData = res['AccountStatementData'];
    //console.log(this._accountStatementData);
    this._accountStatementData.forEach(bs => {
      let _rowData: any = {};
     
      _rowData.description = bs.description;
      _rowData.refNo = bs.refNo;
      _rowData.creditAmount  = bs.creditAmount;
      _rowData.debitAmount = bs.debitAmount;
      _rowData.totalAmount = bs.totalAmount;
      _rowData.transactionDate = bs.transactionDate;
            
      this.rowData.push(_rowData);
   });
   }
  })
  }

  
  clearFilters(){
    this._search_filters = {
      description: '',
      refNo:'',
      transDateFrom:'',
      transDateObject:'',
      transDateTo:''
    }
  }

}
