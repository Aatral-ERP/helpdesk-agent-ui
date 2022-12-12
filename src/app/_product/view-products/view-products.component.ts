import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AgentService } from 'src/app/_services/agent.service';
import { Product } from '../Product';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatDialog } from '@angular/material';
import { AGGridButtonRendererComponent } from 'src/app/_modules/common/ag-grid-button-renderer.component';
declare var $: any;

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {

  constructor(private as: AgentService, private route: Router, private decimalPipe: DecimalPipe,
    private snackbar: MatSnackBar, private currencyPipe: CurrencyPipe, public dialog: MatDialog) {
    this.frameworkComponents = {
      buttonRenderer: AGGridButtonRendererComponent,
    }
  }

  frameworkComponents: any;
  _amc_desc = '';
  productList: Array<Product> = [];
  loading = false;
  saving_amc_desc = false;
  gridApi: any;
  columnDefs = [
    {
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true, width: 40
    },
    {
      headerName: '', field: 'id', width: 40,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.editModal.bind(this),
        label: null
      }
    },
    {
      headerName: '', field: 'id', width: 40, cellRenderer: (data) => {
        return `<a href='/product/add-product?edit=1&pid=${data.data.id}' target='_blank'> <i class='fas fa-external-link-alt'></i> </a>`;
      }
    },
    {
      headerName: 'Name', field: 'name', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }
    },
    {
      headerName: 'In Stock', width: 100, field: 'stock', filter: 'agNumberColumnFilter', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.decimalPipe.transform(data.value);
      }
    },
    {
      headerName: 'Category', field: 'category', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }
    },
    {
      headerName: 'Finished Product', width: 80, field: 'finishedProduct', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.value)
          return "<span class='text-dark'>Finished Product</span>";
        else
          return "<span class='text-muted'>Raw Material</span>";
      }
    },
    {
      headerName: 'Default Product Amount', width: 120, field: 'amount', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.data.finishedProduct)
          return this.currencyPipe.transform(data.value, 'INR');
        else
          return "";
      }
    },
    {
      headerName: 'HSN Code', width: 120, field: 'hsn', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.data.finishedProduct)
          return data.value;
        else
          return "";
      }
    },
    {
      headerName: 'GST %', width: 60, field: 'gst', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.data.finishedProduct)
          return data.value + '%';
        else
          return "";
      }
    },
    {
      headerName: 'Warranty', width: 120, field: 'warranty', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.data.finishedProduct)
          return data.value;
        else
          return "";
      }
    },
    {
      headerName: 'UoM', field: 'uom', width: 120, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }
    },
    {
      headerName: 'Sales Desc.', width: 120, field: 'salesDescription', sortable: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        if (data.data.finishedProduct)
          return data.value;
        else
          return "";
      }
    },
    {
      headerName: 'Maintainable/Non-Maintainable Product', width: 120, field: 'maintainable', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.value)
          return "<span class='text-dark'>Maintainable Product</span>";
        else
          return "<span class='text-muted'>Non-Maintainable Product</span>";
      }
    },
    {
      headerName: 'Default AMC Amount', width: 120, field: 'amcAmount', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.data.maintainable)
          return this.currencyPipe.transform(data.value, 'INR');
        else
          return "";
      }
    },
    {
      headerName: 'AMC HSN Code', width: 120, field: 'amchsn', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.data.maintainable)
          return data.value;
        else
          return "";
      }
    },
    {
      headerName: 'AMC Desc.', width: 120, field: 'amcDescription', sortable: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        if (data.data.finishedProduct)
          return data.value;
        else
          return "";
      }
    },
    {
      headerName: 'Internal/External Product', width: 120, field: 'externalProduct', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.value)
          return "<span class='text-dark'>Internal Product</span>";
        else
          return "<span class='text-muted'>External Product</span>";
      }
    },
    {
      headerName: 'Vendor', field: 'vendor.vendorName', sortable: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        if (data.data.externalProduct)
          return data.value;
        else
          return "";
      }
    },
    {
      headerName: 'Vendor Product Amount', width: 120, field: 'vendorAmount', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.data.externalProduct)
          return this.currencyPipe.transform(data.value, 'INR');
        else
          return "";
      }
    },
    {
      headerName: 'Vendor AMC Amount', width: 120, field: 'vendorAmcAmount', sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.data.externalProduct && data.data.maintainable)
          return this.currencyPipe.transform(data.value, 'INR');
        else
          return "";
      }
    },
  ];

  onGridReady(params) {
    this.gridApi = params.api;
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.loading = true;
    this.as.getProducts().subscribe(res => {
      this.loading = false;
      console.log('Response:::::::', res);

      if (res['StatusCode'] == '00') {
        this.productList = res['productList'];
      }

    }, error => this.loading = false)
  }

  EditProduct(id) {
    this.route.navigate(['admin/add-product'], { queryParams: { pid: id, edit: 1 } });
  }

  editModal(event) {
    console.log(event.rowData);
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      autoFocus: false,
      disableClose: true,
      data: event.rowData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result['action'] == 'Product Updated') {
        let newProduct: Product = result['product'];
        this.getProducts();
      }
    });
  }

  delete(id) {
    this.as.deleteProduct(id).subscribe(res => {
      console.log('Response:::', res);

      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc']);
        this.getProducts();
      }
      else
        Swal.fire('Failed', 'Product is Associated with Institutes, Delete the association first and then Delete', 'error');
    })
  }

  updateChangedAttendancesModal() {
    let _selectedRows: Array<Product> = this.gridApi.getSelectedRows();
    if (_selectedRows.length > 0) {
      $(function () {
        $('#update_amc_desc').appendTo("body").modal('show');
      });
    } else {
      this.snackbar.open('Select Atleast One Product');
    }
  }

  updateChangedAttendances() {
    let _selectedRows: Array<Product> = this.gridApi.getSelectedRows();
    console.log(_selectedRows);
    if (_selectedRows.length == 0) {
      this.snackbar.open('Select Atleast One Product');
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: `This will update AMC Description for ${_selectedRows.length} Products.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update!'
      }).then((result) => {
        if (result.value) {
          _selectedRows.forEach(prod => {
            prod.amcDescription = this._amc_desc;
          });
          this.saving_amc_desc = true;
          this.as.updateBulkProducts(_selectedRows).subscribe(resp => {
            this.saving_amc_desc = false;
            $('#update_amc_desc').appendTo("body").modal('hide');

            if (resp['StatusCode'] == '00') {
              Swal.fire('Updated Successfully', '', 'success');
            } else if (resp['StatusCode'] == '03') {
              Swal.fire('', resp['StatusDesc'], 'warning');
            } else {
              Swal.fire('', 'Something went wrong, Try again later.', 'error');
            }
          }, error => this.saving_amc_desc = false)
        }
      })
    }
  }

  onBtnExport() {
    var params = { fileName: 'All Products' };
    this.gridApi.exportDataAsCsv(params);
  }

}
