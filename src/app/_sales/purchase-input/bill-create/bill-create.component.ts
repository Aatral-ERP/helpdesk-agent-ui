import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { Bill, BillProduct, BillAttachment } from '../bills/Bill';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { PurchaseInputService } from 'src/app/_services/purchase-input.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

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
  selector: 'app-bill-create',
  templateUrl: './bill-create.component.html',
  styleUrls: ['./bill-create.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class BillCreateComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ss: SalesService, public su: SalesUtilService,
    private pis: PurchaseInputService, private actRoute: ActivatedRoute, public route: Router) {

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['edit']) {
        if (params['edit'] == 1 && params['bid']) {
          this._mode = 'Edit';
          this.loadBillForEdit(params['bid']);
        }
      }
    })
  }

  ngOnInit() {
    this.loadNeeded();
  }

  _productsShow = [];
  _vendors = [];
  _products = [];
  _selectedVendor = [];

  _mode = 'Add';
  productName = '';
  _is_products_loading = false;
  saving = false;

  bill: Bill = new Bill();
  billAttachments: Array<BillAttachment> = [];

  _vendorDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'vendorName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  loadNeeded() {
    this.ss.getSalesNeededData(['vendors', 'products']).subscribe(res => {
      console.log(res);
      this._vendors = res['Vendors'];
      this._products = res['Products'];
    })
  }

  openAddProductModal() {

    this._productsShow = [];
    this._products.filter(prod => {
      let isAdded = true;

      this.bill.products.forEach(pro => {
        if (prod.id == pro.productId)
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

  getdescription(prod): string {
    let desc = '';
    if (prod.hsn != '' && prod.hsn != null) {
      desc = desc + "HSN Code : " + prod.hsn + "\n";
    }
    return desc;
  }


  addProduct(prod) {

    let is_already_available = false;
    this.bill.products.forEach(prd => {
      if (prd.productId == prod.id)
        is_already_available = true;
    });

    let product: BillProduct = {
      id: 0,
      billNo: 0,
      productId: prod.id,
      name: prod.name,
      description: this.getdescription(prod),
      price: prod.vendorAmount,
      quantity: 1,
      discount: 0,
      gstPercentage: prod.gst
    };

    if (!is_already_available) {
      this.bill.products.push(product);
    }
    $(function () {
      $('#productaddmodal').appendTo("body").modal('hide');
    });
  }
  fileChange(event: FileList) {
    console.log(event);

    for (let i = 0; i < event.length; i++) {

      const file = event[i];
      let billAttachment: BillAttachment;
      this.toBase64(file).then((result) => {
        console.log(result);
        let file_as_bas64 = new String(result).split(',')[1];
        billAttachment = {
          id: 0,
          billId: this.bill.id,
          filename: file.name,
          filetype: file.type,
          file: file_as_bas64,
          size: file.size,
        };
        console.log(billAttachment);

        if (this.billAttachments.length < 5)
          this.billAttachments.push(billAttachment);
      });
    }
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  loadBillForEdit(billId) {
    this.pis.getBill(billId).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.bill = res['Bill'];
        this.bill.products = res['BillProducts'];
        this.billAttachments = res['BillAttachments'];

        this._selectedVendor = [{ id: this.bill.id, vendorName: this.bill.vendor.vendorName }];
      }
    })
  }

  saveBill() {

    if (this.bill.vendor == null || this.bill.vendor === undefined) {
      this.snackbar.open('Please Select Vendor');
      return;
    }
    if (this.bill.billNo == null || this.bill.billNo === undefined || this.bill.billNo == '') {
      this.snackbar.open('Bill No cannot be empty');
      return;
    }
    if (this.bill.billDate == null || this.bill.billDate === undefined) {
      this.snackbar.open('Bill Date cannot be empty');
      return;
    }

    this.bill.subTotal = this.su.getSubTotal(this.bill.products);
    this.bill.adjustment = this.su.getAdjustment(this.bill.products);
    this.bill.discount = this.su.getDiscount(this.bill.products);
    this.bill.grandTotal = this.su.getGrandTotal(this.bill.products);
    this.bill.tax = this.su.getTaxAmount(this.bill.products);

    this.saving = true;

    this.pis.saveBill(this.bill, this.billAttachments).subscribe(res => {
      this.saving = false;
      if (res['StatusCode'] == '00') {
        this.snackbar.open('Saved Successfully');
        this.route.navigateByUrl('/purchase-inputs/bills/overview/' + res['Bill']['id']);
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => { this.saving = false; })

  }

  changeAddress() {
    this._vendors
      .filter(vendor => vendor.id == this.bill.vendor.id)
      .forEach(vendor => {
        let gstNo = '\nGSTIN : ';
        if (vendor.gstNo != null && vendor.gstNo != '') {
          gstNo = gstNo + vendor.gstNo;
        } else {
          gstNo = gstNo + "Unregistered";
        }
        let vendorAddress = vendor.address1 + ',\n' + vendor.address2
          + ',\n' + vendor.city + ', ' + vendor.state + ',\n'
          + vendor.country + ' - ' + vendor.pincode + '.';

        this.bill.billingTo = vendorAddress + gstNo;
        this.bill.shippingTo = vendorAddress + gstNo;
      })
  }

}
