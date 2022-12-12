import { Component, OnInit } from '@angular/core';
import { PurchaseInputService } from 'src/app/_services/purchase-input.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { Bill, BillAttachment } from '../bills/Bill';
import Swal from 'sweetalert2';
import { PurchaseInputOrder } from '../purchase-input-order-create/PurchaseInputOrder';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-purchase-input-order-overview',
  templateUrl: './purchase-input-order-overview.component.html',
  styleUrls: ['./purchase-input-order-overview.component.css']
})
export class PurchaseInputOrderOverviewComponent implements OnInit {

  constructor(private pis: PurchaseInputService, private actRoute: ActivatedRoute, private auth: AuthService,
    private route: Router, private snackbar: MatSnackBar, public su: SalesUtilService) {
    this.loadOrder(this.actRoute.snapshot.params['id']);
  }

  loading = false;

  showPDFTemplateOptions = false;
  generatingQuotationPDF = false;

  addRoundSeal = true;
  addFullSeal = true;
  addSign = true;
  designation = this.auth.getLoginAgentDesignation();

  order: PurchaseInputOrder = new PurchaseInputOrder();
  ngOnInit() {
  }

  loadOrder(orderId) {
    this.loading = true;
    this.pis.getPurchaseInputOrder(orderId).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        this.order = res['PurchaseInputOrder'];
        this.order.products = res['PurchaseInputOrderProducts'];

        this.order.billingTo = this.order.billingTo.replace(/(?:\r\n|\r|\n)/g, '<br>');
        this.order.shippingTo = this.order.shippingTo.replace(/(?:\r\n|\r|\n)/g, '<br>');

        console.log(this.order);
      }
    }, error => { this.loading = false; })
  }

  EditOrder() {
    this.route.navigateByUrl('/purchase-inputs/orders/create?edit=1&pioid=' + this.order.id);
  }

  deleteOrder() {

    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "This will delete Order Details",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {
        this.pis.deletePurchaseInputOrder(this.order).subscribe(res => {
          if (res['StatusCode'] == "00") {
            this.snackbar.open('Deleted Sucessfully');
            this.route.navigateByUrl('/purchase-inputs/orders');
          } else if (res['StatusCode'] == "03") {
            this.snackbar.open(res['StatusCode']);
          } else {
            this.snackbar.open('Something went wrong , Try later.');
          }
        })
      }
    })
  }


  poFileUploadChange(file: File) {
    console.log(file);

    if (file.type.toLowerCase() != 'application/pdf') {
      this.snackbar.open('Only PDF file type is valid');
      return false;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Upload.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload!'
    }).then((result) => {
      if (result.value) {
        this.generatingQuotationPDF = true;
        this.pis.UploadGeneratedPurchaseInputOrderPDF(this.order.id, file).subscribe(res => {

          this.generatingQuotationPDF = false;
          if (res['StatusCode'] == '00') {
            this.order.filename = res['PurchaseInputOrder']['filename'];
            this.snackbar.open('Uploaded Successfully', 'OK');
            this.viewPDF();
          } else {
            this.snackbar.open('Something went wrong! Try again later', 'OK');
          }
        })
      }
    })
  }

  generatePurchaseInputOrderPDF(Quote_Template) {
    this.generatingQuotationPDF = true;

    this.pis.generatePurchaseInputOrderPDF(this.order, Quote_Template, this.addRoundSeal, this.addFullSeal, this.addSign, this.designation).subscribe(res => {

      this.generatingQuotationPDF = false;
      if (res['StatusCode'] == '00') {
        this.order.filename = res['PurchaseInputOrder']['filename'];
        this.snackbar.open('Generated Successfully', '', { duration: 2000 });
        this.viewPDF();
      } else {
        this.snackbar.open('Something went wrong! Try again later', '', { duration: 2000 });
      }
    })
  }

  viewPDF() {
    let url = environment.apiUrl + 'download/download-purchase-input-pdf/view/' + this.order.id + '/' + this.order.filename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  downloadPDF() {
    let url = environment.apiUrl + 'download/download-purchase-input-pdf/download/' + this.order.id + '/' + this.order.filename;
    window.open(url, '_blank');
  }


}
