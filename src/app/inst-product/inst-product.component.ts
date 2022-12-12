import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { InstituteService } from '../_services/institute.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

export const MY_CUSTOM_FORMATS = {
  fullPickerInput: 'DD/MM/YYYY',
  parseInput: 'DD/MM/YYYY',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

@Component({
  selector: 'app-inst-product',
  templateUrl: './inst-product.component.html',
  styleUrls: ['./inst-product.component.css']
})
export class InstProductComponent implements OnInit {

  constructor(private http: HttpClient, private is: InstituteService, private auth: AuthService,
    private actRoute: ActivatedRoute) {
    actRoute.queryParams.subscribe(params => {
      // console.log(params);
      if (params['edit'] == '1') {
        if (params['iid'] && params['iid'].toString() != '') {
          this._selectedInstitute = [{ institute_id: params['iid'], institute_name: params['iin'] }]
          setTimeout(() => {
            this.onSelectInst({ institute_id: params['iid'], institute_name: params['iin'] });
          }, 1000);
        }
      }
    })
  }
  selectedinstitute = '';
  _selectedInstitute = [];
  amcAmount = '12000';
  event = '';
  current_service_under = 'Warranty';
  quantity = 1;
  institute: any = [];
  Product = '';
  prolist: any = [];
  selectedProduct = { name: '' };
  product = [];
  productList = [];
  amcExpiryDate = new Date();
  searchStr = '';

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'institute_id',
    textField: 'institute_name',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _all_productList = [];

  ngOnInit() {
    this.loadInstitute();
    this.getAllProduct();
  }

  loadInstitute() {
    this.institute = [];
    let obs = this.http.post(environment.apiUrl + 'institute/load-institute', '');
    obs.subscribe(
      data => {
        if (data['StatusCode'] == '00') {
          console.log(this.selectedinstitute);
          this.institute = data['institute'];
          if (this.selectedinstitute != '') {
            let inst = this.institute.find(inst => inst.institute_id == this.selectedinstitute);
            this._selectedInstitute = [inst];
          }
        } else
          console.log('Error Loading Institute::');
      },
      error => { console.log(error); }
    );
  }

  getAllProduct() {
    this.productList = [];
    let obs = this.http.post(environment.apiUrl + '/agent/get-products', { emailId: this.auth.getLoginEmailId() });
    obs.subscribe(
      data => {
        if (data['StatusCode'] == '00') {
          this._all_productList = data['productList'];
        } else
          console.log('Error Loading ProductList::');
      },
      error => { console.log(error); }
    );
  }

  onSelectInst(event) {
    console.log(event);
    this.selectedinstitute = event.institute_id;
    this.instChanged();
  }

  instChanged() {
    this.product = [];
    this.productList = [];
    let obs = this.http.post(environment.apiUrl + 'institute/get-institute-products', { institute: { instituteId: this.selectedinstitute } });
    obs.subscribe(
      data => {
        if (data['StatusCode'] == '00') {
          this.product = data['InstituteProducts'];
        } else
          console.log('Error Loading Product::');

        let _not_in_inst_prod = [];

        console.log(this.product);
        console.log(this.productList);

        this._all_productList.forEach(p => {
          let isIP = false;
          this.product.forEach(ip => {
            if (ip.product.id == p.id) {
              isIP = true;
            }
          });

          if (!isIP) {
            _not_in_inst_prod.push(p);
          }
        })
        console.log(_not_in_inst_prod);
        this.productList = _not_in_inst_prod;
      },
      error => { console.log(error); }
    );
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };

  getFromDate(date) {
    // console.log(date);
    if (date == null || date === undefined)
      return null;
    else {
      let dd = date['singleDate'];
      return dd['jsDate'];
    }
  }

  addproduct(product) {
    console.log("Inside add");
    console.log(event);

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to delete once Added!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add it!',
      cancelButtonText: 'No, Close'
    }).then((result) => {
      if (result.value) {
        this.is.addInstProduct(this.selectedinstitute, 0, this.current_service_under, product,
          this.getFromDate(this.amcExpiryDate), this.quantity).subscribe(res => {
            console.log('Response:::::', res);
            if (res['StatusCode'] == '00') {

              $('#modal').appendTo("body").modal('hide');
              this.instChanged();
              Swal.fire('', res['StatusDesc'], 'success');
            } else
              Swal.fire('', res['StatusDesc'], 'warning');
          })
      } else {
        console.log(result);
      }
    })
  }

  removeProduct(product) {

    Swal.fire({
      title: 'Are you sure?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'No, Close'
    }).then((result) => {
      if (result.value) {
        this.is.removeInstProduct(product).subscribe(res => {
          console.log('Response:::::', res);
          if (res['StatusCode'] == '00') {
            this.instChanged();
            Swal.fire('', res['StatusDesc'], 'success');
          } else
            Swal.fire('', res['StatusDesc'], 'warning');
        })
      } else {
        console.log(result);
      }
    })
  }

  openModal(prod) {
    this.selectedProduct = prod;
    $('#modal').appendTo("body").modal('show');
  }

}
