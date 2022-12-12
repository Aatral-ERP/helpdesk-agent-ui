import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AgentService } from 'src/app/_services/agent.service';
import { NeededService } from 'src/app/_services/needed.service';
import Swal from 'sweetalert2';
import { ProductsRawMaterials } from '../add-product/ProductsRawMaterials';
import { RawMaterialRequest } from './RawMaterialRequest';
import { RawMaterialRequestProducts } from './RawMaterialRequestProducts';

@Component({
  selector: 'app-request-raw-materials',
  templateUrl: './request-raw-materials.component.html',
  styleUrls: ['./request-raw-materials.component.css']
})
export class RequestRawMaterialsComponent implements OnInit {

  constructor(private ns: NeededService, private as: AgentService,
    private snackbar: MatSnackBar, private actRoute: ActivatedRoute) {
    this.actRoute.queryParams.subscribe(params => {
      this.expandId = params['expand']
    });
    console.log(this.expandId);
  }

  expandId = 0;
  rawMaterialRequest: RawMaterialRequest = new RawMaterialRequest();

  rawMaterialRequestProducts: Array<RawMaterialRequestProducts> = [];

  saving = false;
  loading = false;
  showNewRequest = false;

  rawMaterialRequestsToMe: Array<RawMaterialRequest> = [];

  rawMaterialRequestsByMe: Array<RawMaterialRequest> = [];

  _products = [];
  _agents = [];

  _selectedProduct = [];
  _selectedAgent = [];

  _raw_materials: Array<ProductsRawMaterials> = [];

  _ProductsDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _AgentsDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'emailId',
    textField: 'firstName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  ngOnInit() {
    this.loadNeeded();

    this.getProductsRawMaterialRequests();
  }

  loadNeeded() {
    this.ns.loadNeeded(['agents_min', 'products_min']).subscribe(resp => {
      this._products = resp['products_min'];
      this._agents = resp['agents_min'];
    })
  }

  onProductSelect(product) {
    console.log(product);

    this.rawMaterialRequest.productId = product.id;
    this.rawMaterialRequest.productName = product.name;

    this.rawMaterialRequestProducts = [];
    this.as.getAllProductsRawMaterials(product).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this._raw_materials = resp['ProductsRawMaterials'];

        this._raw_materials.forEach(raw => {
          let _raw: RawMaterialRequestProducts = new RawMaterialRequestProducts();

          _raw.productId = raw.productId;
          _raw.mappedProductId = raw.mappedProductId;
          _raw.mappedProductName = raw.mappedProductName;
          _raw.quantity = raw.quantity;
          _raw.description = raw.description;

          this.rawMaterialRequestProducts.push(_raw);
        });
      }
    })
  }

  onProductDeSelect() {
    this._raw_materials = [];
  }

  getInStock(productId) {

    let prod = this._products.find(prod => prod.id == productId);

    if (prod !== undefined) {
      return prod.stock;
    } else {
      return '-';
    }
  }

  sendRawMaterialsRequest() {
    this.rawMaterialRequest.requestDate = new Date();
    this.rawMaterialRequest.productId = this._selectedProduct[0].id;
    this.rawMaterialRequest.requestBy = this.as.auth.getLoginEmailId();

    console.log(this.rawMaterialRequest);
    console.log(this.rawMaterialRequestProducts);

    if (this.rawMaterialRequestProducts.length == 0) {
      this.snackbar.open('No Raw Materials found');
      return;
    }

    let invalid = false;
    this.rawMaterialRequestProducts.forEach(raw => {
      if (raw.quantity === undefined || isNaN(raw.quantity) || raw.quantity <= 0) {
        this.snackbar.open('"' + raw.mappedProductName + '" has invalid quantity');
        invalid = true;
      }
    });

    if (invalid) {
      return;
    }

    this.saving = true;
    this.as.saveProductsRawMaterialRequest(this.rawMaterialRequest, this.rawMaterialRequestProducts, 'Save')
      .subscribe(resp => {
        this.saving = false;
        this.snackbar.open("Requested Sent");
        this.closeNewRequest();
        this.getProductsRawMaterialRequests();

      }, error => this.saving = false)
  }

  closeNewRequest() {

    this.showNewRequest = false;

    this.rawMaterialRequest = new RawMaterialRequest();
    this.rawMaterialRequestProducts = [];
    this._selectedProduct = [];
    this._selectedAgent = [];
  }

  getProductsRawMaterialRequests() {

    this.loading = true;
    this.as.getProductsRawMaterialRequests()
      .subscribe(resp => {
        this.loading = false;
        this.rawMaterialRequestsToMe = resp['RawMaterialRequestsToMe'];
        this.rawMaterialRequestsByMe = resp['RawMaterialRequestsByMe'];
      }, error => this.loading = false)
  }

  editRequest(request) {

    if (request.rawMaterialRequest.status != 'Requested') {
      this.snackbar.open('You cannot edit this request, It is already Approved/Rejected.');
      return;
    }

    this.rawMaterialRequest = request.rawMaterialRequest;

    this.rawMaterialRequestProducts = request.rawMaterialRequestProducts;

    this._selectedProduct = [this._products.find(prod => prod.id == this.rawMaterialRequest.productId)];
    this._selectedAgent = [this._agents.find(agent => agent.emailId == this.rawMaterialRequest.requestTo)];

    this.showNewRequest = true;

    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  deleteRequest(request) {

    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete this request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.value) {
        this.as.deleteProductsRawMaterialRequest(request.rawMaterialRequest).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('Deleted the request Successfully', '', 'success');
            this.getProductsRawMaterialRequests();
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })

  }

  approveRequest(request) {

    Swal.fire({
      title: 'Are you sure?',
      text: "This will approve this request and Deduct the stock accordingly.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve!'
    }).then((result) => {
      if (result.value) {

        let _req = Object.assign({}, request);

        _req.rawMaterialRequest.status = 'Approved';
        _req.rawMaterialRequest.approvedDate = new Date();
        this.as.saveProductsRawMaterialRequest(_req.rawMaterialRequest, _req.rawMaterialRequestProducts, _req.rawMaterialRequest.status).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('Approved the request Successfully', '', 'success');
            this.getProductsRawMaterialRequests();
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  rejectRequest(request) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will reject this request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject!'
    }).then((result) => {
      if (result.value) {
        let _req = Object.assign({}, request);

        _req.rawMaterialRequest.status = 'Rejected';
        _req.rawMaterialRequest.approvedDate = new Date();

        this.as.saveProductsRawMaterialRequest(_req.rawMaterialRequest, _req.rawMaterialRequestProducts, _req.rawMaterialRequest.status).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('Rejected the request Successfully', '', 'success');
            this.getProductsRawMaterialRequests();
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

}
