import { Component, OnInit } from '@angular/core';
import { AgentService } from '../_services/agent.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
  styleUrls: ['./vendor-register.component.css']
})
export class VendorRegisterComponent implements OnInit {

  constructor(private as: AgentService, private actRoute: ActivatedRoute, private route: Router) {
    this.actRoute.queryParams.subscribe(
      params => {
        console.log(params);
        if (params['id']) {
          this.id = params['id'];
        }
      }
    )
  }

  id;
  vendorName = '';
  address1 = '';
  address2 = '';
  city = '';
  state = '';
  country = '';
  pincode;
  vendorLandLine = '';
  vendorPhone;
  vendorEmail = '';
  gstNo = '';
  accountName = '';
  accountNumber = '';
  branchName = '';
  ifscCode = '';
  bankname = '';

  ngOnInit() {
    this.getVendor();
  }
  save() {
    this.as.saveVendor(this.id, this.vendorName, this.address1, this.address2, this.city, this.state, this.country, this.pincode, this.vendorLandLine, this.vendorPhone, this.vendorEmail, this.gstNo, this.accountName, this.accountNumber, this.branchName, this.ifscCode, this.bankname).subscribe(res => {

      console.log(res);
      if (res['StatusCode'] == '00') {
        Swal.fire('Update Successfully', "success");
        this.route.navigate(['/reports/view-vendors']);
      }
      else
        Swal.fire(res['StatusDesc'], "warning")
    })

  }
  getVendor() {
    this.as.getVendor(this.id).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        let vendor = res['vendor'];
        this.vendorName = vendor['vendorName'];
        this.address1 = vendor['address1'];
        this.address2 = vendor['address2'];
        this.city = vendor['city'];
        this.state = vendor['state'];
        this.country = vendor['country'];
        this.pincode = vendor['pincode'];
        this.vendorLandLine = vendor['landLine'];
        this.vendorPhone = vendor['vendorPhone'];
        this.vendorEmail = vendor['vendorEmail'];
        this.gstNo = vendor['gstNo'];
        this.id = vendor['id'];
        this.accountName = vendor['accountName'];
        this.accountNumber = vendor['accountNumber'];
        this.branchName = vendor['branchName'];
        this.ifscCode = vendor['ifscCode'];
        this.bankname = vendor['bankName'];
      }
    })
  }

  preventPhone(event) {
    let value = this.vendorPhone;
    if (value >= 10) {
      event.preventDefault()
      this.vendorPhone = parseInt(value.toString().substring(0, 10));
    }
  }

}
