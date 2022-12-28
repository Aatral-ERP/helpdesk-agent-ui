import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from 'src/app/_services/sales.service';
import { Router } from '@angular/router';
import { DeliveryChallan } from './deliverychallan';
import { Deal } from '../deals-create/Deal';
import { DealInvoice } from '../../invoices/invoice-create/DealInvoice';
import { Product } from 'src/app/_product/Product';
import { DealDCProducts } from './DealDCProducts';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { environment } from 'src/environments/environment';
import { DealDCProductRawMaterial } from './DealDCProductRawMaterial';
declare var $: any;

@Component({
  selector: 'app-deals-delivery-challan',
  templateUrl: './deals-delivery-challan.component.html',
  styleUrls: ['./deals-delivery-challan.component.css']
})
export class DealsDeliveryChallanComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ss: SalesService,
    private invServ: InvoiceService) { }

  loading = false;

  @Input() dealId: number;
  @Input() deal: Deal;
  @Output() DeliveryChallanEvent: EventEmitter<DeliveryChallan> = new EventEmitter();
  @Input() set deliveryChallan(_deliveryChallan: DeliveryChallan) {
    console.log(_deliveryChallan);
    if (_deliveryChallan === undefined || _deliveryChallan == null)
      this.dc = new DeliveryChallan();
    else
      this.dc = Object.assign({}, _deliveryChallan);
  }

  invoices: Array<DealInvoice> = [];

  dc: DeliveryChallan = new DeliveryChallan();

  _productsShow: Array<Product> = [];
  _products = [];
  productName = '';
  _is_products_loading = false;
  _saving = false;
  showDCTemplateOptions = false;
  generatingPDF = false;

  _currentProductId: number = 0;

  reminingDealProducts: Array<any> = [];

  ngOnInit() {
    this.getDealInvoicesPreview();
    this.loadNeeded();
  }

  loadNeeded() {
    this.ss.getSalesNeededData(['products']).subscribe(res => {
      this._products = res['Products'];

      this.filterProduct('');

    })
  }

  getDealInvoicesPreview() {
    this.loading = true;
    this.ss.getDealInvoicesPreview(this.dealId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.invoices = resp['DealInvoices'];
      }
    }, error => this.loading = false)
  }

  openAddProductRawMaterialModal(productId: number) {
    this._currentProductId = productId;

    this._productsShow = [];
    this._products.filter(prod => {
      let isAdded = true;

      this.dc.products
        .filter(_dcProduct => _dcProduct.productId == productId)
        .forEach(pro => {
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

  filterProduct(_event: string) {
    console.log(_event);

    this._productsShow = [];
    this._productsShow = this._products.filter(prod => {

      if (this.dc.products.find(pro => prod.id == pro.productId) !== undefined)
        return false;
      else
        return true;

    }).filter(prod => {

      if (_event == '')
        return true;
      else if (_event.length > 0 && prod.name.toLowerCase().includes(_event.toLowerCase()))
        return true;
      else
        return false;

    })
  }

  getdescription(prod): string {
    let desc = '';

    if (this.deal.dealType == 'Sales') {
      if (prod.hsn != '' && prod.hsn != null) {
        desc = desc + "HSN Code : " + prod.hsn;
      }
      if (prod.salesDescription != '' && prod.salesDescription != null) {
        desc = desc + "\n" + prod.salesDescription;
      }
    } else if (this.deal.dealType == 'AMC') {
      if (prod.amcDescription != '' && prod.amcDescription != null) {
        desc = desc + prod.amcDescription;
      }
    }
    return desc;
  }

  addProduct(prod: Product) {
    console.log(prod);

    this.dc.products
      .filter(_dcp => _dcp.productId == this._currentProductId)
      .forEach(_dcp => {

        let _dcpRM = _dcp.dealDCProductRawMaterials.find(_dcp => _dcp.rawMaterialProductId == prod.id);
        console.log(_dcp, _dcpRM);

        if (_dcpRM === undefined) {

          let rawMaterial: DealDCProductRawMaterial = new DealDCProductRawMaterial();
          rawMaterial.dealId = this.dealId;
          rawMaterial.dcProductId = this._currentProductId;
          rawMaterial.rawMaterialProductId = prod.id;
          rawMaterial.description = prod.description;
          rawMaterial.invoiceNo = this.dc.invoiceNo;
          rawMaterial.name = prod.name;
          rawMaterial.quantity = 1;
          rawMaterial.uom = prod.uom;

          _dcp.dealDCProductRawMaterials.push(rawMaterial);

        } else {
          this.snackbar.open('Raw Material Already Selected');
        }
        console.log(_dcp.dealDCProductRawMaterials);

      });
    $(function () {
      $('#productaddmodal').appendTo("body").modal('hide');
    });
  }

  getQuantity(prod) {
    let qty = 0;

    if (this.deal.dealType == 'AMC') {
      qty = prod.quantity;
    } else {
      qty = 1;
    }

    return qty;
  }

  saveDC() {
    console.log(this.invoices.find(inv => inv.id == this.dc.invoiceId));
    if (this.invoices.find(inv => inv.id == this.dc.invoiceId) !== undefined) {
      this.dc.invoiceNo = this.invoices.find(inv => inv.id == this.dc.invoiceId).invoiceNo;
    } else {
      this.dc.invoiceNo = '';
    }

    this.dc.dealId = this.dealId;
    this.dc.products.forEach(prod => prod.invoiceNo = this.dc.invoiceNo);
    console.log(this.dc);
    this._saving = true;
    this.ss.saveDealDeliveryChallan(this.dc).subscribe(resp => {
      this._saving = false;
      if (resp['StatusCode'] == '00') {
        this.dc = resp['DealDeliveryChallan'];
        this.snackbar.open('Saved Successfully');
        this.DeliveryChallanEvent.next(this.dc);
      } else if (resp['StatusCode'] == '03') {
        this.snackbar.open(resp['StatusDesc']);
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => this._saving = false)
  }

  prefillFromPendingDCProducts() {
    this.snackbar.open('Fetching Pending DC Products from Deal...');
    if (this.dealId !== undefined && this.dealId != null) {
      this.invServ.getPendingDCQuantityProducts({ deal: { id: this.dealId } })
        .subscribe(resp => {

          if (resp['StatusCode'] == '00') {
            this.reminingDealProducts = resp['ReminingDealProducts'];

            if (this.reminingDealProducts.length > 0) {
              this.dc.products = [];
              this.reminingDealProducts.forEach(dp => {
                let dcP: DealDCProducts = new DealDCProducts();
                dcP.dealId = this.dealId;
                dcP.name = dp.name;
                dcP.description = dp.description;
                dcP.productId = dp.productId;
                dcP.quantity = dp.quantity;
                dcP.uom = dp.uom;

                this.dc.products.push(dcP);
              })

            } else {
              this.snackbar.open('It Seems All products are already delivered');
            }

          }
        })
    } else {
      this.snackbar.open('Deal Cant be empty');
    }
  }

  maxQuantity(productId) {
    let rp = this.reminingDealProducts.find(rp => rp.productId == productId);
    return rp !== undefined ? rp.quantity : 0;
  }

  onChangeQuantity(prod: DealDCProducts) {
    if (this.reminingDealProducts.filter(rp => rp.productId == prod.productId).length > 0) {
      let remprod = this.reminingDealProducts.filter(rp => rp.productId == prod.productId)[0];
      if (prod.quantity > remprod.quantity) {
        this.dc.products
          .filter(dcp => dcp.productId == prod.productId)
          .forEach(dcp => {
            console.log(dcp.productId + " :: " + this.reminingDealProducts.find(rp => rp.productId == dcp.productId).quantity);
            dcp.quantity = remprod.quantity
          });
        prod.quantity = remprod.quantity;
        this.snackbar.open(`'${prod.name}' +  exceeds Deal Products Quantity`);
      }
    }
  }

  clear() {
    window.location.href = "./sales/deals/overview/" + this.deal.id + "/delivery-challan";
  }

  generateDCPDF(TemplateName) {
    this.generatingPDF = true;

    this.invServ.generateDCPDF(this.dc, TemplateName).subscribe(res => {

      this.generatingPDF = false;
      if (res['StatusCode'] == '00') {
        this.dc.filename = res['DeliveryChallan']['filename'];
        this.snackbar.open('Generated Successfully');
        this.viewDCPDF();
      } else {
        this.snackbar.open('Something went wrong! Try again later');
      }
    })
  }

  viewDCPDF() {
    let url = environment.apiUrl + 'download/download-delivery-challan-pdf/view/' + this.dc.filename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  downloadDCPDF() {
    let url = environment.apiUrl + 'download/download-delivery-challan-pdf/download/' + this.dc.filename;
    window.open(url, '_blank');
  }
}
