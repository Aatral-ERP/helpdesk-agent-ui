import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { InfoDetails } from 'src/app/info-details/infoDetails';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { Product } from 'src/app/_product/Product';
import { InstituteService } from 'src/app/_services/institute.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { SalesService } from 'src/app/_services/sales.service';
import { TicketService } from 'src/app/_services/ticket.service';
import { Deal } from '../../_entity/deals-create/Deal';
import { DealInvoice } from './DealInvoice';
import { DealInvoiceProducts } from './DealInvoiceProducts';

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
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class InvoiceCreateComponent implements OnInit {

  constructor(public su: SalesUtilService, private ss: SalesService, private is: InstituteService,
    private snackbar: MatSnackBar, private ts: TicketService, private actRoute: ActivatedRoute,
    private invServ: InvoiceService, private route: Router) {


    this.actRoute.queryParams.subscribe(params => {
      if (params['edit']) {
        if (params['edit'] == 1 && params['invid']) {
          this._mode = 'Edit';
          this.loadInvoiceForEdit(params['invid']);
        }
      } else if (params['prefill-from-deal']) {
        if (params['prefill-from-deal'] == 1 && params['did']) {
          this._mode = 'Create';
          this.prefillFromDeal(params['did']);
          this.loadNextInvoiceNo();
        }
      } else {
        this.route.navigateByUrl('/sales/invoices');
        this.loadNextInvoiceNo();
      }
    });

  }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _instituteContactDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'firstName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: false
  };

  invoice: DealInvoice = new DealInvoice();

  _institutes: Array<Institute> = [];
  _selectedInstitute = [];

  _inst_contacts = [];
  _productsShow = [];

  showTermsMasters = false;
  _show_parts = false;

  _mode = 'Create';
  productName: string = '';
  _products: Array<Product> = [];
  _is_products_loading: boolean = false;
  saving = false;

  _info: InfoDetails = new InfoDetails();
  _state_tin = [];

  ngOnInit() {
    this.loadInstituteDetails();
  }

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'info_min', 'state_tin']).subscribe(res => {
      this._institutes = res['Institutes'];
      this._products = res['Products'];

      this._info = res['InfoDetails'];
      this._state_tin = res['StateTinDetails'];

      this.actRoute.queryParams.subscribe(params => {
        console.log(params);
        if (params['prefill-from-deal']) {
          this.decideGSTType(this._selectedInstitute[0]);
        }
      })

      this.filterProduct('');
    })
  }

  loadInvoiceForEdit(invId) {
    this.invServ.getDealInvoice(invId).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.invoice = res['DealInvoice'];
        this.invoice.products = res['DealInvoiceProducts'];
        let dealInvoiceContacts: Array<any> = res['DealInvoiceContacts'];

        this.invoice.discountType = 'Amount';

        this.invoice.products.forEach(dp => {
          dp.discountPercent = this.onChangeDiscountAmount(dp.discount, dp.price);
        })

        if (this.su.getPartCounts(this.invoice.products) > 1)
          this._show_parts = true;

        this._selectedInstitute = [{ instituteId: this.invoice.institute.instituteId, instituteName: this.invoice.institute.instituteName }];

        console.log(this._selectedInstitute);

        this.decideGSTType(this._selectedInstitute[0]);

        this.invoice.instituteContacts = [];
        dealInvoiceContacts.forEach(ic => {
          console.log(ic);
          this.invoice.instituteContacts.push({ id: ic.instituteContact.id, firstName: ic.instituteContact.firstName });
        })
        console.log(this.invoice.instituteContacts);

        this.loadAllInstituteContacts(this.invoice.institute);
      } else {
        this.snackbar.open('No Invoice Found');
      }
    })
  }

  loadNextInvoiceNo() {
    this.invServ.loadNextInvoiceNo().subscribe(resp => {
      if (resp['StatusCode'] == "00") {
        this.snackbar.open('Invoice No Auto Generated from Previous Invoice.');
        this.invoice.invoiceNo = resp['AutoGeneratedInvoiceNo'];
        this.invoice.terms = resp['LastTerms'];
      }
    });
  }

  prefillFromDeal(dealId) {
    this.ss.getDealDetails(dealId).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        let _deal: Deal = resp['Deal'];
        _deal.products = resp['DealProducts'];
        let dealContacts: Array<any> = resp['DealContacts'];
        _deal.instituteContacts = [];
        dealContacts.forEach(ic => {
          _deal.instituteContacts.push(ic.instituteContact);
        })

        if (this.su.getPartCounts(this.invoice.products) > 1)
          this._show_parts = true;

        this.invoice.dealId = _deal.id;
        this.invoice.institute = _deal.institute;
        this.invoice.instituteContacts = _deal.instituteContacts;
        this.invoice.dealType = _deal.dealType;
        this.invoice.subject = "Invoice - Reg";

        this.invoice.salesOrderNo = _deal.salesOrderNo;
        this.invoice.purchaseOrderNo = _deal.purchaseOrderNo;

        // Preparing Billing Address
        this.invoice.billingTo = 'To'
        if (_deal.billingTo !== undefined && _deal.billingTo != null && _deal.billingTo != '')
          this.invoice.billingTo = this.invoice.billingTo + ',\n' + _deal.billingTo;
        this.invoice.billingTo = this.invoice.billingTo + ',\n' + _deal.institute.instituteName;
        if (_deal.institute.street1 !== undefined && _deal.institute.street1 != null && _deal.institute.street1 != '')
          this.invoice.billingTo = this.invoice.billingTo + ',\n' + _deal.institute.street1
        if (_deal.institute.street2 !== undefined && _deal.institute.street2 != null && _deal.institute.street2 != '')
          this.invoice.billingTo = this.invoice.billingTo + ',\n' + _deal.institute.street2
        if (_deal.institute.city !== undefined && _deal.institute.city != null && _deal.institute.city != '')
          this.invoice.billingTo = this.invoice.billingTo + ',\n' + _deal.institute.city
        if (_deal.institute.state !== undefined && _deal.institute.state != null && _deal.institute.state != '')
          this.invoice.billingTo = this.invoice.billingTo + ', ' + _deal.institute.state
        if (_deal.institute.country !== undefined && _deal.institute.country != null && _deal.institute.country != '')
          this.invoice.billingTo = this.invoice.billingTo + ',\n' + _deal.institute.country
        if (_deal.institute.zipcode !== undefined && _deal.institute.zipcode != null && _deal.institute.zipcode != '')
          this.invoice.billingTo = this.invoice.billingTo + ' - ' + _deal.institute.zipcode;

        // Preparing Shipping Address
        this.invoice.shippingTo = 'To'
        if (_deal.shippingTo !== undefined && _deal.shippingTo != null && _deal.shippingTo != '')
          this.invoice.shippingTo = this.invoice.shippingTo + ',\n' + _deal.shippingTo;
        this.invoice.shippingTo = this.invoice.shippingTo + ',\n' + _deal.institute.instituteName;
        if (_deal.institute.street1 !== undefined && _deal.institute.street1 != null && _deal.institute.street1 != '')
          this.invoice.shippingTo = this.invoice.shippingTo + ',\n' + _deal.institute.street1
        if (_deal.institute.street2 !== undefined && _deal.institute.street2 != null && _deal.institute.street2 != '')
          this.invoice.shippingTo = this.invoice.shippingTo + ',\n' + _deal.institute.street2
        if (_deal.institute.city !== undefined && _deal.institute.city != null && _deal.institute.city != '')
          this.invoice.shippingTo = this.invoice.shippingTo + ',\n' + _deal.institute.city
        if (_deal.institute.state !== undefined && _deal.institute.state != null && _deal.institute.state != '')
          this.invoice.shippingTo = this.invoice.shippingTo + ', ' + _deal.institute.state
        if (_deal.institute.country !== undefined && _deal.institute.country != null && _deal.institute.country != '')
          this.invoice.shippingTo = this.invoice.shippingTo + ',\n' + _deal.institute.country
        if (_deal.institute.zipcode !== undefined && _deal.institute.zipcode != null && _deal.institute.zipcode != '')
          this.invoice.shippingTo = this.invoice.shippingTo + ' - ' + _deal.institute.zipcode;

        this.invoice.amcFromDate = _deal.amcFromDate;
        this.invoice.amcToDate = _deal.amcToDate;

        this.invoice.products = _deal.products;

        this.invoice.adjustment = _deal.adjustment;
        this.invoice.products = _deal.products;

        this.invoice.subTotal = this.su.getSubTotal(this.invoice.products);
        this.invoice.adjustment = this.su.getAdjustment(this.invoice.products);
        this.invoice.discount = this.su.getDiscount(this.invoice.products);
        this.invoice.grandTotal = this.su.getGrandTotal(this.invoice.products);
        this.invoice.tax = this.su.getTaxAmount(this.invoice.products);

        this._selectedInstitute = [{ instituteId: this.invoice.institute.instituteId, instituteName: this.invoice.institute.instituteName }];

        console.log(this.invoice);

        this.loadAllInstituteContacts(this.invoice.institute);

      }
    }, error => this.snackbar.open("Can't load from Deal, Try Later."));
  }

  getInstituteProducts(inst) {
    this.ts.getInstituteProducts(inst).subscribe(res => {
      if (res['StatusCode'] == '00') {
        let instituteProducts: Array<any> = res['InstituteProducts'];
        console.log(instituteProducts);

        instituteProducts.forEach(ip => {
          this._products.filter(prod => ip.product.id == prod.id)
            .forEach(prod => {
              let _prod: any = Object.assign({}, prod);
              _prod.amcAmount = ip.amcAmount;
              _prod.quantity = ip.quantity;
              this.addProduct(prod);
            });
        });
      }
    })
  }

  saveInvoice() {

    if (this.invoice.dealType == 'AMC') {
      if (this.invoice.amcFromDate == null || this.invoice.amcToDate == null) {
        this.snackbar.open('Choose valid AMC From and To Date');
        return;
      }
    }
    if (this.invoice.invoiceNo === undefined || this.invoice.invoiceNo == null || this.invoice.invoiceNo == '') {
      this.snackbar.open('Invoice No Cannot be empty.');
      return;
    }

    this.invoice.subTotal = this.su.getSubTotal(this.invoice.products);
    this.invoice.adjustment = this.su.getAdjustment(this.invoice.products);
    this.invoice.discount = this.su.getDiscount(this.invoice.products);
    this.invoice.grandTotal = this.su.getGrandTotal(this.invoice.products);
    this.invoice.tax = this.su.getTaxAmount(this.invoice.products);

    this.saving = true;
    this.invServ.saveDealInvoice(this.invoice).subscribe(res => {
      this.saving = false;
      console.log(res);
      if (res['StatusCode'] == '00') {

        this.snackbar.open('Saved Successfully');
        this.route.navigate(['/sales/invoices/overview/' + res['DealInvoice']['id']]);
      } else {
        this.snackbar.open(res['StatusDesc'], '', { duration: 2000 });
      }
    }, error => this.saving = false)

  }

  loadAllInstituteContacts(inst) {

    this._institutes
      .filter(institute => institute.instituteId == inst.instituteId)
      .forEach(institute => { this.invoice.institute = institute; console.log(institute) });

    this._inst_contacts = [];
    this.is.getAllInstituteContacts(inst).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this._inst_contacts = res['InstituteContacts'];
      }
    })
  }

  copyBillingAddressFromInstitute() {
    this.invoice.billingTo = 'To'
      + ',\n' + this.invoice.institute.instituteName;
    if (this.invoice.institute.street1 !== undefined && this.invoice.institute.street1 != null && this.invoice.institute.street1 != '')
      this.invoice.billingTo = this.invoice.billingTo + ',\n' + this.invoice.institute.street1
    if (this.invoice.institute.street2 !== undefined && this.invoice.institute.street2 != null && this.invoice.institute.street2 != '')
      this.invoice.billingTo = this.invoice.billingTo + ',\n' + this.invoice.institute.street2
    if (this.invoice.institute.city !== undefined && this.invoice.institute.city != null && this.invoice.institute.city != '')
      this.invoice.billingTo = this.invoice.billingTo + ',\n' + this.invoice.institute.city
    if (this.invoice.institute.state !== undefined && this.invoice.institute.state != null && this.invoice.institute.state != '')
      this.invoice.billingTo = this.invoice.billingTo + ', ' + this.invoice.institute.state
    if (this.invoice.institute.country !== undefined && this.invoice.institute.country != null && this.invoice.institute.country != '')
      this.invoice.billingTo = this.invoice.billingTo + ',\n' + this.invoice.institute.country
    if (this.invoice.institute.zipcode !== undefined && this.invoice.institute.zipcode != null && this.invoice.institute.zipcode != '')
      this.invoice.billingTo = this.invoice.billingTo + ' - ' + this.invoice.institute.zipcode;
  }

  copyShippingAddressFromBillingAddress() {
    this.invoice.shippingTo = this.invoice.billingTo;
  }

  openAddProductModal() {

    this._productsShow = [];
    this._products.filter(prod => {
      let isAdded = true;

      this.invoice.products.forEach(pro => {
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

    if (this.invoice.dealType == 'Sales') {
      if (prod.hsn != '' && prod.hsn != null) {
        desc = desc + "HSN Code : " + prod.hsn;
      }
      if (prod.salesDescription != '' && prod.salesDescription != null) {
        desc = desc + "\n" + prod.salesDescription;
      }
    } else if (this.invoice.dealType == 'AMC') {
      if (prod.amcDescription != '' && prod.amcDescription != null) {
        desc = desc + prod.amcDescription;
      }
    }
    desc = desc.trim();
    return desc;
  }

  getAmount(prod) {
    let amount = 0.00;

    if (this.invoice.dealType == 'Sales') {
      amount = prod.amount;
    } else if (this.invoice.dealType == 'AMC') {
      amount = prod.amcAmount;
    }

    return amount;
  }

  getQuantity(prod) {
    let qty = 0;

    if (this.invoice.dealType == 'AMC') {
      qty = prod.quantity;
    } else {
      qty = 1;
    }

    return qty;
  }

  addProduct(prod) {
    console.log(prod);

    let is_already_available = false;
    this.invoice.products.forEach(prd => {
      if (prd.productId == prod.id)
        is_already_available = true;
    });

    console.log(is_already_available);
    let product: DealInvoiceProducts = new DealInvoiceProducts();
    product.id = 0;
    product.productId = prod.id;
    product.name = prod.name;
    product.description = this.getdescription(prod);
    product.price = this.getAmount(prod);
    product.quantity = this.getQuantity(prod);
    product.uom = prod.uom;
    product.partId = 1;
    product.discount = 0;
    product.discountPercent = 0;
    product.gstPercentage = prod.gst;
    console.log(product);
    if (!is_already_available) {
      this.invoice.products.push(product);
    }
    console.log(this.invoice.products);
    $(function () {
      $('#productaddmodal').appendTo("body").modal('hide');
    });
  }

  hideProductAddModal() {
    $(function () {
      $('#productaddmodal').appendTo("body").modal('hide');
    });
  }

  onChangeDiscountPercent(discountPercent, price) {
    return +(price * (discountPercent / 100)).toFixed(2);
  }

  onChangeDiscountAmount(discount, price) {
    return +((100 * discount) / price).toFixed(2);
  }

  clear() {
    window.location.href = "./sales/invoices/create";
  }

  onAMCFromDateChange(event) {
    console.log(event);
    let toDate: Date = new Date(event);
    toDate.setFullYear(toDate.getFullYear() + 1);
    toDate.setDate(toDate.getDate() - 1);

    console.log(toDate);
    this.invoice.amcToDate = toDate;
  }

  changeDueDate(term) {
    if (this.invoice.invoiceDate == null) {
      this.snackbar.open('Choose Valid Invoice Date');
    } else {
      console.log(this.invoice.invoiceDate);
      let toDate: Date = new Date(this.invoice.invoiceDate);
      if (term == 'Net 15')
        toDate.setDate(toDate.getDate() + 15);
      else if (term == 'Net 30')
        toDate.setDate(toDate.getDate() + 30);
      else if (term == 'Net 45')
        toDate.setDate(toDate.getDate() + 45);
      else if (term == 'Net 60')
        toDate.setDate(toDate.getDate() + 60);
      else if (term == 'Net 90')
        toDate.setDate(toDate.getDate() + 90);

      console.log(toDate);
      this.invoice.dueDate = toDate;
    }
  }

  prefillFromPendingInvoices() {
    this.snackbar.open('fecthing details...');
    if (this.invoice.dealId !== undefined && this.invoice.dealId != null) {
      this.invServ.getPendingInvoiceQuantityProducts({ dealId: this.invoice.dealId })
        .subscribe(resp => {

          if (resp['StatusCode'] == '00') {
            let dealProducts = resp['DealProducts'];
            let dealInvoices: Array<DealInvoice> = resp['DealInvoices'];
            if (dealInvoices.length > 0) {
              if (dealProducts.length > 0) {
                this.invoice.products = dealProducts;

                this.invoice.subTotal = this.su.getSubTotal(this.invoice.products);
                this.invoice.adjustment = this.su.getAdjustment(this.invoice.products);
                this.invoice.discount = this.su.getDiscount(this.invoice.products);
                this.invoice.grandTotal = this.su.getGrandTotal(this.invoice.products);
                this.invoice.tax = this.su.getTaxAmount(this.invoice.products);
              } else {
                this.snackbar.open('It Seems All products are already invoiced');
              }
            } else {
              this.snackbar.open('No Previous Invoices Found');
            }
          }
        })
    } else {
      this.snackbar.open('Deal Cant be empty');
    }
  }

  decideGSTType(event) {
    console.log(event, this._info.gstNo.substring(0, 2));
    try {
      if (this._info.gstNo !== undefined && this._info.gstNo != null && this._info.gstNo != '') {
        let tin = this._state_tin.find(_tin => _tin.stateCode == this._info.gstNo.substring(0, 2));

        let inst = this._institutes.find(_inst => _inst.instituteId == event.instituteId);

        console.log(tin, inst);

        let tin_state: string = tin.stateName;
        let inst_state: string = inst.state;

        if (tin_state.toLowerCase() == inst_state.toLowerCase()) {
          this.invoice.gstType = 'CGST/SGST';
        } else {
          this.invoice.gstType = 'IGST';
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  removeParts() {
    this._show_parts = false;
    this.invoice.products.forEach(prod => prod.partId = 1);
  }

  filterProduct(_event: string) {
    console.log(_event);

    this._productsShow = [];
    this._productsShow = this._products.filter(prod => {

      if (this.invoice.products.find(pro => prod.id == pro.productId) !== undefined)
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

    console.log(this._productsShow);

  }

}
