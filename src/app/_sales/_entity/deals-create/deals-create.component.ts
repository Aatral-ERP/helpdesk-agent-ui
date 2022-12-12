import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { SalesService } from 'src/app/_services/sales.service';
import { InstituteService } from 'src/app/_services/institute.service';
import { Deal, Product } from './Deal';
import { TicketService } from 'src/app/_services/ticket.service';
declare var $: any;

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { InfoDetails } from 'src/app/info-details/infoDetails';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import Swal from 'sweetalert2';

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
  selector: 'app-deals-create',
  templateUrl: './deals-create.component.html',
  styleUrls: ['./deals-create.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DealsCreateComponent implements OnInit {

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

  constructor(private route: Router, private snackbar: MatSnackBar, private ts: TicketService,
    public su: SalesUtilService, private ss: SalesService, private is: InstituteService,
    private actRoute: ActivatedRoute) {

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);

      if (params['edit']) {
        if (params['edit'] == 1 && params['did']) {
          this._mode = 'Edit';
          this.loadDealForEdit(params['did']);
        }
      } else if (params['copy']) {
        if (params['copy'] == 1 && params['did']) {
          this._mode = 'Copy';
          this.loadDealForCopy(params['did']);
        }
      } else if (params['prefill-amc-institute']) {
        if (params['prefill-amc-institute'] == 1 && params['iid']) {
          this._mode = 'Add';
          this.deal.dealType = 'AMC';
          this._selectedInstitute = [{ instituteId: params['iid'], instituteName: params['iid'] }];
          this.loadAllInstituteContacts(this._selectedInstitute[0]);
        }
      } else if (params['create-institute-deal']) {
        if (params['create-institute-deal'] == 1 && params['iid']) {
          this._mode = 'Add';
          this.deal.dealType = 'Sales';
          this._selectedInstitute = [{ instituteId: params['iid'], instituteName: params['iid'] }];
          this.loadAllInstituteContacts(this._selectedInstitute[0]);
        }
      }
    })
  }

  _mode = 'Create';
  _show_parts = false;
  deal: Deal = new Deal();
  _institutes: Array<Institute> = [];
  _selectedInstitute = [];

  _inst_contacts = [];

  productName = '';
  _is_products_loading = false;
  _products = [];
  _state_tin = [];
  _info: InfoDetails = new InfoDetails();
  _productsShow = [];

  ngOnInit() {
    this.loadInstituteDetails();
  }

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes', 'products', 'info_min', 'state_tin']).subscribe(res => {
      this._institutes = res['Institutes'];
      this._products = res['Products'];
      this._info = res['InfoDetails'];
      this._state_tin = res['StateTinDetails'];

      this.filterProduct('');

      if (this._selectedInstitute.length > 0) {
        this._institutes
          .filter(inst => inst.instituteId == this._selectedInstitute[0].instituteId)
          .forEach(inst => {
            this.deal.institute = inst;
            this._selectedInstitute = [];
            this._selectedInstitute.push(inst);
            this.copyBillingAddressFromInstitute();
            this.copyShippingAddressFromBillingAddress();
            console.log(inst, this._selectedInstitute);
          });
      };

      this.actRoute.queryParams.subscribe(params => {
        console.log(params);
        if (params['prefill-amc-institute']) {
          if (params['prefill-amc-institute'] == '1' && params['iid']) {
            this._mode = 'Add';
            this.deal.dealType = 'AMC';
            this.getInstituteProducts({ instituteId: params['iid'], instituteName: params['iid'] });
          }
        };

        if (params['prefill-amc-institute'] || params['create-institute-deal']) {
          this.decideGSTType();
        }
      })
    })
  }

  getInstituteProducts(inst) {
    this.ts.getInstituteProducts(inst).subscribe(res => {
      if (res['StatusCode'] == '00') {
        let instituteProducts: Array<any> = res['InstituteProducts'];
        console.log(instituteProducts);

        instituteProducts.forEach(ip => {
          this._products.filter(prod => ip.product.id == prod.id)
            .forEach(prod => {
              let _prod = Object.assign({}, prod);
              _prod.amcAmount = ip.amcAmount;
              _prod.quantity = ip.quantity;
              this.addProduct(_prod);
            });
        });
      }
    })
  }

  loadAllInstituteContacts(inst) {

    this._institutes
      .filter(institute => institute.instituteId == inst.instituteId)
      .forEach(institute => { this.deal.institute = institute; console.log(institute) });

    this._inst_contacts = [];
    this.is.getAllInstituteContacts(inst).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this._inst_contacts = res['InstituteContacts'];
      }
    })
  }
  

  copyBillingAddressFromInstitute() {
    this.deal.billingTo = '';
    this.deal.billingStreet1 = this.deal.institute.street1;
    this.deal.billingStreet2 = this.deal.institute.street2;
    this.deal.billingCity = this.deal.institute.city;
    this.deal.billingState = this.deal.institute.state;
    this.deal.billingCountry = this.deal.institute.country;
    this.deal.billingZIPCode = this.deal.institute.zipcode;
  }

  copyShippingAddressFromBillingAddress() {
    this.deal.shippingTo = this.deal.billingTo;
    this.deal.shippingStreet1 = this.deal.billingStreet1;
    this.deal.shippingStreet2 = this.deal.billingStreet2;
    this.deal.shippingCity = this.deal.billingCity;
    this.deal.shippingState = this.deal.billingState;
    this.deal.shippingCountry = this.deal.billingCountry;
    this.deal.shippingZIPCode = this.deal.billingZIPCode;
  }

  openAddProductModal() {

    this._productsShow = [];
    this._products.filter(prod => {
      let isAdded = true;

      this.deal.products.forEach(pro => {
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
    desc = desc.trim();
    return desc;
  }

  getAmount(prod) {
    let amount = 0.00;

    if (this.deal.dealType == 'Sales') {
      amount = prod.amount;
    } else if (this.deal.dealType == 'AMC') {
      amount = prod.amcAmount;
    }

    return amount;
  }

  getQuantity(prod) {
    let qty = 0;

    if (this.deal.dealType == 'AMC') {
      qty = prod.quantity !== undefined ? prod.quantity : 1;
    } else {
      qty = 1;
    }

    return qty;
  }

  addProduct(prod) {

    let is_already_available = false;
    this.deal.products.forEach(prd => {
      if (prd.productId == prod.id)
        is_already_available = true;
    });

    let product: Product = {
      id: 0,
      productId: prod.id,
      name: prod.name,
      description: this.getdescription(prod),
      price: this.getAmount(prod),
      quantity: this.getQuantity(prod),
      uom: prod.uom,
      partId: 1,
      discount: 0,
      discountPercent: 0,
      gstPercentage: prod.gst
    };

    if (!is_already_available) {
      this.deal.products.push(product);
    }
    $(function () {
      $('#productaddmodal').appendTo("body").modal('hide');
    });
  }

  hideProductAddModal() {
    $(function () {
      $('#productaddmodal').appendTo("body").modal('hide');
    });
  }

  removeParts() {
    this._show_parts = false;
    this.deal.products.forEach(prod => prod.partId = 1);
  }

  saveDeal() {

    this.deal.subTotal = this.su.getSubTotal(this.deal.products);
    this.deal.adjustment = this.su.getAdjustment(this.deal.products);
    this.deal.discount = this.su.getDiscount(this.deal.products);
    this.deal.grandTotal = this.su.getGrandTotal(this.deal.products);
    this.deal.tax = this.su.getTaxAmount(this.deal.products);

    this.ss.saveDeal(this.deal).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {

        this.snackbar.open('Saved Successfully');
        this.route.navigate(['/sales/deals/overview/' + res['Deal']['id']]);
      } else if (res['StatusCode'] == '02') {

        let _err_text = '';
        let errors: Array<any> = res['Errors'];
        errors.forEach(err => {
          _err_text = _err_text + err['StatusDesc'] + '<br>';
        })

        Swal.fire({
          title: 'Errors Found',
          html: _err_text,
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        })
      } else {
        this.snackbar.open(res['StatusDesc'], '', { duration: 2000 });
      }
    })
  }

  loadDealForCopy(did) {
    this.ss.getDealDetails(did).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.deal = res['Deal'];
        this.deal.products = res['DealProducts'];
        let dealContacts: Array<any> = res['DealContacts'];

        this.deal.discountType = 'Amount';

        this.deal.products.forEach(dp => {
          dp.id = 0;
          dp.discountPercent = this.onChangeDiscountAmount(dp.discount, dp.price);
        })

        if (this.su.getPartCounts(this.deal.products) > 1)
          this._show_parts = true;

        this.deal.instituteContacts = [];
        dealContacts.forEach(ic => {
          console.log(ic);
          this.deal.instituteContacts.push({ id: ic.instituteContact.id, firstName: ic.instituteContact.firstName });
        })
        console.log(this.deal.instituteContacts);

        this._selectedInstitute = [{ instituteId: this.deal.institute.instituteId, instituteName: this.deal.institute.instituteName }];

        console.log(this._selectedInstitute);
        this.loadAllInstituteContacts(this.deal.institute);

        this.deal.id = 0;
      } else {
        this.snackbar.open('No Deal Found');
      }
    })
  }

  loadDealForEdit(did) {
    this.ss.getDealDetails(did).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.deal = res['Deal'];
        this.deal.products = res['DealProducts'];
        let dealContacts: Array<any> = res['DealContacts'];

        this.deal.discountType = 'Amount';

        this.deal.products.forEach(dp => {
          dp.discountPercent = this.onChangeDiscountAmount(dp.discount, dp.price);
        })

        if (this.su.getPartCounts(this.deal.products) > 1)
          this._show_parts = true;

        this.deal.instituteContacts = [];
        dealContacts.forEach(ic => {
          console.log(ic);
          this.deal.instituteContacts.push({ id: ic.instituteContact.id, firstName: ic.instituteContact.firstName });
        })
        console.log(this.deal.instituteContacts);

        this._selectedInstitute = [{ instituteId: this.deal.institute.instituteId, instituteName: this.deal.institute.instituteName }];

        console.log(this._selectedInstitute);
        this.loadAllInstituteContacts(this.deal.institute);
      } else {
        this.snackbar.open('No Deal Found');
      }
    })
  }

  onChangeDiscountPercent(discountPercent, price) {
    console.log(price);
    console.log(discountPercent);
    console.log(price * (discountPercent / 100));
    return +(price * (discountPercent / 100)).toFixed(2);
  }

  onChangeDiscountAmount(discount, price) {
    console.log(price);
    console.log(discount);
    console.log(+((100 * discount) / price).toFixed(2));
    return +((100 * discount) / price).toFixed(2);
  }

  clear() {
    window.location.href = "./sales/deals/create";
  }

  decideGSTType() {
    try {
      console.log(this._info.zipcode);
      this.deal.gstType = 'IGST';
      if (this._info.zipcode !== undefined && this._info.zipcode != null && this._info.zipcode != '') {

        let zipcodeIndex = this._info.zipcode.substring(0, 2);
        console.log(zipcodeIndex);

        let tin = this._state_tin.find(_tin => Array.from(_tin.pincodeIndexes).includes(zipcodeIndex));
        console.log(tin);
        if (tin !== undefined) {
          let pincodeIndexes = Array.from(tin.pincodeIndexes);
          console.log(pincodeIndexes);
          if (this.deal.billingZIPCode !== undefined && this.deal.billingZIPCode != null && this.deal.billingZIPCode != '' && this.deal.billingZIPCode.length > 1) {
            console.log(this.deal.billingZIPCode);
            if (pincodeIndexes.includes(this.deal.billingZIPCode.substring(0, 2))) {
              this.deal.gstType = 'CGST/SGST';
            } else {
              this.deal.gstType = 'IGST';
            }
          } else {
            this.deal.gstType = 'IGST';
          }
        } else
          this.deal.gstType = 'IGST';
      }
    } catch (err) {
      console.log(err)
    }
  }

  // decideGSTType(event) {
  //   console.log('Inside decideGSTType', event, this._info.gstNo.substring(0, 2));
  //   try {
  //     if (this._info.gstNo !== undefined && this._info.gstNo != null && this._info.gstNo != '') {
  //       let tin = this._state_tin.find(_tin => _tin.stateCode == this._info.gstNo.substring(0, 2));

  //       let inst = this._institutes.find(_inst => _inst.instituteId == event.instituteId);

  //       console.log(tin, inst);

  //       let tin_state: string = tin.stateName;
  //       let inst_state: string = inst.state;

  //       if (tin_state.toLowerCase() == inst_state.toLowerCase()) {
  //         this.deal.gstType = 'CGST/SGST';
  //       } else {
  //         this.deal.gstType = 'IGST';
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  onAMCFromDateChange(event) {
    console.log(event);
    let toDate: Date = new Date(event);
    toDate.setFullYear(toDate.getFullYear() + 1);
    toDate.setDate(toDate.getDate() - 1);

    console.log(toDate);
    this.deal.amcToDate = toDate;
  }


  filterProduct(_event: string) {
    console.log(_event);

    this._productsShow = [];
    this._productsShow = this._products.filter(prod => {

      if (this.deal.products.find(pro => prod.id == pro.productId) !== undefined)
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
