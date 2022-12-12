import { Component, OnInit } from '@angular/core';
import { PurchaseInputService } from 'src/app/_services/purchase-input.service';
import { Bill, BillAttachment } from '../bills/Bill';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesUtilService } from 'src/app/_services/sales-util.service';

@Component({
  selector: 'app-bill-overview',
  templateUrl: './bill-overview.component.html',
  styleUrls: ['./bill-overview.component.css']
})
export class BillOverviewComponent implements OnInit {

  constructor(private pis: PurchaseInputService, private actRoute: ActivatedRoute,
    private route: Router, private snackbar: MatSnackBar, public su: SalesUtilService) {
    this.bill.id = this.actRoute.snapshot.params['id'];
    this.loadBill(this.bill.id);
  }

  loading = false;

  bill: Bill = new Bill();
  billAttachments: Array<BillAttachment> = [];
  ngOnInit() {
  }

  loadBill(billId) {
    this.loading = true;
    this.pis.getBill(billId).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        this.bill = res['Bill'];
        this.bill.products = res['BillProducts'];
        this.billAttachments = res['BillAttachments'];
      }
    }, error => { this.loading = false; })
  }

  EditBill() {
    this.route.navigateByUrl('/purchase-inputs/bills/create?edit=1&bid=' + this.bill.id);
  }

  deleteBill() {

    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "This will delete Bill Details and All Associated Payments details.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {
        this.pis.deleteBill(this.bill).subscribe(res => {
          if (res['StatusCode'] == "00") {
            this.snackbar.open('Deleted Sucessfully');
            this.route.navigateByUrl('/purchase-inputs/bills');
          } else if (res['StatusCode'] == "03") {
            this.snackbar.open(res['StatusCode']);
          } else {
            this.snackbar.open('Something went wrong , Try later.');
          }
        })
      }
    })
  }

}
