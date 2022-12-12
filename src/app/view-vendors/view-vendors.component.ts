import { Component, OnInit } from '@angular/core';
import { AgentService } from '../_services/agent.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-vendors',
  templateUrl: './view-vendors.component.html',
  styleUrls: ['./view-vendors.component.css']
})
export class ViewVendorsComponent implements OnInit {

  constructor(private as: AgentService, private route: Router) { }

  vendorResults = [];
  ngOnInit() {
    this.getVendors();
  }

  getVendors() {
    this.as.getAllVendors().subscribe(res => {
      console.log(res['vendors']);

      this.vendorResults = res['vendors'];
    })
  }

  editVendor(id) {

    this.route.navigate(['/vendor/vendor-register'], { queryParams: { id: id } })

  }
  deleteVendor(id) {
    this.as.deleteVendor(id).subscribe(res => {
      console.log(res);

      if (res['StatusCode'] == '00') {
        Swal.fire('Deleted Successfully', "Success");
        window.location.reload();
      }
      else
        Swal.fire(res['StatusDesc'], "warning");
    })
  }
}
