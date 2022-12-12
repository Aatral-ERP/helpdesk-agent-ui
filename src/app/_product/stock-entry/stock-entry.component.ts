import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AgentService } from 'src/app/_services/agent.service';
import { AuthService } from 'src/app/_services/auth.service';
import { NeededService } from 'src/app/_services/needed.service';
import { Product } from '../Product';
import { StockEntry } from '../StockEntry';

@Component({
  selector: 'app-stock-entry',
  templateUrl: './stock-entry.component.html',
  styleUrls: ['./stock-entry.component.css']
})
export class StockEntryComponent implements OnInit {

  constructor(private ns: NeededService, private as: AgentService, private datePipe: DatePipe,
    private snackbar: MatSnackBar, private auth: AuthService) { }

  _ProductsDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  columnDefs = [
    {
      headerName: 'Entry Date', field: 'entryDate', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    { headerName: 'Stock Type', field: 'type', width: 120, sortable: true, filter: true, resizable: true },
    { headerName: 'Id', field: 'id', hide: true },
    { headerName: 'Quantity', field: 'quantity', width: 120, sortable: true, filter: true, resizable: true },
    { headerName: 'Remarks', field: 'remarks', width: 300, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Entry By', field: 'entryBy', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy hh:mm a');
      }
    }
  ];

  _products: Array<Product> = [];
  _selectedProduct: Product;

  rowData = [];
  loadingStock = true;
  showStockEntry = false;
  stockEntry: StockEntry = new StockEntry();
  stockEntries: Array<StockEntry> = [];

  ngOnInit() {
    this.loadNeeded();
  }

  loadNeeded() {
    this.ns.loadNeeded(['products_min']).subscribe(resp => {
      this._products = resp['products_min'];
    })
  }

  getAllStockEntry(product) {

    this._selectedProduct = this._products.find(prod => prod.id == product.id);
    this.rowData = [];
    this.loadingStock = true;
    this.as.getAllStockEntry(product).subscribe(resp => {
      this.loadingStock = false;
      if (resp['StatusCode'] == '00') {
        this.stockEntries = resp['StockEntries'];
        this.stockEntries.sort((a, b) => b.id - a.id).forEach(se => this.rowData.push(se));
      }
      console.log(this.rowData);
    }, error => this.loadingStock = false);
  }

  onProductSelect(product) {
    console.log(product);
    this.getAllStockEntry(product);
  }

  onProductDeSelect() {
    this._selectedProduct = undefined;
  }

  saveStockEntry() {
    console.log(this.stockEntry, isNaN(this.stockEntry.quantity));

    if (isNaN(this.stockEntry.quantity) || this.stockEntry.quantity == 0 || this.stockEntry.quantity == null) {
      this.snackbar.open('Enter Valid Quantity');
    } else if (this.stockEntry.entryDate === undefined || this.stockEntry.entryDate == null) {
      this.snackbar.open('Choose Valid Entry Date');
    }

    this.stockEntry.productId = this._selectedProduct.id;
    this.stockEntry.entryBy = this.auth.getLoginEmailId();

    console.log(this.stockEntry);
    this.as.saveStockEntry(this.stockEntry).subscribe(resp => {
      if (resp['StatusCode'] == '00') {

        let i = this._products.indexOf(this._products.find(prod => prod.id == this._selectedProduct.id));
        this._products[i] = resp['Product'];
        this.snackbar.open('Stock Added Successfully');
        this.showStockEntry = false;
        this.stockEntry = new StockEntry();
        this.getAllStockEntry(this._selectedProduct);
      }
    })
  }
}
