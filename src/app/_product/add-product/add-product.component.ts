import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from 'src/app/_services/agent.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Product } from '../Product';
import { StockEntry } from '../StockEntry';
import { AuthService } from 'src/app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SalesService } from 'src/app/_services/sales.service';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductsRawMaterials } from './ProductsRawMaterials';
declare var $: any;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class AddProductComponent implements OnInit {

  constructor(private as: AgentService, private actRoute: ActivatedRoute, private datePipe: DatePipe,
    private auth: AuthService, private router: Router, private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<AddProductComponent>,
    private ss: SalesService, @Inject(MAT_DIALOG_DATA) public data: any) { }
  _vendors = [];
  _selectedVendor = [];

  _vendorDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'vendorName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  loadingStock = false;
  loadingProductsRawMaterials = false;
  showStockEntry = false;
  stockEntry: StockEntry = new StockEntry();
  stockEntries: Array<StockEntry> = [];

  product = new Product();

  productName = '';
  _is_products_loading = false;
  _products = [];
  _products_category: Array<string> = [];
  _productsShow = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '8rem',
    minHeight: '5rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Description about the Product',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['insertImage', 'insertVideo', 'insertHorizontalRule', 'backgroundColor', 'textColor',
        'customClasses', 'link', 'unlink',]
    ]
  };

  rowData = [];
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

  rawMaterials: Array<ProductsRawMaterials> = [];

  ngOnInit(): void {
    this.product = new Product();

    let pid = '0';
    console.log(this.data);
    console.log(pid);

    if (this.data.id) {
      pid = this.data.id + '';
      console.log(pid);
    } else {
      pid = this.actRoute.snapshot.queryParamMap.get('pid');
      console.log(pid);
    }

    console.log(pid);
    this.getProductDetails(pid);

    this.loadNeeded();
  }

  loadNeeded() {
    this.ss.getSalesNeededData(['vendors', 'products', 'products_category']).subscribe(res => {
      console.log(res);
      this._vendors = res['Vendors'];
      this._products = res['Products'];

      this._products_category = Array.from(new Set(this._products.map(x => x.category)));

    })
  }

  getProductDetails(pid) {
    this.as.getProductDetails(pid).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.product = res['Product'];
        if (this.product.vendor != null)
          this._selectedVendor.push(this.product.vendor);
        this.getAllStockEntry();
        this.getAllProductsRawMaterials();
      }
    })
  }

  save() {
    this.as.saveProduct(this.product).subscribe(res => {
      console.log('Response:::::', res);
      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc'], "success");
        this.router.navigate(['/product/view-product']);
      } else
        Swal.fire('', res['StatusDesc'], 'warning');
    })
  }

  closeDialog() {
    this.dialogRef.close({ action: 'Product Updated', product: this.product });
  }

  onChangeProductAmount() {
    console.log(this.product.amcAmount);
    if (this.product.amcAmount == 0 || this.product.amcAmount === undefined)
      this.product.amcAmount = this.product.amount * 0.10;
  }

  clear() {
    window.location.href = "./product/add-product";
  }

  getAllStockEntry() {
    this.rowData = [];
    this.loadingStock = true;
    this.as.getAllStockEntry(this.product).subscribe(resp => {
      this.loadingStock = false;
      if (resp['StatusCode'] == '00') {
        this.stockEntries = resp['StockEntries'];
        this.stockEntries.sort((a, b) => b.id - a.id).forEach(se => this.rowData.push(se));
      }
      console.log(this.rowData);
    }, error => this.loadingStock = false);
  }


  getAllProductsRawMaterials() {
    this.rawMaterials = [];
    this.loadingProductsRawMaterials = true;
    this.as.getAllProductsRawMaterials(this.product).subscribe(resp => {
      this.loadingProductsRawMaterials = false;
      if (resp['StatusCode'] == '00') {
        this.rawMaterials = resp['ProductsRawMaterials'];
      }
    }, error => this.loadingProductsRawMaterials = false);
  }

  saveStockEntry() {
    console.log(this.stockEntry, isNaN(this.stockEntry.quantity));

    if (isNaN(this.stockEntry.quantity) || this.stockEntry.quantity == 0 || this.stockEntry.quantity == null) {
      this.snackbar.open('Enter Valid Quantity');
    } else if (this.stockEntry.entryDate === undefined || this.stockEntry.entryDate == null) {
      this.snackbar.open('Choose Valid Entry Date');
    }

    this.stockEntry.productId = this.product.id;
    this.stockEntry.entryBy = this.auth.getLoginEmailId();

    console.log(this.stockEntry);
    this.as.saveStockEntry(this.stockEntry).subscribe(resp => {
      if (resp['StatusCode'] == '00') {

        this.product = resp['Product'];
        this.snackbar.open('Stock Added Successfully');
        this.showStockEntry = false;
        this.stockEntry = new StockEntry();
        this.getAllStockEntry();
      }
    })
  }

  openAddProductModal() {

    this._productsShow = [];
    this._products.filter(prod => {
      let isAdded = true;

      this.rawMaterials.forEach(raw => {
        if (prod.id == raw.mappedProductId)
          isAdded = false;
      })

      return isAdded;
    }).forEach(prod => {
      this._productsShow.push(prod);
    })

    $(function () {
      $('#productaddmodal').appendTo("body").modal('show');
    });
  }

  addProduct(prod) {

    let is_already_available = false;
    this.rawMaterials.forEach(raw => {
      if (raw.mappedProductId == prod.id)
        is_already_available = true;
    });


    if (!is_already_available) {

      let rawproduct = new ProductsRawMaterials();
      rawproduct.id = 0;
      rawproduct.productId = this.product.id;
      rawproduct.mappedProductId = prod.id;
      rawproduct.mappedProductName = prod.name;
      rawproduct.quantity = 1;

      this.rawMaterials.push(rawproduct);
    }
    $(function () {
      $('#productaddmodal').appendTo("body").modal('hide');
    });
  }

  saveRawMaterials() {
    let invalid = false;
    this.rawMaterials.forEach(raw => {
      if (raw.quantity === undefined || isNaN(raw.quantity) || raw.quantity <= 0) {
        this.snackbar.open('"' + raw.mappedProductName + '" has invalid quantity');
        invalid = true;
      }
    });

    if (invalid)
      return false;

    console.log(this.rawMaterials);
    this.as.saveProductsRawMaterials(this.product, this.rawMaterials).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.rawMaterials = resp['ProductsRawMaterials'];
        this.snackbar.open('Saved Successfully');
      }
    })

  }

}
