import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AgentService } from 'src/app/_services/agent.service';
import { SalesService } from 'src/app/_services/sales.service';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css']
})
export class StockReportComponent implements OnInit {

  constructor(private ss: SalesService, private as: AgentService, private datePipe: DatePipe) {
    let date = new Date().setMonth(new Date().getMonth() - 1);

    this._search_stockfilter.entryDateFrom = new Date(date);
    this._search_stockfilter.entryDateTo = new Date();
    this._search_stockfilter.entryDateObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };

    console.log(this._search_stockfilter);
  }

  _products_category = [];
  _products = [];
  loading = false;
  rowData = [];
  stockDetails: any[];
  private gridApi;
  private gridColumnApi;
  columnDefs = [

    { headerName: 'Product Name', field: 'product', sortable: true, filter: true, resizable: true, minWidth: 240, width: 300 },
    { headerName: 'Category', field: 'category', sortable: true, filter: true, resizable: true, minWidth: 230, width: 150 },
    { headerName: 'Remarks', field: 'remarks', sortable: true, filter: true, resizable: true, minWidth: 230, width: 300 },
    { headerName: 'Type', field: 'type', sortable: true, filter: true, resizable: true, width: 100 },
    { headerName: 'Quantity', filter: 'agNumberColumnFilter', field: 'quantity', sortable: true, resizable: true, minWidth: 100, width: 100 },
    {
      headerName: 'Entry Date', field: 'entryDate', width: 120, sortable: true, filter: 'agDateColumnFilter', resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    { headerName: 'Entry By', field: 'entryBy', sortable: true, filter: true, resizable: true, width: 200 },
    { headerName: 'Created Date', field: 'createdDate', width: 180, sortable: true, filter: true, resizable: true },
  ];


  _ProductsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _search_stockfilter = {
    products: [],
    category: '',
    remarks: '',
    type: '',
    entryDateObject: null,
    entryDateFrom: null,
    entryDateTo: null,
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
    this.loadNeededDetails();
    this.loadStockDetials();
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['products']).subscribe(res => {
      console.log(res);
      this._products = res['Products'];

      this._products_category = Array.from(new Set(this._products.map(x => x.category)));
    })
  }

  loadStockDetials() {
    this.loading = true;
    this.rowData = [];
    this.as.loadStockDetails(this._search_stockfilter).subscribe(res => {
      this.loading = false;
      console.log(res);
      this.stockDetails = new Array();
      this.stockDetails = res['stockDetails'];

      this.stockDetails.forEach(stockDetails => {
        let _rowData: any = {};

        _rowData.product = stockDetails.product.name;
        _rowData.category = stockDetails.product.category;
        _rowData.id = stockDetails.stockEntry.id;
        _rowData.remarks = stockDetails.stockEntry.remarks;
        _rowData.type = stockDetails.stockEntry.type;
        _rowData.quantity = stockDetails.stockEntry.quantity;
        _rowData.entryBy = stockDetails.stockEntry.entryBy;
        _rowData.entryDate = stockDetails.stockEntry.entryDate;
        _rowData.createdDate = this.datePipe.transform(new Date(stockDetails.stockEntry.createddatetime), 'MMM dd, yyyy hh:mm a');

        this.rowData.push(_rowData);
      })

    }, error => { this.loading = false; })
  }

  clearFilters() {
    this._search_stockfilter = {
      products: [],
      category: '',
      remarks: '',
      type: '',
      entryDateObject: null,
      entryDateFrom: null,
      entryDateTo: null,
    }
  }
  onGridSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    // console.log(selectedRows);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onBtnExport() {
    var params = { fileName: 'Stock Details' };
    this.gridApi.exportDataAsCsv(params);
  }
}
